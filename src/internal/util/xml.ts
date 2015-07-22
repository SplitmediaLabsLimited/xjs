import {JSON} from './json';

export class XML {
  private xml: string;

  private static RESERVED_ATTRIBUTES: RegExp = /^(children|tag|value)$/i;

  constructor(json?: JSON) {
    let attributes = '';

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

    this.xml = ['<', json.tag, attributes, '>',
    json.value, '</', json.tag, '>'].join('');
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
