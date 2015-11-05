'use strict';

function DtsSerializer(remap) {
  this.remap = remap;
}

DtsSerializer.prototype = {
  _initializerRegex: /\s*=[^>][^,}]*/g,

  constructor: DtsSerializer,

  declaration: function(buffer, ast) {
    buffer.push(ast.name);
    if (ast.optional) buffer.push('?');
    if (ast.typeParameters) {
      buffer.push('<');
      buffer.push(ast.typeParameters.join(', '));
      buffer.push('>');
    }
    if (ast.parameters) {
      buffer.push('(');
      var parameters = ast.parameters;
      for (var i = 0; i < parameters.length; i++) {
        parameters[i] = parameters[i].replace(this._initializerRegex, '');
      }
      buffer.push(parameters.join(', '));
      buffer.push(')');
    }
    if (!isConstructor(ast)) {
      if (ast.returnType) {
        buffer.push(': ', ast.returnType);
      } else if (ast.parameters) {
        buffer.push(': void');
      } else {
        buffer.push(': any');
      }
    }
    buffer.push(';\n');
  },

  comment: function(buffer, commentText) {
    if (!(commentText && commentText.match(/\S/))) return;

    buffer.push('/**\n');
    commentText.replace(/\n*$/, '').split('\n').forEach(function(line) {
      buffer.push(' * ' + line + '\n');
    });
    buffer.push(' */\n');
  },

  member: function(buffer, ast) {
    if (ast.private || ast.internal) return;

    buffer.push('\n');
    this.comment(buffer, ast.content);

    if (ast.isStatic) buffer.push('static ');
    this.declaration(buffer, ast);
  },

  interfaceOrClass: function(buffer, ast, isInterface) {
    if (ast.abstract) {
      buffer.push('abstract ');
    }

    buffer.push(isInterface ? 'interface ' : 'class ');
    buffer.push(ast.name);
    buffer.push(ast.typeParams);
    buffer.push(ast.heritage);
    buffer.push(' {');
    buffer.indent();
    if (ast.newMember) this.member(buffer, ast.newMember);
    if (ast.callMember) this.member(buffer, ast.callMember);
    if (ast.constructorDoc) this.member(buffer, ast.constructorDoc);

    ast.statics.forEach(function(staticMember) {
      this.member(buffer, staticMember);
    }.bind(this));

    ast.members.forEach(function(member) {
      this.member(buffer, member);
    }.bind(this));

    buffer.unindent();
    buffer.push('}');
  },

  enum: function(buffer, ast) {
    buffer.push('enum ');
    buffer.push(ast.name);
    buffer.push(ast.typeParams);
    buffer.push(ast.heritage);
    buffer.push(' {');
    buffer.indent();

    ast.members.forEach(function(member, index) {
      buffer.push('\n');
      this.comment(buffer, member.content);
      buffer.push(member.name);
      if (index !== (ast.members.length - 1)) {
        buffer.push(',\n');
      }
    }.bind(this));

    buffer.unindent();
    buffer.push('}\n');
  },

  function: function(buffer, ast) {
    buffer.push('function ');
    this.declaration(buffer, ast);
  },

  var: function(buffer, ast) {
    buffer.push('var ');
    this.declaration(buffer, ast);
  },

  let: function(buffer, ast) {
    buffer.push('let ');
    this.declaration(buffer, ast);
  },

  const: function(buffer, ast) {
    buffer.push('const ');
    this.declaration(buffer, ast);
  },

  typeAlias: function(buffer, ast) {
    buffer.push('type ', ast.name, ' = ', ast.returnType);
  },

  serializeExport: function(ast) {
    var buffer = new Buffer();
    buffer.push('\n');

    try {
      this.comment(buffer, ast.content);

      switch (ast.docType) {
        case 'class': this.interfaceOrClass(buffer, ast, false); break;
        case 'interface': this.interfaceOrClass(buffer, ast, true); break;
        case 'function': this.function(buffer, ast); break;
        case 'enum': this.enum(buffer, ast); break;
        case 'var': this.var(buffer, ast); break;
        case 'let': this.let(buffer, ast); break;
        case 'const': this.const(buffer, ast); break;
        case 'type-alias': this.typeAlias(buffer, ast); break;
        default: throw new Error("unknown docType: " + ast.docType);
      }

      var string = buffer.toString();
      for (var key in this.remap) {
        if (this.remap.hasOwnProperty(key)) {
          string = string.replace(new RegExp('\\b' + key + '\\b', 'gm'), this.remap[key]);
        }
      }

      return string;
    } catch (e) {
      console.log(e.toString(), e.stack);
      return 'ERROR: ' + e.toString();
    }
  }
};

function Buffer() {
  this._globalBuffer = [];
  this._indentedBuffer = [];
  this._indentationLevel = 1;
}

Buffer.prototype = {
  constructor: Buffer,

  push: function() {
    this._indentedBuffer.push.apply(this._indentedBuffer, arguments);
  },

  indent: function() {
    this._globalBuffer.push({indentationLevel: this._indentationLevel, content: this._indentedBuffer.join('')});
    this._indentationLevel++;
    this._indentedBuffer = [];
  },

  unindent: function() {
    this._globalBuffer.push({indentationLevel: this._indentationLevel, content: this._indentedBuffer.join('')});
    this._indentationLevel--;
    this._indentedBuffer = [];
  },

  toString: function() {
    if (this._indentationLevel !== 1) {
      throw new Exception("Forgot to unindent? Indentation level: " + this._indentationLevel);
    }

    this.unindent();

    var string = '';

    this._globalBuffer.forEach(function(indentedChunk) {
      var indentation = (new Array(indentedChunk.indentationLevel * 2 + 1)).join(' ');
      indentedChunk.content.split('\n').forEach(function(line) {
        string += indentation + line + '\n';
      });

    });

    return string;
  }
};

function isConstructor(ast) {
  return ast.parameters && ast.name === "constructor";
}

module.exports = {
  DtsSerializer: DtsSerializer
};

