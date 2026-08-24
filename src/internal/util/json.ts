import { XML } from './xml';

export class JSON {
  tag: string;
  children: JSON[];
  value: string;
  selfclosing: boolean;

  /**
   * Builds the legacy JXON shape used by XSplit host XML payloads.
   *
   * The constructor intentionally returns the parsed root node object instead
   * of `this`. Existing code relies on `new JSON(xml)` and `JSON.parse(xml)`
   * producing a node-like object with dynamic XML attributes copied onto it.
   */
  constructor(xml?: any) {
    if (xml === undefined || xml === '') {
      return;
    }

    let sxml: string = xml;

    if (xml instanceof XML) {
      sxml = xml.toString();
    }

    var openingRegex = /<([^\s>/]+)/g;
    var selfCloseRegex = /(\/>)/g;

    var openResult = openingRegex.exec(sxml);
    var selfCloseResult = selfCloseRegex.exec(sxml);

    sxml = sxml.replace(/&/g, '&amp;');

    var xmlDocument = new DOMParser().parseFromString(sxml, 'application/xml');

    if (xmlDocument.getElementsByTagName('parsererror').length > 0) {
      throw new Error('XML parsing error. Invalid XML string');
    }

    var processNode = (node) => {
      var obj = new JSON();
      obj.tag = node.tagName;

      // DOMParser does not preserve whether an empty element came from
      // `<node />` or `<node></node>`, but the host XML round-trip needs that
      // distinction. Keep regex cursors in source order while walking the DOM.
      openResult = openingRegex.exec(sxml);
      if (openResult === null && selfCloseRegex.lastIndex === 0) {
        // this is the last tag, and there are no more self-closing tags
      } else if (openResult === null && selfCloseRegex.lastIndex > 0) {
        // no more opening tags, so by default the self-closing belongs to this
        obj.selfclosing = true;
        selfCloseResult = selfCloseRegex.exec(sxml);
      } else if (openResult !== null && selfCloseRegex.lastIndex > openingRegex.lastIndex) {
        // the self-closing pattern happens after the next opening tag, so
        // obviously current tag is not self-closing
      } else if (
        openResult !== null &&
        selfCloseRegex.lastIndex < openingRegex.lastIndex && // self-closing pattern is here
        selfCloseRegex.lastIndex === openingRegex.lastIndex - openResult[0].length // make sure self-closing pattern belongs to
      ) {
        // tag instead of some substring within
        obj.selfclosing = true;
        selfCloseResult = selfCloseRegex.exec(sxml);
      }

      for (var i = 0; i < node.attributes.length; i++) {
        var att = node.attributes[i];
        obj[att.name] = att.value;
      }

      obj.children = [];

      // Preserve the historic shape: element children are stored in
      // `children`, while text-only nodes become `{ value }` without
      // `children`.
      for (var j = 0; j < node.childNodes.length; j++) {
        var child = node.childNodes[j];
        if (child instanceof Element) {
          obj.children.push(processNode(child));
        }
      }

      // process text value
      if (obj.value === undefined && obj.children.length === 0) {
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
