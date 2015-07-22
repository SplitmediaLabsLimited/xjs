export class JSON {
  tag: string;
  children: JSON[];
  value: string;

  constructor(xml?: any) {
    if (xml === undefined || xml === '') {
      return;
    }

    let sxml: string = xml;

    if (xml instanceof XML) {
      sxml = xml.toString();
    }

    // process short ended tags
    sxml = sxml.replace(
      /<([^\s>]+)([^>]+)\/>/g,
      (match, tagname, attributes) => {
        return ['<', tagname, attributes, '></', tagname, '>'].join('');
      }
    );

    let container: HTMLElement = document.createElement('div');
    container.innerHTML = sxml;

    let obj: JSON = (function processNode(node: HTMLElement) {
      let nodeJSON: JSON = new JSON();

      nodeJSON.tag = node.tagName.toLowerCase();

        // process attributes
        for (var a = 0; a < node.attributes.length; a++) {
          let attribute = node.attributes[a];

          nodeJSON[attribute.name] = attribute.value;
        }

        // process child nodes
        nodeJSON.children = [];

        for (var c = 0; c < node.childNodes.length; c++) {
          let childNode = node.childNodes[c];

          if (childNode instanceof HTMLElement) {
            nodeJSON.children.push(processNode(childNode));
          }
        }

        // process value
        if (
          nodeJSON.value === undefined &&
          nodeJSON.children.length === 0
          ) {
          delete nodeJSON.children;
        nodeJSON.value = node.textContent;
      }

      return nodeJSON;
    })(container);

    obj = obj.children[0];
    return obj;
  }

  static parse(xml: any): JSON {
    return new JSON(xml);
  }
}
