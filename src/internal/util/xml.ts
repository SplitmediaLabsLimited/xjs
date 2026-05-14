import type { JSON } from './json';

export class XML {
  private xml: string;

  private static RESERVED_ATTRIBUTES: RegExp = /^(children|tag|value|selfclosing)$/i;

  /**
   * Serializes the legacy JXON node shape back into XSplit host XML.
   *
   * Dynamic object properties become XML attributes; reserved node fields are
   * structural and must not be emitted as attributes.
   */
  constructor(json?: JSON) {
    let attributes = '';
    const value = '';

    if (json.value === undefined) {
      json.value = '';
    }

    for (const key in json) {
      if (!XML.RESERVED_ATTRIBUTES.test(key) && json[key] !== undefined) {
        attributes += [' ', key, '="', json[key], '"'].join('');
      }
    }

    if (json.children === undefined) {
      json.children = [];
    }

    for (var child of json.children) {
      json.value += new XML(child).toString();
    }

    if (json.selfclosing === true) {
      this.xml = ['<', json.tag, attributes, '/>'].join('');
    } else if (value !== '') {
      this.xml = ['<', json.tag, attributes, '>', value, '</', json.tag, '>'].join('');
    } else {
      // json actually contains text content
      this.xml = ['<', json.tag, attributes, '>', json.value, '</', json.tag, '>'].join('');
    }
  }

  toString() {
    return this.xml;
  }

  static parseJSON(json: JSON): XML {
    return new XML(json);
  }

  static encode(str: string) {
    return str.replace(
      /[&<>'']/g,
      ($0) =>
        '&' +
        {
          '&': 'amp',
          '<': 'lt',
          '>': 'gt',
          "'": 'quot',
          '"': '#39',
        }[$0] +
        ';'
    );
  }
}
