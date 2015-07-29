import {JSON} from './json';

export class XML {
  private xml: string;

  private static RESERVED_ATTRIBUTES: RegExp = /^(children|tag|value|selfclosing)$/i;

  constructor(json?: JSON) {
    let attributes = '';
    let value = '';

    if (json.value  === undefined) {
      json.value = '';
    }

    for (let key in json) {
      if (!XML.RESERVED_ATTRIBUTES.test(key) &&
        json[key] !== undefined ) {
        attributes += [' ', key, '=\'', json[key], '\''].join('');
      }
    }

    if (json.children === undefined) {
      json.children = [];
    }

    for (var child of json.children) {
      json.value += new XML(child).toString();
    }

    if (json.selfclosing === true) {
      this.xml = ['<', json.tag, attributes, ' />'].join('');
    } else if (value !== '') {
      this.xml = ['<', json.tag, attributes, '>',
      value, '</', json.tag, '>'].join('');
    } else {
      // json actually contains text content
      this.xml = ['<', json.tag, attributes, '>',
      json.value, '</', json.tag, '>'].join('');
    }
  }

  toString() {
    return this.xml;
  }

  static parseJSON(json: JSON): XML {
    return new XML(json);
  }

  static encode(str: string)
  {
    return str.replace(/[&<>'']/g, function($0) {
      return '&' + {
        '&':  'amp',
        '<':  'lt',
        '>':  'gt',
        '\'': 'quot',
        '"':  '#39'
      }[$0] + ';';
    });
  }
}
