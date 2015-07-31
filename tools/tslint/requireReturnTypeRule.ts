/// <reference path="../../node_modules/typescript/bin/typescriptServices.d.ts" />
/// <reference path="../../node_modules/gulp-tslint/node_modules/tslint/lib/tslint.d.ts" />

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "missing type declaration";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const typedefWalker = new TypedefWalker(sourceFile, this.getOptions());
    return this.applyWithWalker(typedefWalker);
  }
}

class TypedefWalker extends Lint.RuleWalker {
  hasReturnStatement: boolean;

  public visitFunctionDeclaration(node: ts.FunctionDeclaration) {
    this.hasReturnStatement = false;
    super.visitFunctionDeclaration(node);
    if (this.hasReturnStatement) {
      this.handleCallSignature(node);
    }
  }
  public visitFunctionExpression(node: ts.FunctionExpression) {
    let orig = this.hasReturnStatement;
    super.visitFunctionExpression(node);
    this.hasReturnStatement = orig;
  }
  public visitMethodDeclaration(node: ts.MethodDeclaration) {
    this.hasReturnStatement = false;
    super.visitMethodDeclaration(node);
    if (this.hasReturnStatement) {
      this.handleCallSignature(node);
    }
  }
  public visitReturnStatement(node: ts.ReturnStatement) {
    if (node.expression) {
      this.hasReturnStatement = true;
    }
    super.visitReturnStatement(node);
  }

  private handleCallSignature(node: ts.SignatureDeclaration) {
    const location = (node.parameters != null) ? node.parameters.end : null;
    // set accessors can't have a return type.
    if (node.kind !== ts.SyntaxKind.SetAccessor) {
      this.checkTypeAnnotation(location, node.type, node.name);
    }
  }

  private checkTypeAnnotation(location: number, typeAnnotation: ts.TypeNode, name?: ts.Node) {
    if (typeAnnotation == null) {
      let ns = "<name missing>";
      if (name != null && name.kind === ts.SyntaxKind.Identifier) {
        ns = (<ts.Identifier>name).text;
      }
      if (ns.charAt(0) === '_') return;
      let failure = this.createFailure(location, 1, "expected " + ns + " to have a return type");
      this.addFailure(failure);
    }
  }
}
