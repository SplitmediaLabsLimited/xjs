import {XML} from './xml';

export class JSON {
  tag: string;
  children: JSON[];
  value: string;
  selfclosing: boolean;

  constructor(xml?: any) {
    if (xml === undefined || xml === '') {
      return;
    }

    let sxml: string = xml;

    if (xml instanceof XML) {
      sxml = xml.toString();
    }

    var openingRegex = /<([^\s>\/]+)/g;
    var selfCloseRegex = /(\/>)/g;

    var openResult = openingRegex.exec(sxml);
    var selfCloseResult = selfCloseRegex.exec(sxml);

    sxml = sxml.replace(/&/g, '&amp;');

    var xmlDocument = (new DOMParser()).parseFromString(sxml,
      'application/xml');

    if (xmlDocument.getElementsByTagName('parsererror').length > 0) {
      throw new Error('XML parsing error. Invalid XML string');
    }

    var processNode = function(node) {
      var obj = new JSON();
      obj.tag = node.tagName;

      // FIXME: optimize complex condition
      // every time we process a new node, we advance the opening tag regex
      openResult = openingRegex.exec(sxml);
      if (openResult === null && selfCloseRegex.lastIndex === 0) {
        // this is the last tag, and there are no more self-closing tags
      } else if (openResult === null && selfCloseRegex.lastIndex > 0) {
        // no more opening tags, so by default the self-closing belongs to this
          obj.selfclosing = true;
          selfCloseResult = selfCloseRegex.exec(sxml);
      } else if (openResult !== null &&
          selfCloseRegex.lastIndex > openingRegex.lastIndex) {
        // the self-closing pattern happens after the next opening tag, so
        // obviously current tag is not self-closing
      } else if (openResult !== null &&
          selfCloseRegex.lastIndex < openingRegex.lastIndex && // self-closing pattern is here
          selfCloseRegex.lastIndex === openingRegex.lastIndex -
            openResult[0].length // make sure self-closing pattern belongs to
            ) {                  // tag instead of some substring within
          obj.selfclosing = true;
          selfCloseResult = selfCloseRegex.exec(sxml);
      }

      for (var i = 0; i < node.attributes.length; i++) {
        var att = node.attributes[i];
        obj[att.name] = att.value;
      }

      obj.children = [];

      // FIXME: self-closing nodes do not have children, maybe optimize then?
      for (var j = 0; j < node.childNodes.length; j++) {
        var child = node.childNodes[j];
        if (child instanceof Element) {
          obj.children.push(processNode(child));
        }
      }

      // process text value
      if ( obj.value === undefined && obj.children.length === 0) {
        delete obj.children;
        obj.value = node.textContent;
      }

      return obj;
    };

    return processNode(xmlDocument.childNodes[0]);
  }

  static parse(xml: any): JSON {
    return new JSON(xml);
  }
}
