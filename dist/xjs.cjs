"use strict";
var _a;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
class Color {
  constructor(props) {
    if (props["rgb"] !== void 0) {
      this.setRgb(props["rgb"]);
    } else if (props["irgb"] !== void 0) {
      this.setIrgb(props["irgb"]);
    } else if (props["bgr"] !== void 0) {
      this.setBgr(props["bgr"]);
    } else if (props["ibgr"] !== void 0) {
      this.setIbgr(props["ibgr"]);
    } else if (props["isTransparent"] !== void 0 && props["isTransparent"] === true) {
      this.setTransparent();
    } else {
      throw new Error("Do not call Color constructor without parameters.");
    }
  }
  static fromRGBString(rgb) {
    return new Color({ rgb });
  }
  static fromRGBInt(irgb) {
    return new Color({ irgb });
  }
  static fromBGRString(bgr) {
    return new Color({ bgr });
  }
  static fromBGRInt(ibgr) {
    return new Color({ ibgr });
  }
  static fromTransparent() {
    return new Color({ isTransparent: true });
  }
  getRgb() {
    return this._rgb;
  }
  setRgb(rgb) {
    this._rgb = rgb.replace(/^#/, "").toUpperCase();
    this._irgb = parseInt(this._rgb, 16);
    this._bgr = [
      this._rgb.substring(4, 6),
      this._rgb.substring(2, 4),
      this._rgb.substring(0, 2)
    ].join("").toUpperCase();
    this._ibgr = parseInt(this._bgr, 16);
    this._transparent = false;
    return this;
  }
  getBgr() {
    return this._bgr;
  }
  setBgr(bgr) {
    this.setRgb([
      bgr.substring(4, 6),
      bgr.substring(2, 4),
      bgr.substring(0, 2)
    ].join(""));
    return this;
  }
  getIrgb() {
    return this._irgb;
  }
  setIrgb(irgb) {
    let rgb = irgb.toString(16);
    while (rgb.length < 6) {
      rgb = "0" + rgb;
    }
    this.setRgb(rgb);
    return this;
  }
  getIbgr() {
    return this._ibgr;
  }
  setIbgr(ibgr) {
    var bgr = ibgr.toString(16);
    while (bgr.length < 6) {
      bgr = "0" + bgr;
    }
    this.setBgr(bgr);
    return this;
  }
  setTransparent() {
    this._rgb = "0";
    this._irgb = 0;
    this._bgr = "0";
    this._ibgr = 0;
    this._transparent = true;
    return this;
  }
  isTransparent() {
    return this._transparent;
  }
}
class Rectangle {
  /** Gets the top value */
  getTop() {
    return this._top;
  }
  /** Sets the top value */
  setTop(top) {
    this._top = top;
    if (this._bottom !== void 0 && this._height !== this._top - this._bottom) {
      this.setHeight(Math.abs(this._top - this._bottom));
    } else if (this._height !== void 0 && this._bottom !== this._top + this._height) {
      this.setBottom(this._top + this._height);
    }
    return this;
  }
  /** Gets the left value */
  getLeft() {
    return this._left;
  }
  /** Sets the left value */
  setLeft(left) {
    this._left = left;
    if (this._right !== void 0 && this._width !== Math.abs(this._right - this._left)) {
      this.setWidth(Math.abs(this._right - this._left));
    } else if (this._width !== void 0 && this._height !== this._left + this._width) {
      this.setRight(this._left + this._width);
    }
    return this;
  }
  /** Gets the right value */
  getRight() {
    return this._right;
  }
  /** Sets the right value */
  setRight(right) {
    this._right = right;
    if (this._left !== void 0 && this._width !== Math.abs(this._right - this._left)) {
      this.setWidth(Math.abs(this._right - this._left));
    } else if (this._width !== void 0 && this._left !== this._right - this._width) {
      this.setLeft(this._right - this._width);
    }
    return this;
  }
  /** Gets the bottom value */
  getBottom() {
    return this._bottom;
  }
  /** Sets the bottom value */
  setBottom(bottom) {
    this._bottom = bottom;
    if (this._top !== void 0 && this._height !== Math.abs(this._top - this._bottom)) {
      this.setHeight(Math.abs(this._top - this._bottom));
    } else if (this._height !== void 0 && this._top !== this._bottom - this._height) {
      this.setTop(this._bottom - this._height);
    }
    return this;
  }
  /** Gets the width value */
  getWidth() {
    return this._width;
  }
  /** Sets the width value */
  setWidth(width) {
    this._width = width;
    if (this._right !== void 0 && this._left !== this._right - this._width) {
      this.setLeft(this._right - this._width);
    } else if (this._left !== void 0 && this._right !== this._left + this._width) {
      this.setRight(this._left + this._width);
    }
    return this;
  }
  /** Gets the height value */
  getHeight() {
    return this._height;
  }
  /** Sets the height value */
  setHeight(height) {
    this._height = height;
    if (this._top !== void 0 && this._bottom !== this._top + this._height) {
      this.setBottom(this._top + this._height);
    } else if (this._bottom !== void 0 && this._top !== this._bottom - this._height) {
      this.setTop(this._bottom - this._height);
    }
    return this;
  }
  /**
   *  param: (width: number, height: number)
   *  ```
   *  return: Rectangle
   *  ```
   *  Creates a rectangle from width and height dimensions. Absolute (pixels)
   *  and relative (0-1) dimensions are accepted. Refer to the documentation
   *  of each individual function to see which one is necessary.
   */
  static fromDimensions(width, height) {
    if (width < 0 || height < 0) {
      throw new Error("Rectangle dimensions cannot be negative.");
    }
    let rect = new Rectangle();
    rect._width = width;
    rect._height = height;
    return rect;
  }
  /**
   *  param: (left: number, top: number, right: number, bottom: number)
   *  ```
   *  return: Rectangle
   *  ```
   *  Creates a rectangle from coordinates. Absolute (pixels)
   *  and relative (0-1) dimensions are accepted. Refer to the documentation
   *  of each individual function to see which one is necessary.
   */
  static fromCoordinates(left, top, right, bottom) {
    if (top > bottom) {
      throw new Error("Top coordinate must be smaller than bottom.");
    } else if (left > right) {
      throw new Error("Right coordinate must be smaller than left.");
    }
    let rect = new Rectangle();
    rect._top = top;
    rect._left = left;
    rect.setRight(right);
    rect.setBottom(bottom);
    return rect;
  }
  /**
   *  return: string
   *
   *  Returns a comma-separated string containing the width and height values.
   */
  toDimensionString() {
    return this._width + "," + this._height;
  }
  /**
   *  return: string
   *
   *  Returns a comma-separated string containing the coordinates in the order:
   *  left, top, right, bottom.
   */
  toCoordinateString() {
    if ([this._left, this._right, this._top, this._bottom].indexOf(void 0) > -1) {
      throw new Error("This Rectangle instance does not have coordinates.");
    } else {
      return this._left + "," + this._top + "," + this._right + "," + this._bottom;
    }
  }
  /**
   *  return: string
   *  ```
   *  param: (format ?: string)
   *  ```
   *  Returns a string representation of the Rectangle object. If the format
   *  optional parameter is omitted, then this is simply the string from
   *  `toDimensionString()`. Sample usage:
   *
   *  ```javascript
   *  console.log(rect.toString('Origin is at (:left, :top)'));```
   *
   *  You can format the output string by specifying the following markers in
   *  the parameter:
   *  - :left
   *  - :top
   *  - :right
   *  - :bottom
   *  - :width
   *  - :height
   */
  toString(value2) {
    if (value2 === void 0) {
      return this.toDimensionString();
    } else {
      let format = value2;
      format = format.replace(":left", String(this._left));
      format = format.replace(":top", String(this._top));
      format = format.replace(":right", String(this._right));
      format = format.replace(":bottom", String(this._bottom));
      format = format.replace(":width", String(this._width));
      format = format.replace(":height", String(this._height));
      return format;
    }
  }
}
const minVersion = "2.8.1603.0401";
const deleteSceneEventFixVersion = "2.8.1606.1601";
const addSceneEventFixVersion = "2.8.1606.1701";
const handlePreStreamDialogFixVersion = "3.1.1707.3101";
const globalsrcMinVersion = "2.9";
const itemSubscribeEventVersion = "2.9.1608.2301";
const sceneUidMinVersion = "3.0.1704.2101";
const sceneUidAddDeleteVersion = "3.3.1801.1901";
const scenePresetsVersion = "3.8.1905.2118";
const sceneSourceVersion = "3.8.1915.2501";
let mockVersion = "";
function versionCompare(version) {
  const parts = version.split(".");
  const comp = (prev, curr, idx) => {
    if (parts[idx] < curr && prev !== -1 || prev === 1) {
      return 1;
    } else if (parts[idx] > curr || prev === -1) {
      return -1;
    } else {
      return 0;
    }
  };
  return {
    is: {
      lessThan: (compare) => {
        let cParts = compare.split(".");
        return cParts.reduce(comp, parts[0]) === 1;
      },
      greaterThan: (compare) => {
        let cParts = compare.split(".");
        return cParts.reduce(comp, parts[0]) === -1;
      },
      equalsTo: (compare) => {
        let cParts = compare.split(".");
        return cParts.reduce(comp, parts[0]) === 0;
      },
      greaterThanOrEqualTo: (compare) => {
        let cParts = compare.split(".");
        return cParts.reduce(comp, parts[0]) === -1 || cParts.reduce(comp, parts[0]) === 0;
      }
    }
  };
}
function setMockVersion(version) {
  mockVersion = version;
}
function getVersion() {
  let xbcPattern = /(?:XSplit Broadcaster\s|XSplit\sBroadcaster\sPTR\s|XSplitBroadcaster\/|XSplitBroadcasterPTR\/)(.*?)\s/;
  let xbcMatch = navigator.appVersion.match(xbcPattern);
  xbcMatch = xbcMatch || mockVersion.match(xbcPattern);
  if (xbcMatch !== null) {
    return xbcMatch[1];
  } else {
    throw new Error("not loaded in XSplit Broadcaster");
  }
}
let win = {};
if (typeof window !== "undefined") {
  win = window;
} else if (typeof global !== "undefined") {
  win = global;
} else if (typeof self !== "undefined") {
  win = self;
} else {
  win = {};
}
const window$1 = win;
class Environment {
  /**
   * This method is only used internally.
   */
  static initialize() {
    if (Environment._initialized) {
      return;
    }
    Environment._isSourcePlugin = window$1.external && window$1.external["GetConfiguration"] !== void 0;
    Environment._isSourceProps = window$1.external && window$1.external["GetConfiguration"] === void 0 && window$1.external["GetViewId"] !== void 0 && window$1.external["GetViewId"]() !== void 0;
    Environment._isExtension = window$1.external && window$1.external["GetConfiguration"] === void 0 && window$1.external["GetViewId"] !== void 0 && window$1.external["GetViewId"]() === void 0;
    Environment._initialized = true;
  }
  /**
   * return: boolean
   *
   * Determines if this HTML is running as a source.
   */
  static isSourcePlugin() {
    return Environment._isSourcePlugin;
  }
  /**
   * return: boolean
   *
   * Determines if this HTML is running within the source properties window.
   */
  static isSourceProps() {
    return Environment._isSourceProps;
  }
  /**
   * return: boolean
   *
   * Determines if this HTML is running as an extension plugin.
   */
  static isExtension() {
    if (Remote.remoteType === "remote") {
      return true;
    } else {
      return Environment._isExtension;
    }
  }
}
const _XML = class _XML {
  constructor(json) {
    let attributes = "";
    if (json.value === void 0) {
      json.value = "";
    }
    for (let key in json) {
      if (!_XML.RESERVED_ATTRIBUTES.test(key) && json[key] !== void 0) {
        attributes += [" ", key, '="', json[key], '"'].join("");
      }
    }
    if (json.children === void 0) {
      json.children = [];
    }
    for (var child of json.children) {
      json.value += new _XML(child).toString();
    }
    if (json.selfclosing === true) {
      this.xml = ["<", json.tag, attributes, "/>"].join("");
    } else {
      this.xml = [
        "<",
        json.tag,
        attributes,
        ">",
        json.value,
        "</",
        json.tag,
        ">"
      ].join("");
    }
  }
  toString() {
    return this.xml;
  }
  static parseJSON(json) {
    return new _XML(json);
  }
  static encode(str) {
    return str.replace(/[&<>'']/g, function($0) {
      return "&" + {
        "&": "amp",
        "<": "lt",
        ">": "gt",
        "'": "quot",
        '"': "#39"
      }[$0] + ";";
    });
  }
};
_XML.RESERVED_ATTRIBUTES = /^(children|tag|value|selfclosing)$/i;
let XML = _XML;
let JSON$1 = class JSON2 {
  constructor(xml) {
    if (xml === void 0 || xml === "") {
      return;
    }
    let sxml = xml;
    if (xml instanceof XML) {
      sxml = xml.toString();
    }
    var openingRegex = /<([^\s>\/]+)/g;
    var selfCloseRegex = /(\/>)/g;
    var openResult = openingRegex.exec(sxml);
    selfCloseRegex.exec(sxml);
    sxml = sxml.replace(/&/g, "&amp;");
    var xmlDocument = new DOMParser().parseFromString(
      sxml,
      "application/xml"
    );
    if (xmlDocument.getElementsByTagName("parsererror").length > 0) {
      throw new Error("XML parsing error. Invalid XML string");
    }
    var processNode = function(node) {
      var obj = new JSON2();
      obj.tag = node.tagName;
      openResult = openingRegex.exec(sxml);
      if (openResult === null && selfCloseRegex.lastIndex === 0) ;
      else if (openResult === null && selfCloseRegex.lastIndex > 0) {
        obj.selfclosing = true;
        selfCloseRegex.exec(sxml);
      } else if (openResult !== null && selfCloseRegex.lastIndex > openingRegex.lastIndex) ;
      else if (openResult !== null && selfCloseRegex.lastIndex < openingRegex.lastIndex && // self-closing pattern is here
      selfCloseRegex.lastIndex === openingRegex.lastIndex - openResult[0].length) {
        obj.selfclosing = true;
        selfCloseRegex.exec(sxml);
      }
      for (var i = 0; i < node.attributes.length; i++) {
        var att = node.attributes[i];
        obj[att.name] = att.value;
      }
      obj.children = [];
      for (var j = 0; j < node.childNodes.length; j++) {
        var child = node.childNodes[j];
        if (child instanceof Element) {
          obj.children.push(processNode(child));
        }
      }
      if (obj.value === void 0 && obj.children.length === 0) {
        delete obj.children;
        obj.value = node.textContent;
      }
      return obj;
    };
    return processNode(xmlDocument.childNodes[0]);
  }
  static parse(xml) {
    return new JSON2(xml);
  }
};
let App$1 = class App2 {
  /** Get the value of the given property */
  static get(name) {
    return new Promise((resolve2) => {
      exec("AppGetPropertyAsync", name, resolve2);
    });
  }
  /** Sets the value of a property */
  static set(name, value2) {
    return new Promise((resolve2) => {
      exec("AppSetPropertyAsync", name, value2, (ret) => {
        resolve2(Number(ret) < 0 ? false : true);
      });
    });
  }
  /** Gets the value of the given property as list */
  static getAsList(name) {
    return new Promise((resolve2, reject2) => {
      App2.get(name).then((xml) => {
        try {
          let propsJSON = JSON$1.parse(xml), propsArr = [];
          if (propsJSON.children && propsJSON.children.length > 0) {
            propsArr = propsJSON.children;
          }
          resolve2(propsArr);
        } catch (e) {
          reject2(e);
        }
      });
    });
  }
  /** Gets all the items of the given condition as list */
  static getAsItemList(name) {
    return new Promise((resolve2, reject2) => {
      let propsArr = [];
      App2.get(name).then((xml) => {
        try {
          let propsJSON = JSON$1.parse(xml);
          const recursion = (children) => {
            children.forEach((child) => {
              if (child["tag"] === "item") propsArr.push(child);
              if (child["type"] === "12" && child.children && child.children.length > 0) {
                child.children.forEach((placement) => {
                  if (placement["tag"] === "placement" && placement.children && placement.children.length > 0) {
                    recursion(placement.children);
                  }
                });
              }
            });
          };
          if (propsJSON["tag"] === "configuration" && propsJSON.children && propsJSON.children.length > 0) {
            propsJSON.children.forEach((placement) => {
              if (placement["tag"] === "placement" && placement.children && placement.children.length > 0) {
                recursion(placement.children);
              }
            });
          } else if (propsJSON["tag"] === "placement" && propsJSON.children && propsJSON.children.length > 0) {
            recursion(propsJSON.children);
          }
          resolve2(propsArr);
        } catch (e) {
          resolve2(propsArr);
        }
      });
    });
  }
  /** Get the value of the given global property */
  static getGlobalProperty(name) {
    return new Promise((resolve2) => {
      exec("GetGlobalProperty", name).then((result) => {
        resolve2(result);
      });
    });
  }
  /** Calls a DLL function synchronously */
  static callDll(func, ...arg) {
    var args = [].slice.call(arguments);
    return new Promise((resolve2) => {
      args.unshift("CallDll");
      exec.apply(this, args).then((result) => {
        resolve2(result);
      });
    });
  }
  /** Calls an application method asynchronously */
  static callFunc(func, ...args) {
    return new Promise((resolve2) => {
      exec("AppCallFuncAsync", func, ...args, (ret) => {
        resolve2(ret);
      });
    });
  }
  static postMessage(key, ...args) {
    return new Promise((resolve2) => {
      args.unshift(key);
      args.unshift("PostMessageToParent");
      args.push((val) => {
        resolve2(val);
      });
      exec.apply(this, args);
    });
  }
};
let Item$1 = (_a = class {
  /** Prepare an item for manipulation */
  static attach(itemID, callBack) {
    return new Promise((resolve2) => {
      let slot = _a.itemSlotMap.indexOf(itemID);
      if (slot === -1) {
        slot = ++_a.lastSlot % _a.MAX_SLOTS;
        if (_a.islockedSourceSlot && slot === 0) {
          ++slot;
        }
        _a.lastSlot = slot;
        _a.itemSlotMap[slot] = itemID;
      }
      if (!Environment.isSourcePlugin()) {
        exec(
          "SearchVideoItem" + (String(slot) === "0" ? "" : slot + 1),
          itemID
        );
      } else {
        let hasGlobalSources = versionCompare(getVersion()).is.greaterThan(minVersion);
        if (hasGlobalSources) {
          exec(
            "AttachVideoItem" + (slot + 1),
            itemID
          );
        } else {
          exec(
            "AttachVideoItem" + (String(slot) === "0" ? "" : slot + 1),
            itemID
          );
        }
      }
      if (callBack) {
        callBack.call(this, slot);
      } else {
        resolve2(slot);
      }
    });
  }
  /** used for source plugins. lock an id to slot 0 */
  static lockSourceSlot(itemID) {
    if (itemID !== void 0) {
      _a.islockedSourceSlot = true;
      _a.itemSlotMap[0] = itemID;
    } else {
      _a.islockedSourceSlot = false;
      _a.itemSlotMap[0] = "";
    }
  }
  /**
   * Helper function to check if the supplied item id still exist.
   */
  static wrapGet(name, srcId, id, updateId) {
    return new Promise((resolve2) => {
      if (versionCompare(getVersion()).is.lessThan(minVersion)) {
        _a.get(name, id).then((val) => {
          resolve2(val);
        });
      } else {
        _a.get("itemlist", id).then((itemlist) => {
          return new Promise((resolveInner) => {
            const itemsArray = itemlist.split(",");
            if (itemsArray.indexOf(id) > -1 && itemsArray.length > 0 && itemsArray[0] !== "null") {
              resolveInner(itemsArray[0]);
            } else {
              let idMatch, sceneMatch;
              App$1.getAsItemList("sceneconfig").then((jsonArr) => {
                for (var i = 0; i < jsonArr.length; i++) {
                  if (jsonArr[i] !== void 0) {
                    if (jsonArr[i]["srcid"] === srcId) {
                      sceneMatch = i;
                      idMatch = jsonArr[i]["id"];
                      break;
                    }
                  }
                  if (idMatch !== void 0) {
                    break;
                  }
                }
                if (idMatch !== void 0) {
                  return new Promise((previewResolve) => {
                    previewResolve("");
                  });
                } else {
                  return new Promise((previewResolve, previewReject) => {
                    App$1.getAsItemList("sceneconfig:i12").then((previewJSONArr) => {
                      let previewMatch = "";
                      for (var k = 0; k < previewJSONArr.length; ++k) {
                        if (previewJSONArr[k]["srcid"] === srcId) {
                          previewMatch = previewJSONArr[k]["id"];
                          break;
                        }
                      }
                      previewResolve(previewMatch);
                    }).catch((e) => {
                      previewReject(e);
                    });
                  });
                }
              }).then((previewId) => {
                if (previewId !== "") {
                  idMatch = previewId;
                  sceneMatch = "i12";
                }
                if (idMatch !== void 0) {
                  updateId(idMatch, sceneMatch);
                  resolveInner(idMatch);
                } else {
                  resolveInner(id);
                }
              }).catch((e) => {
                resolveInner(id);
              });
            }
          });
        }).then((resultId) => {
          _a.get(name, resultId).then((val) => {
            resolve2(val);
          });
        });
      }
    });
  }
  /** Get an item's local property asynchronously */
  static get(name, id) {
    return new Promise((resolve2) => {
      let hasGlobalSources = versionCompare(getVersion()).is.greaterThan(minVersion);
      const execCallFunc = (slot) => {
        if (!Environment.isSourcePlugin() && String(slot) === "0" || Environment.isSourcePlugin() && String(slot) === "0" && !hasGlobalSources) {
          slot = -1;
        }
        exec(
          "GetLocalPropertyAsync" + (String(slot) === "-1" ? "" : Number(slot) + 1),
          name,
          (val) => {
            resolve2(val);
          }
        );
      };
      const checkSlot = (recId) => {
        if (id) {
          _a.attach(id, execCallFunc);
        } else {
          execCallFunc(-1);
        }
      };
      checkSlot();
    });
  }
  /**
   * Helper function to check if the supplied item id still exist.
   */
  static wrapSet(name, value2, srcId, id, updateId) {
    return new Promise((resolve2) => {
      if (versionCompare(getVersion()).is.lessThan(minVersion)) {
        _a.set(name, value2, id).then((val) => {
          resolve2(val);
        });
      } else {
        _a.get("itemlist", id).then((itemlist) => {
          return new Promise((resolveInner) => {
            const itemsArray = itemlist.split(",");
            if (itemsArray.indexOf(id) > -1 && itemsArray.length > 0 && itemsArray[0] !== "null") {
              resolveInner(itemsArray[0]);
            } else {
              let idMatch, sceneMatch;
              App$1.getAsItemList("sceneconfig").then((jsonArr) => {
                for (var i = 0; i < jsonArr.length; i++) {
                  if (jsonArr[i] !== void 0) {
                    if (jsonArr[i]["srcid"] === srcId) {
                      sceneMatch = i;
                      idMatch = jsonArr[i]["id"];
                      break;
                    }
                  }
                  if (idMatch !== void 0) {
                    break;
                  }
                }
                if (idMatch !== void 0) {
                  return new Promise((previewResolve) => {
                    previewResolve("");
                  });
                } else {
                  return new Promise((previewResolve, previewReject) => {
                    App$1.getAsItemList("sceneconfig:i12").then((previewJSONArr) => {
                      let previewMatch = "";
                      for (var k = 0; k < previewJSONArr.length; ++k) {
                        if (previewJSONArr[k]["srcid"] === srcId) {
                          previewMatch = previewJSONArr[k]["id"];
                          break;
                        }
                      }
                      previewResolve(previewMatch);
                    }).catch((e) => {
                      previewReject(e);
                    });
                  });
                }
              }).then((previewId) => {
                if (previewId !== "") {
                  idMatch = previewId;
                  sceneMatch = "i12";
                }
                if (idMatch !== void 0) {
                  updateId(idMatch, sceneMatch);
                  resolveInner(idMatch);
                } else {
                  resolveInner(id);
                }
              }).catch((e) => {
                resolveInner(id);
              });
            }
          });
        }).then((resultId) => {
          _a.set(name, value2, resultId).then((val) => {
            resolve2(val);
          });
        });
      }
    });
  }
  /** Sets an item's local property */
  static set(name, value2, id) {
    return new Promise((resolve2) => {
      let slotPromise;
      let slot;
      if (id !== void 0 && id !== null) {
        slotPromise = new Promise((slotResolve) => {
          _a.attach(id).then((res) => {
            slotResolve(res);
          });
        });
      } else {
        slotPromise = new Promise((slotResolve) => {
          slotResolve(-1);
        });
      }
      slotPromise.then((newSlot) => {
        slot = newSlot;
        let hasGlobalSources = versionCompare(getVersion()).is.greaterThan(minVersion);
        if (!Environment.isSourcePlugin() && String(slot) === "0" || Environment.isSourcePlugin() && String(slot) === "0" && !hasGlobalSources) {
          slot = -1;
        }
        exec(
          "SetLocalPropertyAsync" + (String(slot) === "-1" ? "" : slot + 1),
          name,
          value2,
          (val) => {
            resolve2(!(Number(val) < 0));
          }
        );
      });
    });
  }
  /** For SourceProps and XBC version 2.7 below */
  static setBaseId(id) {
    _a.baseID = id;
  }
  /** For SourceProps and XBC version 2.7 below */
  static getBaseId() {
    return _a.baseID;
  }
}, _a.MAX_SLOTS = 2, _a.lastSlot = _a.MAX_SLOTS - 1, _a.itemSlotMap = [], _a.islockedSourceSlot = false, _a);
const _Global = class _Global {
  static addInitializationPromise(promise) {
    _Global.initialPromises.push(promise);
  }
  static getInitializationPromises() {
    return _Global.initialPromises;
  }
  static setPersistentConfig(config) {
    _Global.persistedConfig = config;
  }
  static getPersistentConfig() {
    return _Global.persistedConfig;
  }
  static isListenToItemAdd() {
    return _Global.listenToItemAdd;
  }
  static setListenToItemAdd() {
    _Global.listenToItemAdd = true;
  }
};
_Global.persistedConfig = {};
_Global.initialPromises = [];
_Global.listenToItemAdd = false;
let Global = _Global;
const _EventEmitter = class _EventEmitter {
  constructor() {
    this._handlers = {};
  }
  /** This function attaches a handler to an event. Duplicate handlers are allowed. */
  on(event, handler, _id) {
    if (Remote.remoteType === "remote") {
      let id = _id ? _id : (/* @__PURE__ */ new Date()).getTime() + "_" + Math.floor(Math.random() * 1e3);
      let message = {
        event,
        id,
        type: "event-emitter"
      };
      if (_EventEmitter._remoteHandlers[id] === void 0) {
        _EventEmitter._remoteHandlers[id] = [];
      }
      _EventEmitter._remoteHandlers[id].push(handler);
      Remote.sendMessage(encodeURIComponent(JSON.stringify(message)));
    } else if (Remote.remoteType === "proxy") {
      if (_EventEmitter._proxyHandlers[_id] === void 0) {
        _EventEmitter._proxyHandlers[_id] = [];
      }
      _EventEmitter._proxyHandlers[_id].push(handler);
    } else {
      if (this._handlers[event] === void 0) {
        this._handlers[event] = [];
      }
      this._handlers[event].push(handler);
    }
  }
  /** This function removes a handler to an event.*/
  off(event, handler) {
    if (Remote.remoteType === "remote") {
      if (_EventEmitter._remoteHandlers[event] !== void 0) {
        for (var i = _EventEmitter._remoteHandlers[event].length - 1; i >= 0; i--) {
          if (_EventEmitter._remoteHandlers[event][i] === handler) {
            _EventEmitter._remoteHandlers[event].splice(i, 1);
          }
        }
      }
    } else if (Remote.remoteType === "proxy") {
      if (_EventEmitter._proxyHandlers[event] !== void 0) {
        for (var i = _EventEmitter._proxyHandlers[event].length - 1; i >= 0; i--) {
          if (_EventEmitter._proxyHandlers[event][i] === handler) {
            _EventEmitter._proxyHandlers[event].splice(i, 1);
          }
        }
      }
    } else {
      if (this._handlers[event] !== void 0) {
        for (var i = this._handlers[event].length - 1; i >= 0; i--) {
          if (this._handlers[event][i] === handler) {
            this._handlers[event].splice(i, 1);
          }
        }
      }
    }
  }
  /** This function lets an event trigger with any number of supplied parameters. */
  emit(event, ...params) {
    if (Remote.remoteType === "proxy") {
      if (_EventEmitter._proxyHandlers[event] === void 0) {
        return;
      }
      for (let handler of _EventEmitter._proxyHandlers[event]) {
        handler.apply(this, params);
      }
    } else if (Remote.remoteType === "remote") {
      if (_EventEmitter._remoteHandlers[event] === void 0) return;
      for (let handler of _EventEmitter._remoteHandlers[event]) {
        handler.apply(this, params);
      }
    } else {
      if (this._handlers[event] === void 0) {
        return;
      }
      for (let handler of this._handlers[event]) {
        handler.apply(this, params);
      }
    }
  }
  static _setCallback(message) {
    return new Promise((resolve2) => {
      if (_EventEmitter._proxyHandlers[message[0]] === void 0) {
        _EventEmitter._proxyHandlers[message[0]] = [];
      }
      resolve2(_EventEmitter._proxyHandlers[message[0]].push(message[1]));
    });
  }
  static _finalCallback(message) {
    return new Promise((resolve2) => {
      const result = JSON.parse(decodeURIComponent(message));
      if (_EventEmitter._remoteHandlers[result["id"]] !== void 0) {
        for (let handler of _EventEmitter._remoteHandlers[result["id"]]) {
          handler.apply(this, [result["result"]]);
        }
      }
      resolve2();
    });
  }
};
_EventEmitter._remoteHandlers = {};
_EventEmitter._proxyHandlers = {};
let EventEmitter = _EventEmitter;
const _SourcePropsWindow = class _SourcePropsWindow extends EventEmitter {
  /**
   *  Gets the instance of the window utility. Use this instead of the constructor.
   */
  static getInstance() {
    if (_SourcePropsWindow._instance === void 0) {
      _SourcePropsWindow._instance = new _SourcePropsWindow();
    }
    return _SourcePropsWindow._instance;
  }
  /**
   *  Use getInstance() instead.
   */
  constructor() {
    super();
    if (!Environment.isSourceProps()) {
      throw new Error("SourcePropsWindow class is only available for source properties");
    }
    if (Remote.remoteType === "remote") {
      throw new Error("Unable to listen to SourcePropsWindow events through Remote");
    } else {
      window.addEventListener("message", function(event) {
        try {
          var data = JSON.parse(event.data);
        } catch (e) {
          return;
        }
        switch (data.event) {
          // currently, restrict messages to selected set
          case "set-selected-tab":
            this.emit(data.event, data.value);
            break;
          case "async-callback":
            this.emit(data.event, {
              asyncId: data.value.asyncId,
              result: data.value.result
            });
            break;
        }
      }.bind(this));
      this.on("config-load", () => {
        this._informConfigLoaded();
      });
      _SourcePropsWindow._instance = this;
    }
  }
  // helper function to communicate with built-in container
  _notify(obj) {
    window.parent.postMessage(JSON.stringify(obj), "*");
  }
  /**
   *  Informs the application that the plugin intends to use the entire window for rendering its configuration.
   */
  useFullWindow() {
    this._setRenderMode(_SourcePropsWindow._MODE_FULL);
    this.resize(354, 390);
  }
  /**
   *  param: ({customTabs: string[], tabOrder: string[]})
   *
   *  Informs the application that the plugin intends to use the existing tab
   *  system to render its properties window.
   *
   *  The `customTabs` node should contain a list of tab titles that the plugin
   *  will create for itself.
   *
   *  The `tabOrder` node contains the desired order of tabs. This list comes
   *  from the specified custom tabs, and the set of reusable XSplit tabs:
   *  'Color', 'Layout' and 'Transition'.
   */
  useTabbedWindow(config) {
    this._setRenderMode(_SourcePropsWindow._MODE_TABBED);
    this._declareCustomTabs(config.customTabs);
    this._setTabOrder(config.tabOrder);
  }
  _setRenderMode(renderMode) {
    this._mode = renderMode;
    this._notify({
      event: "set-mode",
      value: renderMode
    });
  }
  _setTabOrder(tabArray) {
    this._notify({
      event: "set-tab-order",
      value: JSON.stringify(tabArray)
    });
  }
  _declareCustomTabs(tabArray) {
    this._notify({
      event: "set-custom-tabs",
      value: JSON.stringify(tabArray)
    });
  }
  _informConfigLoaded() {
    this._notify({ event: "load" });
  }
  /**
   *  param: width<number>, height<number>
   *
   *  Resizes the properties window. Currently only works when using full
   *  window mode.
   */
  resize(width, height) {
    this._notify({
      event: "resize",
      value: JSON.stringify({
        width,
        height
      })
    });
  }
  /**
   *  param: name<string>
   *
   *  Changes the title of the source properties dialog.
   *  Note: The title change is temporary, as re-opening the source properties
   *  resets the title to the display name of the source
   *  (custom name takes precedence over name)
   */
  requestDialogTitleChange(name) {
    this._notify({
      event: "change-dialog-title",
      value: name
    });
  }
  /** Closes the properties window. */
  close() {
    return new Promise((resolve2) => {
      resolve2(exec("Close"));
    });
  }
  /**
   *  param: show<boolean>
   *
   *  Toggles on/off the load indicator of the source properties dialog
   */
  showLoading(show) {
    this._notify({
      event: "show-overlay",
      value: show
    });
  }
};
_SourcePropsWindow._MODE_FULL = "full";
_SourcePropsWindow._MODE_TABBED = "embedded";
let SourcePropsWindow = _SourcePropsWindow;
function resolveRelativePath(path, base) {
  if (path.substring(0, 7) === "http://" || path.substring(0, 8) === "https://") {
    return path;
  } else if (path.substring(0, 2) === "//") {
    return base.split("://")[0] + ":" + path;
  } else if (path.substring(0, 3) === "../") {
    let upDirectoryCount = 0;
    while (path.substring(0, 3) === "../") {
      path = path.substring(3);
      ++upDirectoryCount;
    }
    let baseDirectories = base.split("/");
    baseDirectories = baseDirectories.slice(0, length - 1 - upDirectoryCount);
    baseDirectories.push(path);
    return baseDirectories.join("/");
  } else {
    if (path.substring(0, 2) === "./") {
      path = path.substring(2);
    }
    let baseSegments = base.split("/");
    baseSegments[baseSegments.length - 1] = path;
    return baseSegments.join("/");
  }
}
function readMetaConfigUrl() {
  return new Promise((resolve2) => {
    if (Environment.isSourcePlugin()) {
      var configObj = {};
      var promise = new Promise((resolveInner) => {
        exec("GetLocalPropertyAsync", "prop:BrowserConfiguration", (result) => {
          resolveInner(result);
        });
      });
      promise.then((browserConfig) => {
        try {
          if (browserConfig === "" || browserConfig === "null") {
            browserConfig = exec("GetConfiguration");
          }
          configObj = JSON.parse(browserConfig);
        } catch (e) {
        } finally {
          var metas = document.getElementsByTagName("meta");
          for (var i = metas.length - 1; i >= 0; i--) {
            if (metas[i].name === "xsplit:config-url") {
              let url = resolveRelativePath(
                metas[i].content,
                window.location.href
              );
              configObj["configUrl"] = url;
              var persist = {
                configUrl: url
              };
              Global.setPersistentConfig(persist);
              break;
            }
          }
          exec("SetBrowserProperty", "Configuration", JSON.stringify(configObj));
          resolve2();
        }
      });
    } else {
      resolve2();
    }
  });
}
function getCurrentSourceId() {
  return new Promise((resolve2) => {
    if (Environment.isSourceProps() || Environment.isSourcePlugin() && versionCompare(getVersion()).is.lessThan(minVersion)) {
      exec(
        "GetLocalPropertyAsync",
        "prop:id",
        (result) => {
          let id = result;
          Item$1.setBaseId(id);
          if (Environment.isSourcePlugin() || Environment.isSourceProps()) {
            Item$1.lockSourceSlot(id);
          }
          resolve2();
        }
      );
    } else {
      resolve2();
    }
  });
}
function informWhenConfigLoaded() {
  return new Promise((resolve2) => {
    if (Environment.isSourceProps()) {
      window.addEventListener("load", () => {
        try {
          SourcePropsWindow.getInstance().emit("config-load");
        } catch (e) {
        }
        resolve2();
      });
    } else {
      resolve2();
    }
  });
}
function init(config) {
  Global.addInitializationPromise(readMetaConfigUrl());
  Global.addInitializationPromise(getCurrentSourceId());
  if (!(config && config["deferLoad"] !== void 0)) {
    Global.addInitializationPromise(informWhenConfigLoaded());
  }
  if (config && config["listenToItemAdd"] !== void 0) {
    Global.setListenToItemAdd();
  }
  Promise.all(Global.getInitializationPromises()).then(() => {
    document.dispatchEvent(new CustomEvent("xsplit-js-ready", {
      bubbles: true
    }));
  });
}
const _EventManager = class _EventManager {
  static subscribe(event, _cb, id) {
    return new Promise((resolve2) => {
      event = event instanceof Array ? event : [event];
      if (Remote.remoteType === "remote") {
        let message = {
          event,
          id,
          type: "event-manager"
        };
        event.forEach((_event) => {
          if (_EventManager._remoteHandlers[_event] === void 0) {
            _EventManager._remoteHandlers[_event] = [];
          }
          if (_EventManager._appEventsList.indexOf(_event) > -1) {
            exec("AppSubscribeEvents");
          } else if (_event.startsWith("itempropchange_") || _event.startsWith("itemdestroyed_")) {
            let itemID = _event.split("_")[1];
            exec("ItemSubscribeEvents", itemID);
          }
          _EventManager._remoteHandlers[_event].push(_cb);
        });
        Remote.sendMessage(encodeURIComponent(JSON.stringify(message)));
      } else if (Remote.remoteType === "proxy") {
        event.forEach((_event) => {
          if (_EventManager._proxyHandlers[_event] === void 0) {
            _EventManager._proxyHandlers[_event] = [];
          }
          if (_EventManager._appEventsList.indexOf(_event) > -1) {
            exec("AppSubscribeEvents");
          } else if (_event.startsWith("itempropchange_") || _event.startsWith("itemdestroyed_")) {
            let itemID = _event.split("_")[1];
            exec("ItemSubscribeEvents", itemID);
          }
          _EventManager._proxyHandlers[_event].push(_cb);
        });
      } else {
        if (event instanceof Array) {
          event.forEach((_event) => {
            if (_EventManager.callbacks[_event] === void 0) {
              _EventManager.callbacks[_event] = [];
            }
            if (_EventManager._appEventsList.indexOf(_event) > -1) {
              exec("AppSubscribeEvents");
            } else if (_event.startsWith("itempropchange_") || _event.startsWith("itemdestroyed_")) {
              let itemID = _event.split("_")[1];
              exec("ItemSubscribeEvents", itemID);
            }
            _EventManager.callbacks[_event].push(_cb);
          });
        }
        resolve2(this);
      }
    });
  }
  static _setCallback(message) {
    return new Promise((resolve2) => {
      if (_EventManager._proxyHandlers[message[0]] === void 0) {
        _EventManager._proxyHandlers[message[0]] = [];
      }
      resolve2(_EventManager._proxyHandlers[message[0]].push(message[1]));
    });
  }
  static _finalCallback(message) {
    return new Promise((resolve2) => {
      const result = JSON.parse(decodeURIComponent(message));
      if (_EventManager._remoteHandlers[result["event"]] !== void 0) {
        result["result"]["id"] = result["id"];
        for (let handler of _EventManager._remoteHandlers[result["event"]]) {
          handler.apply(this, [result["result"]]);
        }
      }
    });
  }
};
_EventManager.callbacks = {};
_EventManager._remoteHandlers = {};
_EventManager._proxyHandlers = {};
_EventManager._appEventsList = ["OnSceneAddByUser", "OnSceneAdd", "OnSceneDelete", "OnSceneDeleteAll", "scenedlg:1"];
let EventManager = _EventManager;
window$1.OnMetersUpdate = (evt) => {
};
window$1.AppOnShowSettings = (evt) => {
};
const oldSetEvent = window$1.SetEvent;
window$1.SetEvent = (args) => {
  let settings = [];
  settings = args.split("&");
  let settingsObj = {};
  settings.map(function(el) {
    let _split = el.split("=");
    settingsObj[_split[0]] = _split[1];
  });
  if (Remote.remoteType === "proxy") {
    if (EventManager._proxyHandlers[settingsObj["event"]] === void 0) return;
    EventManager._proxyHandlers[settingsObj["event"]].map((_cb) => {
      _cb(settingsObj);
    });
  } else {
    if (EventManager.callbacks[settingsObj["event"]] === void 0) return;
    EventManager.callbacks[settingsObj["event"]].map((_cb) => {
      _cb(settingsObj);
    });
  }
  if (typeof oldSetEvent === "function") {
    oldSetEvent(args);
  }
};
const oldAppOnEvent = window$1.AppOnEvent;
window$1.AppOnEvent = (event, ...args) => {
  if (Remote.remoteType === "proxy") {
    if (EventManager._proxyHandlers[event] === void 0) return;
    EventManager._proxyHandlers[event].map((_cb) => {
      _cb({ event, args });
    });
  } else {
    if (EventManager.callbacks[event] === void 0) return;
    EventManager.callbacks[event].map((_cb) => {
      _cb({ event, args });
    });
  }
  if (typeof oldAppOnEvent === "function") {
    oldAppOnEvent(event);
  }
};
const oldOnEvent = window$1.OnEvent;
window$1.OnEvent = (event, item, ...eventArgs) => {
  if (event === "itemremovedfromscene" && versionCompare(getVersion()).is.greaterThanOrEqualTo(sceneUidAddDeleteVersion)) {
    event = "itemdestroyed";
  }
  if (Remote.remoteType === "proxy") {
    if (EventManager._proxyHandlers[event + "_" + item] === void 0) return;
    EventManager._proxyHandlers[event + "_" + item].map((_cb) => {
      _cb(...eventArgs);
    });
  } else {
    if (EventManager.callbacks[event + "_" + item] === void 0) return;
    EventManager.callbacks[event + "_" + item].map((_cb) => {
      _cb(...eventArgs);
    });
  }
  if (typeof oldOnEvent === "function") {
    oldOnEvent(event);
  }
};
class StreamInfo {
  /** StreamInfo constructor (only used internally) */
  constructor(props) {
    this._name = props.name;
    this._stat = props.stat;
    this._channel = props.channel;
  }
  /**
   *  return: Promise<StreamInfo[]>
   *
   *  Gets the list of currently active channels.
   */
  static getActiveStreamChannels() {
    return new Promise((resolve2) => {
      App$1.getAsList("recstat").then((activeStreams) => {
        if (activeStreams.length === 0) {
          resolve2([]);
        } else {
          let channels = [];
          for (var i = 0; i < activeStreams.length; ++i) {
            channels.push(new StreamInfo({
              name: activeStreams[i]["name"],
              stat: activeStreams[i].children.filter((child) => {
                return child.tag.toLowerCase() === "stat";
              })[0],
              channel: activeStreams[i].children.filter((child) => {
                return child.tag.toLowerCase() === "channel";
              })[0]
            }));
          }
          resolve2(channels);
        }
      });
    });
  }
  /**
   *  return: Promise<string>
   *
   *  Gets the name of the channel.
   */
  getName() {
    return new Promise((resolve2) => {
      resolve2(this._name.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&"));
    });
  }
  /**
   * return: Promise<number>
   *
   * Gets the number of frames dropped
   */
  getStreamDrops() {
    return new Promise((resolve2) => {
      App$1.get("streamdrops:" + this._name).then((val) => {
        var drops = val.split(","), dropped = Number(drops[0]) || 0;
        resolve2(dropped);
      });
    });
  }
  /**
   * return: Promise<number>
   *
   * Gets the number of GOP frames dropped
   */
  getGOPDrops() {
    return new Promise((resolve2) => {
      let usage;
      App$1.getGlobalProperty("bandwidthusage-all").then((result) => {
        usage = JSON.parse(result);
        for (var i = 0; i < usage.length; i++) {
          if (usage[i].ChannelName === this._name) {
            resolve2(usage[i].Dropped);
          }
        }
      });
    });
  }
  /**
   * return: Promise<number>
   *
   * Gets the number of frames rendered
   */
  getStreamRenderedFrames() {
    return new Promise((resolve2) => {
      App$1.get("streamdrops:" + this._name).then((val) => {
        var drops = val.split(","), rendered = Number(drops[1]) || 0;
        resolve2(rendered);
      });
    });
  }
  /**
   * return: Promise<number>
   *
   * Gets the current duration of the stream in microseconds
   */
  getStreamTime() {
    return new Promise((resolve2) => {
      App$1.get("streamtime:" + this._name).then((val) => {
        var duration = Number(val) / 10;
        resolve2(duration);
      });
    });
  }
  /**
   * return: Promise<number>
   *
   * Gets the current bandwidth usage of the stream
   */
  getBandwidthUsage() {
    return new Promise((resolve2) => {
      let usage;
      if (this._name !== "Local Recording") {
        App$1.getGlobalProperty("bandwidthusage-all").then((result) => {
          usage = JSON.parse(result);
          for (var i = 0; i < usage.length; i++) {
            if (usage[i].ChannelName === this._name) {
              resolve2(usage[i].AvgBitrate);
            }
          }
        });
      } else {
        resolve2(0);
      }
    });
  }
}
const _ChannelManager = class _ChannelManager extends EventEmitter {
  /**
   *  param: (event: string, ...params: any[])
   *
   *  Allows this class to emit an event.
   */
  static emit(event, ...params) {
    params.unshift(event);
    _ChannelManager._emitter.emit.apply(_ChannelManager._emitter, params);
  }
  /**
   *  param: (event: string, handler: Function)
   *
   *  Allows listening to events that this class emits. Currently there are three:
   *  `stream-start`, `stream-end` and `recording-renamed`.
   *
   *  #### Usage:
   *
   * ```javascript
   * ChannelManager.on('stream-start', function(res) {
   *   if (!res.error) { // No error
   *     var channel = res.channel; // Channel Object
   *     var streamTime = res.streamTime;
   *   }
   * });
   * ```
   */
  static on(event, handler) {
    if (Environment.isSourceProps()) {
      console.warn("Channel Manager: stream-related events are not received via the Source Properties");
    }
    _ChannelManager._emitter.on(event, (params) => {
      try {
        let channelInfoObj = JSON.parse(decodeURIComponent(params));
        if (channelInfoObj.hasOwnProperty("ChannelName")) {
          let channelName = channelInfoObj["ChannelName"];
          let infoJSON = JSON$1.parse(channelInfoObj["Settings"]);
          let statJSON;
          let addedInfo = {};
          if (event === "stream-end") {
            channelInfoObj["Dropped"] = Number(channelInfoObj["Dropped"]) || 0;
            channelInfoObj["NotDropped"] = Number(channelInfoObj["NotDropped"]) || 0;
            channelInfoObj["StreamTime"] = Number(channelInfoObj["StreamTime"] / 10) || 0;
            channelInfoObj["Audio"] = Number(channelInfoObj["Audio"]) || 0;
            channelInfoObj["Video"] = Number(channelInfoObj["Video"]) || 0;
            channelInfoObj["Output"] = Number(channelInfoObj["Output"]) || 0;
            statJSON = JSON$1.parse('<stat video="' + channelInfoObj["Video"] + '" audio="' + channelInfoObj["Audio"] + '" output="' + channelInfoObj["Output"] + '" frmdropped="' + channelInfoObj["Dropped"] + '" frmcoded="' + channelInfoObj["NotDropped"] + '" />');
            addedInfo["streamTime"] = channelInfoObj["StreamTime"];
          } else if (event === "stream-start") {
            statJSON = JSON$1.parse("<stat />");
          }
          let eventChannel = new StreamInfo({
            name: channelName,
            stat: statJSON,
            channel: infoJSON
          });
          handler.call(this, {
            error: false,
            channel: eventChannel,
            streamTime: addedInfo["streamTime"]
          });
        } else if (channelInfoObj.hasOwnProperty("new") && channelInfoObj.hasOwnProperty("old")) {
          if (event === "recording-renamed") {
            const name = decodeURIComponent(channelInfoObj["new"]).replace(/\\/g, "/");
            const nameArr = name.split("/");
            const newName = nameArr[nameArr.length - 1];
            handler.call(this, {
              error: false,
              recordingInfo: {
                oldName: channelInfoObj["old"],
                newName,
                fullPath: decodeURIComponent(channelInfoObj["new"])
              }
            });
          }
        }
      } catch (e) {
        handler.call(this, { error: true });
      }
    });
  }
  static off(event, handler) {
    _ChannelManager._emitter.off(event, handler);
  }
};
_ChannelManager._emitter = new _ChannelManager();
_ChannelManager._proxyCallbacks = {};
_ChannelManager._remoteCallbacks = {};
let ChannelManager = _ChannelManager;
function _subscribeEventManager() {
  EventManager.subscribe(
    ["StreamStart", "StreamEnd", "RecordingRenamed"],
    (settingsObj) => {
      let eventString;
      if (settingsObj.hasOwnProperty("event") && settingsObj.hasOwnProperty("info")) {
        eventString = settingsObj["event"];
        if (settingsObj["event"] === "StreamStart") {
          eventString = "stream-start";
        } else if (settingsObj["event"] === "StreamEnd") {
          eventString = "stream-end";
        }
        ChannelManager.emit(eventString, settingsObj["info"]);
      }
      if (settingsObj.hasOwnProperty("event") && settingsObj.hasOwnProperty("old") && settingsObj.hasOwnProperty("new")) {
        eventString = settingsObj["event"];
        if (settingsObj["event"] === "RecordingRenamed") {
          eventString = "recording-renamed";
          const renameInfo = {
            old: settingsObj["old"],
            new: settingsObj["new"]
          };
          ChannelManager.emit(eventString, encodeURIComponent(JSON.stringify(renameInfo)));
        }
      }
    }
  );
}
let isReady = false;
let isInit = false;
let readyResolve;
function readyPromise() {
  return new Promise((resolve2) => {
    if (typeof document !== "undefined") {
      document.addEventListener("xsplit-js-ready", () => {
        resolve2();
      });
    }
    if (isReady) {
      resolve2();
    }
  });
}
function finishReady(config) {
  return new Promise((resolve2) => {
    if (config && config["version"] !== void 0) {
      setMockVersion(config["version"]);
    }
    setReady();
    if (isReady && !isInit) {
      _subscribeEventManager();
      setOnce();
      init(config);
    }
    if (readyResolve !== void 0 && Remote.remoteType === "remote") {
      readyResolve.call(this, null);
    }
    resolve2(readyPromise);
  });
}
function ready(config) {
  return new Promise((resolve2, reject2) => {
    Environment.initialize();
    if (config && config["remote"] !== void 0) {
      if (config["remote"]["type"] !== void 0) {
        Remote.remoteType = config["remote"]["type"];
      }
      if (config["remote"]["sendMessage"] !== void 0 && config["remote"]["sendMessage"] instanceof Function) {
        Remote.sendMessage = config["remote"]["sendMessage"];
      } else {
        reject2(Error("Send message should be instance of function."));
      }
    }
    if (Remote.remoteType === "remote") {
      readyResolve = () => {
        resolve2(void 0);
      };
      Remote.sendMessage("getVersion");
    } else {
      resolve2(finishReady(config));
    }
  });
}
function setReady() {
  isReady = true;
}
function setOnce() {
  isInit = true;
}
const _Extension = class _Extension {
  /**
   *  Gets the instance of the Extension class. Use this instead of the constructor.
   */
  static getInstance() {
    if (_Extension._instance === void 0) {
      _Extension._instance = new _Extension();
    }
    _Extension._instance.getId().then((id) => {
      _Extension._instance._id = String(id);
    });
    return _Extension._instance;
  }
  constructor() {
    if (Environment.isExtension()) {
      this._presName = window$1.location.href;
    } else {
      throw new Error("Extension class can only be used on Extension Plugins");
    }
  }
  /**
   * param: (configObj: JSON)
   * ```
   * return: Promise<ExtensionWindow|Error>
   * ```
   *
   * Save the configuration object to the presentation
   */
  saveConfig(configObj) {
    return new Promise((resolve2, reject2) => {
      if ({}.toString.call(configObj) === "[object Object]") {
        exec(
          "SetPresProperty",
          this._presName,
          JSON.stringify(configObj)
        ).then((result) => {
          resolve2(this);
        });
      } else {
        reject2(Error("Configuration object should be in JSON format"));
      }
    });
  }
  /**
   * return: Promise<JSON>
   *
   * Get the saved configuration from the presentation
   */
  loadConfig() {
    return new Promise((resolve2) => {
      const getConfig = (mapId) => {
        return new Promise((resolveConfig) => {
          exec("GetPresProperty", mapId, (configData) => {
            let configObj = null;
            try {
              if (configData) {
                configObj = JSON.parse(configData);
              }
            } catch (err) {
              console.error("Error on load config", err);
            }
            resolveConfig(configObj);
          });
        });
      };
      const defaultConfig = {};
      getConfig(this._presName).then((config) => {
        if (!config && this._presName.indexOf("file:///") > -1) {
          return getConfig(this._presName.replace("file:///", "file://"));
        } else {
          return Promise.resolve(config);
        }
      }).then((config) => {
        if (config) {
          resolve2(config);
        } else {
          resolve2(defaultConfig);
        }
      });
    });
  }
  /**
   *  return: Promise<string>
   *
   *  Get the extension id.
   */
  getId(handler) {
    return new Promise((resolve2) => {
      if (this._id === void 0) {
        if (Remote.remoteType === "remote") {
          let message = {
            type: "extWindow",
            instance: _Extension._instance
          };
          _Extension._remoteCallback["ExtensionWindowID"] = { resolve: resolve2 };
          Remote.sendMessage(encodeURIComponent(JSON.stringify(message)));
        } else if (Remote.remoteType === "proxy") {
          _Extension._proxyCallback["ExtensionWindowID"] = handler;
          App$1.postMessage("8");
        } else {
          _Extension._callback["ExtensionWindowID"] = { resolve: resolve2 };
          App$1.postMessage("8");
        }
      } else {
        resolve2(this._id);
      }
    });
  }
  static _finalCallback(message) {
    return new Promise((resolve2) => {
      const result = JSON.parse(decodeURIComponent(message));
      _Extension._remoteCallback["ExtensionWindowID"].resolve(result["result"]);
    });
  }
};
_Extension._proxyCallback = {};
_Extension._remoteCallback = {};
_Extension._callback = {};
let Extension = _Extension;
const oldSetid = window$1.Setid;
window$1.Setid = function(id) {
  if (Remote.remoteType === "proxy") {
    if (Extension._proxyCallback["ExtensionWindowID"] === void 0) return;
    Extension._proxyCallback["ExtensionWindowID"].call(this, id);
  } else {
    Extension._callback["ExtensionWindowID"].resolve(id);
  }
  if (typeof oldSetid === "function") {
    oldSetid(id);
  }
};
function applyMixins(derivedCtor, baseCtors) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      if (name === "constructor") {
        return;
      }
      derivedCtor.prototype[name] = baseCtor.prototype[name];
    });
  });
}
const _Logger = class _Logger {
  static log(message) {
    console.log(message);
  }
  static warn(type, warnCaller, once = false) {
    switch (type) {
      case "sourceWarning":
        _Logger.warnMessage = "Info: " + warnCaller + " accesses a source property, which is shared by all items linked to the source. Setting this property will affect all linked items.";
        break;
    }
    if (!once) {
      console.warn(_Logger.warnMessage);
    } else if (!_Logger.onceWarningsShown[warnCaller]) {
      console.warn(_Logger.warnMessage + _Logger.onceMessage);
      _Logger.onceWarningsShown[warnCaller] = true;
    }
  }
};
_Logger.onceWarningsShown = {};
_Logger.onceMessage = " (This warning will only be shown once.)";
let Logger = _Logger;
var ItemTypes = /* @__PURE__ */ ((ItemTypes2) => {
  ItemTypes2[ItemTypes2["UNDEFINED"] = 0] = "UNDEFINED";
  ItemTypes2[ItemTypes2["FILE"] = 1] = "FILE";
  ItemTypes2[ItemTypes2["LIVE"] = 2] = "LIVE";
  ItemTypes2[ItemTypes2["TEXT"] = 3] = "TEXT";
  ItemTypes2[ItemTypes2["BITMAP"] = 4] = "BITMAP";
  ItemTypes2[ItemTypes2["SCREEN"] = 5] = "SCREEN";
  ItemTypes2[ItemTypes2["FLASHFILE"] = 6] = "FLASHFILE";
  ItemTypes2[ItemTypes2["GAMESOURCE"] = 7] = "GAMESOURCE";
  ItemTypes2[ItemTypes2["HTML"] = 8] = "HTML";
  ItemTypes2[ItemTypes2["THREEDS"] = 9] = "THREEDS";
  ItemTypes2[ItemTypes2["PPTFILE"] = 10] = "PPTFILE";
  ItemTypes2[ItemTypes2["SCENE"] = 11] = "SCENE";
  ItemTypes2[ItemTypes2["GROUP"] = 12] = "GROUP";
  ItemTypes2[ItemTypes2["REPLAY"] = 13] = "REPLAY";
  ItemTypes2[ItemTypes2["VIEW"] = 14] = "VIEW";
  return ItemTypes2;
})(ItemTypes || {});
class iSource {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  setName(value2) {
    return new Promise((resolve2) => {
      this._name = value2;
      if (versionCompare(getVersion()).is.lessThan(minVersion)) {
        Item$1.set("prop:name", this._name, this._id).then(() => {
          resolve2(this);
        });
      } else {
        if (this._isItemCall) {
          Logger.warn("sourceWarning", "setName", true);
          Item$1.set("prop:name", this._name, this._id).then(() => {
            resolve2(this);
          });
        } else {
          Item$1.wrapSet("prop:name", this._name, this._srcId, this._id, this._updateId.bind(this)).then(() => {
            resolve2(this);
          });
        }
      }
    });
  }
  getName() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getName", true);
        this._checkPromise = Item$1.get("prop:name", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:name",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        this._name = String(val);
        resolve2(val);
      });
    });
  }
  setCustomName(value2) {
    return new Promise((resolve2) => {
      this._cname = value2;
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setCustomName", true);
        Item$1.set("prop:cname", this._cname, this._id).then(() => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet("prop:cname", this._cname, this._srcId, this._id, this._updateId.bind(this)).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getCustomName() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getCustomName", true);
        Item$1.get("prop:cname", this._id).then((val) => {
          resolve2(val);
        });
      } else {
        Item$1.wrapGet(
          "prop:cname",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then((val) => {
          resolve2(val);
        });
      }
    });
  }
  getValue() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getValue", true);
        this._checkPromise = Item$1.get("prop:item", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:item",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        val = val === "null" ? "" : val;
        if (val === "") {
          this._value = "";
          resolve2(val);
        } else {
          try {
            this._value = XML.parseJSON(JSON$1.parse(val));
            resolve2(this._value);
          } catch (e) {
            this._value = val;
            resolve2(val);
          }
        }
      });
    });
  }
  setValue(value2) {
    return new Promise((resolve2, reject2) => {
      var val = typeof value2 === "string" ? value2 : value2.toString();
      if (typeof value2 !== "string") {
        this._value = JSON$1.parse(val);
      } else {
        this._value = val;
      }
      let typeCheck = this.getValue().then((origVal) => {
        return new Promise((typeRes, typeRej) => {
          if (String(origVal).toUpperCase().indexOf("{33D9A762-90C8-11D0-BD43-00A0C911CE86}") !== -1 && val.toUpperCase().indexOf("{33D9A762-90C8-11D0-BD43-00A0C911CE86}") === -1 && this._type === 2) {
            typeRej(Error("Value is not a valid Audio source"));
          } else {
            typeRes(true);
          }
        });
      });
      typeCheck.then(() => {
        if (this._isItemCall) {
          Logger.warn("sourceWarning", "setValue", true);
          Item$1.set("prop:item", val, this._id).then(() => {
            resolve2(this);
          });
        } else {
          Item$1.wrapSet("prop:srcitem", val, this._srcId, this._id, this._updateId.bind(this)).then(() => {
            resolve2(this);
          });
        }
      });
    });
  }
  getKeepLoaded() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getKeepLoaded", true);
        this._checkPromise = Item$1.get("prop:keeploaded", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:keeploaded",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        this._keepLoaded = val === "1";
        resolve2(this._keepLoaded);
      });
    });
  }
  setKeepLoaded(value2) {
    return new Promise((resolve2) => {
      this._keepLoaded = value2;
      this._globalsrc = value2;
      if (versionCompare(getVersion()).is.lessThan(globalsrcMinVersion)) {
        Item$1.set("prop:globalsrc", this._globalsrc ? "1" : "0", this._id);
      }
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setKeepLoaded", true);
        Item$1.set("prop:keeploaded", this._keepLoaded ? "1" : "0", this._id).then(() => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet(
          "prop:keeploaded",
          this._keepLoaded ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getId() {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        resolve2(this._id);
      } else {
        if (versionCompare(getVersion()).is.lessThan(minVersion)) {
          reject2(Error("Only available on versions above " + minVersion));
        } else {
          Item$1.wrapGet("prop:srcid", this._srcId, this._id, this._updateId.bind(this)).then((srcid) => {
            resolve2(srcid);
          });
        }
      }
    });
  }
  refresh() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Item$1.set("refresh", "", this._id).then(() => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet(
          "refresh",
          "",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getItemList() {
    return new Promise((resolve2, reject2) => {
      if (versionCompare(getVersion()).is.lessThan(minVersion)) {
        Scene.searchItemsById(this._id).then((item) => {
          const itemArray = [];
          itemArray.push(item);
          resolve2(itemArray);
        });
      } else {
        if (this._isItemCall) {
          this._checkPromise = Item$1.get("itemlist", this._id);
        } else {
          this._checkPromise = Item$1.wrapGet(
            "itemlist",
            this._srcId,
            this._id,
            this._updateId.bind(this)
          );
        }
        this._checkPromise.then((itemlist) => {
          const promiseArray = [];
          const itemsArray = String(itemlist).split(",");
          itemsArray.forEach((itemId) => {
            promiseArray.push(new Promise((itemResolve) => {
              Scene.searchItemsById(itemId).then((item) => {
                itemResolve(item);
              }).catch(() => itemResolve(null));
            }));
          });
          Promise.all(promiseArray).then((results) => {
            resolve2(results.filter((res) => res !== null));
          });
        });
      }
    });
  }
  getType() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        this._checkPromise = Item$1.get("prop:type", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:type",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        this._type = ItemTypes[ItemTypes[Number(val)]];
        resolve2(this._type);
      });
    });
  }
}
class Source {
  constructor(props) {
    props = props ? props : {};
    this._name = props["name"];
    this._cname = props["cname"];
    this._id = props["id"];
    this._srcId = props["srcid"];
    this._sceneId = props["sceneId"];
    this._value = props["value"];
    this._keepLoaded = props["keeploaded"];
    this._type = Number(props["type"]);
    this._xmlparams = props;
    this._isItemCall = false;
  }
  /**
   * return: Promise<Source>
   *
   * Get the current source (when function is called by sources), or the source
   * that was right-clicked to open the source properties window (when function is called
   * from the source properties window)
   *
   * #### Usage
   *
   * ```javascript
   * xjs.Source.getCurrentSource().then(function(source) {
   *   // This will fetch the current source (the plugin)
   * }).catch(function(err) {
   *   // Handle the error here. Errors would only occur
   *   // if we try to execute this method on Extension plugins
   * });
   * ```
   */
  static getCurrentSource() {
    return new Promise((resolve2, reject2) => {
      if (Environment.isExtension()) {
        reject2(Error("Extensions do not have sources associated with them."));
      } else if ((Environment.isSourcePlugin() || Environment.isSourceProps()) && versionCompare(getVersion()).is.greaterThan(minVersion)) {
        Item$1.get("itemlist").then((itemlist) => {
          const itemId = itemlist.split(",")[0];
          Scene.searchItemsById(itemId).then((item) => {
            return item.getSource();
          }).then((source) => {
            resolve2(source);
          }).catch(() => resolve2(null));
        });
      } else if (Environment.isSourcePlugin() || Environment.isSourceProps()) {
        Scene.searchItemsById(Item$1.getBaseId()).then((item) => {
          return item.getSource();
        }).then((source) => {
          resolve2(source);
        });
      }
    });
  }
  /**
   * return: Promise<Item[]>
   *
   * Get the item List of the current Source.
   * The item list is a list of items linked to a single Source.
   *
   * #### Usage
   *
   * ```javascript
   * xjs.Source.getItemList()
   * .then(function(items) {
   *   // This will fetch the item list of the current Source
   *   for (var i = 0 ; i < items.length ; i++) {
   *     // Manipulate each item here
   *   }
   * });
   * ```
   *
   * This is just the shorter way of getting items that are linked to a single
   * source. See the long version below:
   * ```javascript
   * xjs.Source.getCurrentSource()
   * .then(source.getItemList)
   * .then(function(items) {
   * // Manipulate the items here
   * })
   * ```
   */
  static getItemList() {
    return new Promise((resolve2, reject2) => {
      if (Environment.isExtension()) {
        reject2(Error("Extensions do not have default items associated with them."));
      } else if (versionCompare(getVersion()).is.lessThan(minVersion)) {
        Scene.searchItemsById(Item$1.getBaseId()).then((item) => {
          const itemArray = [];
          itemArray.push(item);
          resolve2(itemArray);
        });
      } else if (Environment.isSourcePlugin() || Environment.isSourceProps()) {
        Item$1.get("itemlist").then((itemlist) => {
          const promiseArray = [];
          const itemsArray = itemlist.split(",");
          itemsArray.forEach((itemId) => {
            promiseArray.push(new Promise((itemResolve) => {
              Scene.searchItemsById(itemId).then((item) => {
                itemResolve(item);
              }).catch(() => itemResolve(null));
            }));
          });
          Promise.all(promiseArray).then((results) => {
            resolve2(results.filter((res) => res !== null));
          });
        });
      }
    });
  }
  /**
   * return: Promise<Source[]>
   *
   * Get all unique Source from every scene.
   * Total number of Sources returned may be less than total number of items on
   * all the scenes due to `Linked` items only having a single Source.
   *
   * #### Usage
   * ```javascript
   * xjs.Source.getAllSources().then(function(sources) {
   *   for(var i = 0 ; i < sources.length ; i++) {
   *      if(sources[i] instanceof xjs.HtmlSource) {
   *        // Manipulate HTML Source here
   *      }
   *    }
   * })
   * ```
   */
  static getAllSources() {
    return new Promise((resolve2, reject2) => {
      let allJson = [];
      let allSrc = [];
      let uniqueObj = {};
      let uniqueSrc = [];
      let promiseArray = [];
      App$1.getAsItemList("sceneconfig").then((jsonArr) => {
        allJson = jsonArr;
        let sourcePromise = (srcid) => new Promise((sourceResolve) => {
          Scene.searchSourcesById(srcid).then((result) => {
            allSrc = allSrc.concat(result);
            sourceResolve(result);
          }).catch((err) => {
            sourceResolve(null);
          });
        });
        for (var i = 0; i < allJson.length; i++) {
          if (typeof allJson[i] !== "undefined") {
            promiseArray.push(sourcePromise(allJson[i]["srcid"]));
          }
        }
        Promise.all(promiseArray).then((results) => {
          for (var h = 0; h < allSrc.length; h++) {
            if (allSrc[h] !== null) {
              for (var key in allSrc[h]) {
                if (key === "_srcId") {
                  uniqueObj[allSrc[h][key]] = allSrc[h];
                }
              }
            }
          }
          for (var j in uniqueObj) {
            if (uniqueObj.hasOwnProperty(j)) {
              uniqueSrc.push(uniqueObj[j]);
            }
          }
          resolve2(uniqueSrc);
        });
      }).catch((err) => {
        reject2(err);
      });
    });
  }
}
applyMixins(Source, [iSource]);
class ItemLayout {
  _getCanvasAndZRotate(value2) {
    var rotationObject = {};
    if (value2 >= -180 && value2 <= -135) {
      rotationObject["canvasRotate"] = 180;
      rotationObject["zRotate"] = value2 + 180;
      rotationObject["orientation"] = "landscape";
    } else if (value2 > -135 && value2 < -45) {
      rotationObject["canvasRotate"] = 270;
      rotationObject["zRotate"] = value2 + 90;
      rotationObject["orientation"] = "portrait";
    } else if (value2 >= -45 && value2 <= 45) {
      rotationObject["canvasRotate"] = 0;
      rotationObject["zRotate"] = value2;
      rotationObject["orientation"] = "landscape";
    } else if (value2 > 45 && value2 < 135) {
      rotationObject["canvasRotate"] = 90;
      rotationObject["zRotate"] = value2 - 90;
      rotationObject["orientation"] = "portrait";
    } else if (value2 >= 135 && value2 <= 180) {
      rotationObject["canvasRotate"] = 180;
      rotationObject["zRotate"] = value2 - 180;
      rotationObject["orientation"] = "landscape";
    }
    return rotationObject;
  }
  _adjustRotation(value2) {
    if (value2 > 180) {
      value2 -= 360;
    } else if (value2 < -180) {
      value2 += 360;
    }
    return value2;
  }
  isKeepAspectRatio() {
    return new Promise((resolve2) => {
      Item$1.get("prop:keep_ar", this._id).then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setKeepAspectRatio(value2) {
    return new Promise((resolve2) => {
      Item$1.set("prop:keep_ar", value2 ? "1" : "0", this._id).then(() => {
        resolve2(this);
      });
    });
  }
  isPositionLocked() {
    return new Promise((resolve2) => {
      Item$1.get("prop:lockmove", this._id).then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setPositionLocked(value2) {
    return new Promise((resolve2) => {
      Item$1.set("prop:lockmove", value2 ? "1" : "0", this._id).then(() => {
        resolve2(this);
      });
    });
  }
  isEnhancedResizeEnabled() {
    return new Promise((resolve2) => {
      Item$1.get("prop:mipmaps", this._id).then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setEnhancedResizeEnabled(value2) {
    return new Promise((resolve2) => {
      Item$1.set("prop:mipmaps", value2 ? "1" : "0", this._id).then(() => {
        resolve2(this);
      });
    });
  }
  getPosition() {
    return new Promise((resolve2) => {
      Item$1.get("prop:pos", this._id).then((val) => {
        var [left, top, right, bottom] = String(val).split(",");
        this.position = Rectangle.fromCoordinates(
          Number(left),
          Number(top),
          Number(right),
          Number(bottom)
        );
        resolve2(this.position);
      });
    });
  }
  setPosition(value2) {
    return new Promise((resolve2, reject2) => {
      try {
        Item$1.set("prop:pos", value2.toCoordinateString(), this._id).then(() => {
          resolve2(this);
        });
      } catch (err) {
        reject2(err);
      }
    });
  }
  getRotateY() {
    return new Promise((resolve2) => {
      Item$1.get("prop:rotate_y", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setRotateY(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < -360 || value2 > 360) {
        reject2(Error("Invalid value. Min: -360, Max: 360"));
      } else {
        Item$1.set("prop:rotate_y", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getRotateX() {
    return new Promise((resolve2) => {
      Item$1.get("prop:rotate_x", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setRotateX(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < -360 || value2 > 360) {
        reject2(Error("Invalid value. Min: -360, Max: 360"));
      } else {
        Item$1.set("prop:rotate_x", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getRotateZ() {
    return new Promise((resolve2) => {
      Item$1.get("prop:rotate_z", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setRotateZ(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < -360 || value2 > 360) {
        reject2(Error("Invalid value. Min: -360, Max: 360"));
      } else {
        Item$1.set("prop:rotate_z", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getCropping() {
    return new Promise((resolve2) => {
      var cropObject = {};
      Item$1.get("prop:crop", this._id).then((val) => {
        var [left, top, right, bottom] = String(val).split(",");
        cropObject["left"] = Number(left);
        cropObject["top"] = Number(top);
        cropObject["right"] = Number(right);
        cropObject["bottom"] = Number(bottom);
        resolve2(cropObject);
      });
    });
  }
  setCropping(value2) {
    return new Promise((resolve2, reject2) => {
      if (value2.hasOwnProperty("top") && value2.hasOwnProperty("left") && value2.hasOwnProperty("right") && value2.hasOwnProperty("bottom")) {
        Item$1.set("prop:crop", value2["left"].toFixed(6) + "," + value2["top"].toFixed(6) + "," + value2["right"].toFixed(6) + "," + value2["bottom"].toFixed(6), this._id).then(() => {
          resolve2(this);
        });
      } else {
        reject2(Error("Error setting cropping, insufficient properties (left, top, right, bottom)"));
      }
    });
  }
  getCanvasRotate() {
    return new Promise((resolve2) => {
      Item$1.get("prop:rotate_canvas", this._id).then((val) => {
        var value2 = Number(val);
        if ([0, 90, 180, 270].indexOf(value2) < 0) {
          resolve2(0);
        } else {
          resolve2(value2);
        }
      });
    });
  }
  setCanvasRotate(value2) {
    return new Promise((resolve2, reject2) => {
      if ([0, 90, 180, 270].indexOf(value2) < 0) {
        reject2(
          Error("Invalid value. Only possible values are 0, 90, 180 and 270")
        );
      } else {
        Item$1.set("prop:rotate_canvas", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getEnhancedRotate() {
    return new Promise((resolve2) => {
      var rotateZ;
      var rotateCanvas;
      var rotateValue;
      Item$1.get("prop:rotate_z", this._id).then((val) => {
        rotateZ = Number(val);
        return Item$1.get("prop:rotate_canvas", this._id);
      }).then((val) => {
        rotateCanvas = Number(val);
        rotateValue = this._adjustRotation(rotateCanvas + rotateZ);
        resolve2(rotateValue);
      });
    });
  }
  setEnhancedRotate(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < -180 || value2 > 180) {
        reject2(Error("Invalid value. Min: -180, Max: 180"));
      } else {
        var formerObject;
        var valueObject = this._getCanvasAndZRotate(Number(value2));
        this.getEnhancedRotate().then((val) => {
          formerObject = this._getCanvasAndZRotate(Number(val));
          return Item$1.set(
            "prop:rotate_z",
            String(valueObject["zRotate"]),
            this._id
          );
        }).then(() => {
          return Item$1.set(
            "prop:rotate_canvas",
            String(valueObject["canvasRotate"]),
            this._id
          );
        }).then(() => {
          if (formerObject["orientation"] !== valueObject["orientation"]) {
            var outputResolution;
            var widthMax;
            var heightMax;
            Item$1.get("mixerresolution", this._id).then((val) => {
              outputResolution = val.split(",");
              widthMax = Number(outputResolution[0]);
              heightMax = Number(outputResolution[1]);
              return Item$1.get("prop:pos", this._id);
            }).then((val) => {
              var position = val.split(",");
              var leftPosition = parseFloat(position[0]) * widthMax;
              var topPosition = parseFloat(position[1]) * heightMax;
              var rightPosition = parseFloat(position[2]) * widthMax;
              var bottomPosition = parseFloat(position[3]) * heightMax;
              var newLeft;
              var newRight;
              var newTop;
              var newBottom;
              var widthValue = Math.round(rightPosition - leftPosition);
              var heightValue = Math.round(bottomPosition - topPosition);
              if (heightValue > widthMax) {
                newLeft = 0;
                newRight = widthMax;
              } else {
                var xCenter = leftPosition + (rightPosition - leftPosition) / 2;
                newLeft = xCenter - heightValue / 2;
                newRight = xCenter + heightValue / 2;
              }
              if (widthValue > heightMax) {
                newTop = 0;
                newBottom = heightMax;
              } else {
                var yCenter = topPosition + (bottomPosition - topPosition) / 2;
                newTop = yCenter - widthValue / 2;
                newBottom = yCenter + widthValue / 2;
              }
              var leftPos = newLeft / widthMax;
              var topPos = newTop / heightMax;
              var rightPos = newRight / widthMax;
              var bottomPos = newBottom / heightMax;
              return Item$1.set("prop:pos", leftPos.toFixed(6) + "," + topPos.toFixed(6) + "," + rightPos.toFixed(6) + "," + bottomPos.toFixed(6), this._id);
            }).then(() => {
              return Item$1.get("prop:posaspect", this._id);
            }).then((val) => {
              return Item$1.set("prop:pos", val, this._id);
            }).then(() => {
              resolve2(this);
            });
          } else {
            resolve2(this);
          }
        });
      }
    });
  }
  setCroppingEnhanced(value2) {
    return new Promise((resolve2, reject2) => {
      if (value2.hasOwnProperty("top") && value2.hasOwnProperty("left") && value2.hasOwnProperty("right") && value2.hasOwnProperty("bottom")) {
        var originalWidth;
        var originalHeight;
        var outputResolution;
        var position;
        var canvasRotate;
        var preCropPosition = {};
        Item$1.get("mixerresolution", this._id).then((val) => {
          outputResolution = val.split(",");
          return Item$1.get("prop:pos", this._id);
        }).then((val) => {
          position = val.split(",");
          return Item$1.get("prop:rotate_canvas", this._id);
        }).then((val) => {
          canvasRotate = val;
          return Item$1.get("prop:crop", this._id);
        }).then((val) => {
          var mixerWidth = parseInt(outputResolution[0]);
          var mixerHeight = parseInt(outputResolution[1]);
          var leftPositionInit = parseFloat(position[0]) * mixerWidth;
          var topPositionInit = parseFloat(position[1]) * mixerHeight;
          var rightPositionInit = parseFloat(position[2]) * mixerWidth;
          var bottomPositionInit = parseFloat(position[3]) * mixerHeight;
          var widthValue = rightPositionInit - leftPositionInit;
          var heightValue = bottomPositionInit - topPositionInit;
          var crop = val.split(",");
          var leftCropRaw = parseFloat(crop[0]);
          var topCropRaw = parseFloat(crop[1]);
          var rightCropRaw = parseFloat(crop[2]);
          var bottomCropRaw = parseFloat(crop[3]);
          var leftValue = Math.round(leftCropRaw * 100);
          var topValue = Math.round(topCropRaw * 100);
          var rightValue = Math.round(rightCropRaw * 100);
          var bottomValue = Math.round(bottomCropRaw * 100);
          var isNoCropping = leftValue == 0 && topValue == 0 && rightValue == 0 && bottomValue == 0;
          if (canvasRotate == 270) {
            if (isNoCropping) {
              preCropPosition = position;
              originalHeight = widthValue;
              originalWidth = heightValue;
            } else {
              var leftPosition = parseFloat(position[3]);
              var topPosition = parseFloat(position[0]);
              var rightPosition = parseFloat(position[1]);
              var bottomPosition = parseFloat(position[2]);
              if (leftCropRaw != 0 || rightCropRaw != 0) {
                originalWidth = heightValue / (1 - rightCropRaw - leftCropRaw);
                var leftDifference = originalWidth * leftCropRaw / mixerHeight;
                preCropPosition[3] = leftPosition + leftDifference;
                var rightDifference = originalWidth * rightCropRaw / mixerHeight;
                preCropPosition[1] = rightPosition - rightDifference;
              } else {
                originalWidth = heightValue;
              }
              if (topCropRaw != 0 || bottomCropRaw != 0) {
                originalHeight = widthValue / (1 - bottomCropRaw - topCropRaw);
                var topDifference = originalHeight * topCropRaw / mixerWidth;
                preCropPosition[0] = topPosition - topDifference;
                var bottomDifference = originalHeight * bottomCropRaw / mixerWidth;
                preCropPosition[2] = bottomPosition + bottomDifference;
              } else {
                originalHeight = widthValue;
              }
              if (leftCropRaw == 0) {
                preCropPosition[3] = position[3];
              }
              if (topCropRaw == 0) {
                preCropPosition[0] = position[0];
              }
              if (rightCropRaw == 0) {
                preCropPosition[1] = position[1];
              }
              if (bottomCropRaw == 0) {
                preCropPosition[2] = position[2];
              }
            }
          } else if (canvasRotate == 180) {
            if (isNoCropping) {
              preCropPosition = position;
              originalWidth = widthValue;
              originalHeight = heightValue;
            } else {
              var leftPosition = parseFloat(position[2]);
              var topPosition = parseFloat(position[3]);
              var rightPosition = parseFloat(position[0]);
              var bottomPosition = parseFloat(position[1]);
              if (leftCropRaw != 0 || rightCropRaw != 0) {
                originalWidth = widthValue / (1 - rightCropRaw - leftCropRaw);
                var leftDifference = originalWidth * leftCropRaw / mixerWidth;
                preCropPosition[2] = leftPosition + leftDifference;
                var rightDifference = originalWidth * rightCropRaw / mixerWidth;
                preCropPosition[0] = rightPosition - rightDifference;
              } else {
                originalWidth = widthValue;
              }
              if (topCropRaw != 0 || bottomCropRaw != 0) {
                originalHeight = heightValue / (1 - bottomCropRaw - topCropRaw);
                var topDifference = originalHeight * topCropRaw / mixerHeight;
                preCropPosition[3] = topPosition + topDifference;
                var bottomDifference = originalHeight * bottomCropRaw / mixerHeight;
                preCropPosition[1] = bottomPosition - bottomDifference;
              } else {
                originalHeight = heightValue;
              }
              if (leftCropRaw == 0) {
                preCropPosition[2] = position[2];
              }
              if (topCropRaw == 0) {
                preCropPosition[3] = position[3];
              }
              if (rightCropRaw == 0) {
                preCropPosition[0] = position[0];
              }
              if (bottomCropRaw == 0) {
                preCropPosition[1] = position[1];
              }
            }
          } else if (canvasRotate == 90) {
            if (isNoCropping) {
              preCropPosition = position;
              originalHeight = widthValue;
              originalWidth = heightValue;
            } else {
              var leftPosition = parseFloat(position[1]);
              var topPosition = parseFloat(position[2]);
              var rightPosition = parseFloat(position[3]);
              var bottomPosition = parseFloat(position[0]);
              if (leftCropRaw != 0 || rightCropRaw != 0) {
                originalWidth = heightValue / (1 - rightCropRaw - leftCropRaw);
                var leftDifference = originalWidth * leftCropRaw / mixerHeight;
                preCropPosition[1] = leftPosition - leftDifference;
                var rightDifference = originalWidth * rightCropRaw / mixerHeight;
                preCropPosition[3] = rightPosition + rightDifference;
              } else {
                originalWidth = heightValue;
              }
              if (topCropRaw != 0 || bottomCropRaw != 0) {
                originalHeight = widthValue / (1 - bottomCropRaw - topCropRaw);
                var topDifference = originalHeight * topCropRaw / mixerWidth;
                preCropPosition[2] = topPosition + topDifference;
                var bottomDifference = originalHeight * bottomCropRaw / mixerWidth;
                preCropPosition[0] = bottomPosition - bottomDifference;
              } else {
                originalHeight = widthValue;
              }
              if (leftCropRaw == 0) {
                preCropPosition[1] = position[1];
              }
              if (topCropRaw == 0) {
                preCropPosition[2] = position[2];
              }
              if (rightCropRaw == 0) {
                preCropPosition[3] = position[3];
              }
              if (bottomCropRaw == 0) {
                preCropPosition[0] = position[0];
              }
            }
          } else {
            if (isNoCropping) {
              preCropPosition = position;
              originalHeight = heightValue;
              originalWidth = widthValue;
            } else {
              var leftPosition = parseFloat(position[0]);
              var topPosition = parseFloat(position[1]);
              var rightPosition = parseFloat(position[2]);
              var bottomPosition = parseFloat(position[3]);
              if (leftCropRaw != 0 || rightCropRaw != 0) {
                originalWidth = widthValue / (1 - rightCropRaw - leftCropRaw);
                var leftDifference = originalWidth * leftCropRaw / mixerWidth;
                preCropPosition[0] = leftPosition - leftDifference;
                var rightDifference = originalWidth * rightCropRaw / mixerWidth;
                preCropPosition[2] = rightPosition + rightDifference;
              } else {
                originalWidth = widthValue;
              }
              if (topCropRaw != 0 || bottomCropRaw != 0) {
                originalHeight = heightValue / (1 - bottomCropRaw - topCropRaw);
                var topDifference = originalHeight * topCropRaw / mixerHeight;
                preCropPosition[1] = topPosition - topDifference;
                var bottomDifference = originalHeight * bottomCropRaw / mixerHeight;
                preCropPosition[3] = bottomPosition + bottomDifference;
              } else {
                originalHeight = heightValue;
              }
              if (leftCropRaw == 0) {
                preCropPosition[0] = position[0];
              }
              if (topCropRaw == 0) {
                preCropPosition[1] = position[1];
              }
              if (rightCropRaw == 0) {
                preCropPosition[2] = position[2];
              }
              if (bottomCropRaw == 0) {
                preCropPosition[3] = position[3];
              }
            }
          }
          var leftCrop = value2["left"];
          var topCrop = value2["top"];
          var rightCrop = value2["right"];
          var bottomCrop = value2["bottom"];
          var leftPosition = parseFloat(preCropPosition[0]);
          var topPosition = parseFloat(preCropPosition[1]);
          var rightPosition = parseFloat(preCropPosition[2]);
          var bottomPosition = parseFloat(preCropPosition[3]);
          var sourceHeight = (bottomPosition - topPosition) * mixerHeight;
          var sourceWidth = (rightPosition - leftPosition) * mixerWidth;
          var newLeft, newTop, newRight, newBottom;
          if (canvasRotate == 270) {
            newLeft = topCrop * sourceWidth / mixerWidth + leftPosition;
            newTop = rightCrop * sourceHeight / mixerHeight + topPosition;
            newRight = rightPosition - bottomCrop * sourceWidth / mixerWidth;
            newBottom = bottomPosition - leftCrop * sourceHeight / mixerHeight;
          } else if (canvasRotate == 180) {
            newLeft = rightCrop * sourceWidth / mixerWidth + leftPosition;
            newTop = bottomCrop * sourceHeight / mixerHeight + topPosition;
            newRight = rightPosition - leftCrop * sourceWidth / mixerWidth;
            newBottom = bottomPosition - topCrop * sourceHeight / mixerHeight;
          } else if (canvasRotate == 90) {
            newLeft = bottomCrop * sourceWidth / mixerWidth + leftPosition;
            newTop = leftCrop * sourceHeight / mixerHeight + topPosition;
            newRight = rightPosition - topCrop * sourceWidth / mixerWidth;
            newBottom = bottomPosition - rightCrop * sourceHeight / mixerHeight;
          } else {
            newLeft = leftCrop * sourceWidth / mixerWidth + leftPosition;
            newTop = topCrop * sourceHeight / mixerHeight + topPosition;
            newRight = rightPosition - rightCrop * sourceWidth / mixerWidth;
            newBottom = bottomPosition - bottomCrop * sourceHeight / mixerHeight;
          }
          Item$1.set("prop:crop", value2["left"].toFixed(6) + "," + value2["top"].toFixed(6) + "," + value2["right"].toFixed(6) + "," + value2["bottom"].toFixed(6), this._id).then(() => {
            return Item$1.set("prop:pos", newLeft.toFixed(6) + "," + newTop.toFixed(6) + "," + newRight.toFixed(6) + "," + newBottom.toFixed(6), this._id);
          }).then(() => {
            resolve2(this);
          });
        });
      } else {
        reject2(Error("Error setting cropping, insufficient properties (left, top, right, bottom)"));
      }
    });
  }
  bringForward() {
    return new Promise((resolve2) => {
      Item$1.set("prop:zorder", "+", this._id).then(() => {
        resolve2(this);
      });
    });
  }
  sendBackward() {
    return new Promise((resolve2) => {
      Item$1.set("prop:zorder", "-", this._id).then(() => {
        resolve2(this);
      });
    });
  }
  bringToFront() {
    return new Promise((resolve2) => {
      let itemsLength = 0;
      let itemIndex = -1;
      let forwardStep = 0;
      Scene.searchScenesByItemId(this._id).then((itemScene) => {
        return itemScene.getItems();
      }).then((sceneItems) => {
        itemsLength = sceneItems.length;
        for (var i = 0; i < itemsLength; ++i) {
          if (sceneItems[i]["_id"] === this._id) {
            itemIndex = i;
            break;
          }
        }
        if (itemsLength > 0 && itemIndex > -1) {
          forwardStep = itemsLength - 1 - itemIndex;
        }
        let promiseArray = [];
        let zorderPromise = (itemId, idx) => new Promise((zorderResolve) => {
          Item$1.set("prop:zorder", "+", this._id).then(() => {
            zorderResolve();
          });
        });
        for (var i = forwardStep - 1; i >= 0; i--) {
          promiseArray.push(zorderPromise(this._id));
        }
        Promise.all(promiseArray).then(() => {
          resolve2(this);
        });
      });
    });
  }
  sendToBack() {
    return new Promise((resolve2) => {
      let itemsLength = 0;
      let itemIndex = -1;
      let backwardStep = 0;
      Scene.searchScenesByItemId(this._id).then((itemScene) => {
        return itemScene.getItems();
      }).then((sceneItems) => {
        itemsLength = sceneItems.length;
        for (var i = 0; i < itemsLength; ++i) {
          if (sceneItems[i]["_id"] === this._id) {
            itemIndex = i;
            break;
          }
        }
        if (itemsLength > 0 && itemIndex > -1) {
          backwardStep = itemIndex;
        }
        let promiseArray = [];
        let zorderPromise = (itemId, idx) => new Promise((zorderResolve) => {
          Item$1.set("prop:zorder", "-", this._id).then(() => {
            zorderResolve();
          });
        });
        for (var i = backwardStep - 1; i >= 0; i--) {
          promiseArray.push(zorderPromise(this._id));
        }
        Promise.all(promiseArray).then(() => {
          resolve2(this);
        });
      });
    });
  }
}
function splitMode() {
  return new Promise((resolve2) => {
    App$1.getGlobalProperty("splitmode").then((mode) => {
      resolve2(mode === "1" ? 1 : 0);
    });
  });
}
function checkSplitmode(value2) {
  let scenePrefix = "";
  let scenePromise;
  return new Promise((resolve2, reject2) => {
    scenePromise = new Promise((sceneResolve) => {
      splitMode().then((res) => {
        if (res === 1 && !value2) {
          Scene.getActiveScene().then((val) => {
            value2 = val;
            sceneResolve(value2);
          });
        } else {
          sceneResolve(value2);
        }
      });
    });
    scenePromise.then((val) => {
      if (typeof val === "number" || val instanceof Scene) {
        Scene.getSceneCount().then((sceneCount) => {
          if (typeof val === "number") {
            let int = Math.floor(val);
            if (int > sceneCount || int === 0) {
              reject2(Error("Scene does not exist."));
            } else {
              scenePrefix = "s:" + (int - 1) + "|";
              resolve2(scenePrefix);
            }
          } else {
            val.getSceneNumber().then((int) => {
              if (int > sceneCount || int === 0) {
                reject2(Error("Scene does not exist."));
              } else {
                scenePrefix = "s:" + (int - 1) + "|";
                resolve2(scenePrefix);
              }
            });
          }
        });
      } else if (typeof val === "undefined") {
        resolve2("");
      } else {
        reject2(Error("Optional parameter 'scene' only accepts integers or an XJS.Scene object"));
      }
    });
  });
}
class AddToSceneEventEmitter extends EventEmitter {
  constructor() {
    super();
    if (Global.isListenToItemAdd()) {
      const prevAppOnItemAdded = window$1.AppOnItemAdded;
      window$1.AppOnItemAdded = (...args) => {
        this.emit(args[0], args[1]);
        if (typeof prevAppOnItemAdded === "function")
          prevAppOnItemAdded(...args);
      };
      exec("AppSubscribeEvents");
    }
  }
  //Gets/Creates the instance of the AddToSceneEventEmitter class.
  static getInstance() {
    if (AddToSceneEventEmitter._instance === void 0) {
      AddToSceneEventEmitter._instance = new AddToSceneEventEmitter();
    }
    return AddToSceneEventEmitter._instance;
  }
}
function guid(a) {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, guid);
}
function addToSceneHandler(cmd, ...args) {
  return new Promise((resolve2, reject2) => {
    const eventId = "EVENT-XJS-CREATE-" + guid(null) + "-" + Date.now();
    if (Global.isListenToItemAdd()) {
      const _addToScene = AddToSceneEventEmitter.getInstance();
      const itemCreated = (itemId) => {
        _addToScene.off(eventId, itemCreated);
        resolve2(itemId);
      };
      _addToScene.on(eventId, itemCreated);
    }
    App$1.callFunc("e:" + eventId + "|" + cmd, ...args).then(() => {
      if (!Global.isListenToItemAdd()) resolve2(true);
    }).catch((err) => {
      reject2(err);
    });
  });
}
const MIN_FPS = 24;
const MAX_FPS = 300;
class iSourceGame {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  isSpecialOptimizationEnabled() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isSpecialOptimizationEnabled", true);
        Item$1.get("GameCapSurfSharing", this._id).then((res) => {
          resolve2(res === "1");
        });
      } else {
        Item$1.wrapGet("GameCapSurfSharing", this._srcId, this._id, this._updateId.bind(this)).then((res) => {
          resolve2(res === "1");
        });
      }
    });
  }
  setSpecialOptimizationEnabled(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setSpecialOptimizationEnabled", true);
        Item$1.set(
          "GameCapSurfSharing",
          value2 ? "1" : "0",
          this._id
        ).then(() => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet(
          "GameCapSurfSharing",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then(() => {
          resolve2(this);
        });
      }
    });
  }
  isShowMouseEnabled() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isShowMouseEnabled", true);
        Item$1.get("GameCapShowMouse", this._id).then((res) => {
          resolve2(res === "1");
        });
      } else {
        Item$1.wrapGet("GameCapShowMouse", this._srcId, this._id, this._updateId.bind(this)).then((res) => {
          resolve2(res === "1");
        });
      }
    });
  }
  setShowMouseEnabled(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setShowMouseEnabled", true);
        Item$1.set("GameCapShowMouse", value2 ? "1" : "0", this._id).then(() => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet("GameCapShowMouse", value2 ? "1" : "0", this._srcId, this._id, this._updateId.bind(this)).then(() => {
          resolve2(this);
        });
      }
    });
  }
  setOfflineImage(path) {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "setOfflineImage", true);
    }
    return new Promise((resolve2, reject2) => {
      if (this._type !== ItemTypes.GAMESOURCE) {
        reject2(Error("Current item should be a game item"));
      } else if (Environment.isSourcePlugin()) {
        reject2(
          Error("Source plugins cannot update offline images of other items")
        );
      } else if (!(this._value instanceof XML)) {
        this.getValue().then(() => {
          this.setOfflineImage(path).then((itemObj) => {
            resolve2(itemObj);
          });
        });
      } else {
        var regExp = new RegExp('^(([A-Z|a-z]:\\\\[^*|"<>?\n]*)|(\\\\\\\\.*?\\\\.*)|([A-Za-z]+\\\\[^*|"<>?\\n]*)).(png|gif|jpg|jpeg|tif)$');
        if (regExp.test(path.toLowerCase()) || path === "") {
          var valueObj = JSON$1.parse(this._value.toString());
          valueObj["replace"] = path;
          this.setValue(XML.parseJSON(valueObj)).then(() => {
            resolve2(this);
          });
        } else {
          reject2(
            Error("Invalid file path or type is provided.")
          );
        }
      }
    });
  }
  getOfflineImage() {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "getOfflineImage", true);
    }
    return new Promise((resolve2, reject2) => {
      if (this._type !== ItemTypes.GAMESOURCE) {
        reject2(Error("Current item should be a game item"));
      } else {
        this.getValue().then((value2) => {
          var valueObj = JSON$1.parse(this._value.toString());
          resolve2(valueObj["replace"] ? valueObj["replace"] : "");
        });
      }
    });
  }
  isTransparent() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isTransparent", true);
        this._checkPromise = Item$1.get("prop:GameCapAlpha", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet("prop:GameCapAlpha", this._srcId, this._id, this._updateId.bind(this));
      }
      this._checkPromise.then((res) => {
        resolve2(res === "1");
      });
    });
  }
  setTransparent(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setTransparent", true);
        this._checkPromise = Item$1.set("prop:GameCapAlpha", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet("prop:GameCapAlpha", value2 ? "1" : "0", this._srcId, this._id, this._updateId.bind(this));
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  getGameFPSCap() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getGameFPSCap", true);
        this._checkPromise = Item$1.get("prop:GameCapFrameTimeLimit", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet("prop:GameCapFrameTimeLimit", this._srcId, this._id, this._updateId.bind(this));
      }
      this._checkPromise.then((res) => {
        if (res === "0" || res === "" || res === 0) {
          resolve2(0);
        } else {
          let fps = Math.floor(1e7 / Number(res));
          fps = Math.min(Math.max(fps, MIN_FPS), MAX_FPS);
          resolve2(fps);
        }
      });
    });
  }
  setGameFPSCap(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 !== 0 && (Number(value2) < MIN_FPS || Number(value2) > MAX_FPS)) {
        reject2(RangeError(`Game FPS cap may only be 0 or in the range of ${MIN_FPS} to ${MAX_FPS}.`));
      } else {
        let frametime = value2 > 0 ? Math.floor(1e7 / Number(value2)) : 0;
        if (this._isItemCall) {
          Logger.warn("sourceWarning", "setGameFPSCap", true);
          Item$1.set("prop:GameCapFrameTimeLimit", String(frametime), this._id).then(() => {
            resolve2(this);
          });
        } else {
          Item$1.wrapSet("prop:GameCapFrameTimeLimit", String(frametime), this._srcId, this._id, this._updateId.bind(this)).then(() => {
            resolve2(this);
          });
        }
      }
    });
  }
}
class GameSource extends Source {
}
applyMixins(GameSource, [iSourceGame]);
class Audio {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  getVolume() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getVolume", true);
        this._checkPromise = Item$1.get("prop:volume", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:volume",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setVolume(value2) {
    return new Promise((resolve2) => {
      value2 = value2 < 0 ? 0 : value2 > 100 ? 100 : value2;
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setVolume", true);
        this._checkPromise = Item$1.set("prop:volume", String(value2), this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:volume",
          String(value2),
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isMute() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isMute", true);
        this._checkPromise = Item$1.get("prop:mute", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:mute",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setMute(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setMute", true);
        this._checkPromise = Item$1.set("prop:mute", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:mute",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isAutoMute() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isAutoMute", true);
        this._checkPromise = Item$1.get("prop:keepaudio", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:keepaudio",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val !== "1");
      });
    });
  }
  setAutoMute(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setAutoMute", true);
        this._checkPromise = Item$1.set("prop:keepaudio", value2 ? "0" : "1", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:keepaudio",
          value2 ? "0" : "1",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isStreamOnlyAudio() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isStreamOnlyAudio", true);
        this._checkPromise = Item$1.get("prop:sounddev", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:sounddev",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setStreamOnlyAudio(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setStreamOnlyAudio", true);
        this._checkPromise = Item$1.set("prop:sounddev", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:sounddev",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isAudioAvailable() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isAudioAvailable", true);
        this._checkPromise = Item$1.get("prop:audioavail", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:audioavail",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
}
class CameraDevice {
  constructor(props) {
    this._id = props["id"];
    this._name = props["name"];
  }
  /**
   * return: string
   *
   * Get the ID of the device. The ID of the device is based on the `disp`
   * attribute of the devices XML
   *
   * #### Usage
   *
   * ```javascript
   * var cameraID = device.getId();
   * ```
   */
  getId() {
    return this._id;
  }
  /**
   * return: string
   *
   * Get the Name of the device.
   *
   * #### Usage
   *
   * ```javascript
   * var cameraName = device.getName();
   * ```
   */
  getName() {
    return this._name;
  }
  /**
   * return: XML
   *
   * Convert the current CameraDevice object to XML
   *
   * #### Usage
   *
   * ```javascript
   * var xml = device.toXML();
   * ```
   */
  toXML() {
    var json = new JSON$1();
    json["disp"] = this._id;
    json["name"] = this._name;
    return XML.parseJSON(json);
  }
  /**
   * param: (deviceJSON: JXON)
   * ```
   * return: CameraDevice
   * ```
   *
   * Create a CameraDevice object based on a JXON object
   *
   * #### Usage
   *
   * ```javascript
   * var camera = CameraDevice.parse(JSONObj);
   * ```
   */
  static parse(deviceJSON) {
    var cam = new CameraDevice({
      id: deviceJSON["disp"].replace(/&amp;/ig, "&"),
      name: deviceJSON["name"]
    });
    return cam;
  }
  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds this camera device to the current scene by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value2) {
    return new Promise((resolve2, reject2) => {
      checkSplitmode(value2).then((scenePrefix) => {
        return addToSceneHandler(scenePrefix + "addcamera", "dev:" + this._id);
      }).then((result) => {
        resolve2(result);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
}
const _AudioDevice = class _AudioDevice {
  constructor(props) {
    this._defaultConsole = false;
    this._defaultMultimedia = false;
    this._defaultCommunication = false;
    props = props || {};
    this._id = props["id"];
    this._name = props["name"];
    this._adapter = props["adapter"];
    this._adapterdev = props["adapterdev"];
    this._dSoundGuid = props["dSoundGuid"];
    this._dataFlow = props["dataFlow"];
    this._state = props["state"];
    this._defaultConsole = props["defaultConsole"];
    this._defaultMultimedia = props["defaultMultimedia"];
    this._defaultCommunication = props["defaultCommunication"];
    this._level = props["level"] !== void 0 ? props["level"] : 1;
    this._enable = props["enable"] !== void 0 ? props["enable"] : true;
    this._hwlevel = props["hwlevel"] !== void 0 ? props["hwlevel"] : -1;
    this._hwenable = props["hwenable"] !== void 0 ? props["hwenable"] : 255;
    this._delay = props["delay"] !== void 0 ? props["delay"] : 0;
    this._mix = props["mix"] !== void 0 ? props["mix"] : 0;
  }
  /**
   * return: string
   *
   * Gets the device ID
   *
   * #### Usage
   *
   * ```javascript
   * var audioDeviceID = device.getId();
   * ```
   */
  getId() {
    return this._id;
  }
  /**
   * return: string
   *
   * Gets the device name
   *
   * #### Usage
   *
   * ```javascript
   * var audioDeviceName = device.getName();
   * ```
   */
  getName() {
    return this._name;
  }
  /**
   * return: string
   *
   * Gets whether device is capturing or rendering audio
   *
   * #### Usage
   *
   * ```javascript
   * var audioDataFlow = device.getDataFlow();
   *   //where possible values are 'Render' or 'Capture'
   * ```
   */
  getDataFlow() {
    return this._dataFlow;
  }
  /**
   * return: boolean
   *
   * Gets whether audio device is the system default
   *
   * #### Usage
   *
   * ```javascript
   * var audioIsDefaultDevice = audioDevice.isDefaultDevice();
   * ```
   */
  isDefaultDevice() {
    return this._defaultConsole && this._defaultMultimedia;
  }
  /**
   * return: number
   *
   * Gets the device audio level in the application
   *
   * #### Usage
   *
   * ```javascript
   * var audioDeviceVolumeLevel = audioDevice.getLevel();
   * ```
   */
  getLevel() {
    return this._level;
  }
  /**
   * param: level<number>
   * ```
   * return: AudioDevice (used for chaining)
   * ```
   *
   * Sets the device audio level in the application
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice._setLevel(100);
   * ```
   */
  _setLevel(level) {
    this._level = level;
    return this;
  }
  /**
   * return: boolean
   *
   * Gets whether the audio device is enabled/not
   *
   * #### Usage
   *
   * ```javascript
   * var isAudioDeviceEnabled = audioDevice.isEnabled();
   * ```
   */
  isEnabled() {
    return this._enable;
  }
  /**
   * param: enabled<boolean>
   * ```
   * return: AudioDevice (used for chaining)
   * ```
   *
   * Enables audio device/sets software mute
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice._setEnabled(true);
   * ```
   */
  _setEnabled(enabled) {
    this._enable = enabled;
    return this;
  }
  /**
   * return: number
   *
   * Gets the device system volume
   *
   * #### Usage
   *
   * ```javascript
   * var systemVolumeLevel = audioDevice.getSystemLevel();
   * ```
   */
  getSystemLevel() {
    return this._hwlevel;
  }
  /**
   * param: volume<number>
   * ```
   * return: AudioDevice (used for chaining)
   * ```
   *
   * Sets the device system volume
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice._setSystemLevel(100);
   * ```
   */
  _setSystemLevel(hwlevel) {
    this._hwlevel = hwlevel;
    return this;
  }
  /**
   * return: number
   *
   * Gets whether audio device is enabled/muted in the system
   *
   * #### Usage
   *
   * ```javascript
   * var systemAudioDeviceEnabled = audioDevice.getSystemEnabled();
   * ```
   */
  getSystemEnabled() {
    return this._hwenable;
  }
  /**
   * param: systemEnabled<number>
   * ```
   * return: AudioDevice (used for chaining)
   * ```
   *
   * Enables audio device/sets software mute
   *
   * #### Usage
   *
   * ```javascript
   * // you may use the following:
   * //     * AudioDevice.SYSTEM_LEVEL_MUTE (0)
   * //     * AudioDevice.SYSTEM_LEVEL_ENABLE (1)
   * //     * AudioDevice.SYSTEM_MUTE_CHANGE_NOT_ALLOWED (255)
   * audioDevice._setSystemEnabled(AudioDevice.SYSTEM_LEVEL_MUTE);
   * ```
   */
  _setSystemEnabled(hwenabled) {
    this._hwenable = hwenabled;
    return this;
  }
  /**
   * return: number (100 nanoseconds in units)
   *
   * Get the loopback capture delay value
   *
   * #### Usage
   *
   * ```javascript
   * var audioDelay = audioDevice.getDelay();
   * ```
   */
  getDelay() {
    return this._delay;
  }
  /**
   * param: delay<number> (100 nanoseconds in units)
   * ```
   * return: AudioDevice (used for chaining)
   * ```
   *
   * Sets the loopback capture delay value
   *
   * #### Usage
   *
   * ```javascript
   * audioDevice._setDelay(100);
   * ```
   */
  _setDelay(delay) {
    this._delay = delay;
    return this;
  }
  /**
   * return: string
   *
   * Converts the AudioDevice object to XML-formatted string
   *
   * #### Usage
   *
   * ```javascript
   * var audioDeviceXMLString = AudioDevice.toString();
   * ```
   */
  toString() {
    var device = new JSON$1();
    device.tag = "dev";
    device.selfclosing = true;
    device["id"] = this.getId();
    device["level"] = (this.getLevel() / 100).toFixed(6);
    device["enable"] = this.isEnabled() ? 1 : 0;
    device["hwlevel"] = (this.getSystemLevel() / 100).toFixed(6);
    device["hwenable"] = this.getSystemEnabled();
    device["delay"] = this.getDelay();
    device["mix"] = this._mix;
    return XML.parseJSON(device).toString();
  }
  /**
   * param: deviceJXON<JSON>
   * ```
   * return: AudioDevice
   * ```
   *
   * Converts a JSON object into an AudioDevice object
   *
   * #### Usage
   *
   * ```javascript
   * var newAudioDevice = AudioDevice.parse(deviceJSONObj);
   * ```
   */
  static parse(deviceJXON) {
    var audio = new _AudioDevice({
      id: deviceJXON["id"],
      name: deviceJXON["name"],
      adapter: deviceJXON["adapter"],
      adapterdev: deviceJXON["adapterdev"],
      dataFlow: deviceJXON["DataFlow"],
      state: deviceJXON["State"],
      dSoundGuid: deviceJXON["DSoundGuid"],
      defaultCommunication: deviceJXON["DefaultCommunication"] === "1",
      defaultConsole: deviceJXON["DefaultConsole"] === "1",
      defaultMultimedia: deviceJXON["DefaultMultimedia"] === "1",
      mix: deviceJXON["mix"]
    });
    audio._setLevel(Number(deviceJXON["level"] !== void 0 ? deviceJXON["level"] * 100 : 100))._setEnabled(deviceJXON["enable"] !== void 0 ? deviceJXON["enable"] === "1" : true)._setSystemLevel(Number(deviceJXON["hwlevel"] !== void 0 ? deviceJXON["hwlevel"] * 100 : -100))._setSystemEnabled(Number(deviceJXON["hwenable"] !== void 0 ? deviceJXON["hwenable"] : 255))._setDelay(Number(deviceJXON["delay"] !== void 0 ? deviceJXON["delay"] : 0));
    return audio;
  }
};
_AudioDevice.SYSTEM_LEVEL_MUTE = 0;
_AudioDevice.SYSTEM_LEVEL_ENABLE = 1;
_AudioDevice.SYSTEM_MUTE_CHANGE_NOT_ALLOWED = 255;
let AudioDevice = _AudioDevice;
class MicrophoneDevice {
  /**
   * param: (deviceJXON: JXON)
   * ```
   * return MicrophoneDevice
   * ```
   * Create a MicrophoneDevice onject based on a JXON object
   *
   */
  static parse(jxon) {
    var m = new MicrophoneDevice();
    m._disp = jxon["disp"];
    m._name = jxon["name"];
    return m;
  }
  /**
   * return: string
   *
   * Gets the display ID
   *
   * #### Usage
   *
   * ```javascript
   * var micDisplayId = device.getDisplayId();
   * ```
   */
  getDisplayId() {
    return this._disp;
  }
  /**
   * return: string
   *
   * Gets the device name
   *
   * #### Usage
   *
   * ```javascript
   * var micName = device.getName();
   * ```
   */
  getName() {
    return this._name;
  }
  /**
   * return: XML
   *
   * Converts Microphone object into an XML object
   *
   * #### Usage
   *
   * ```javascript
   * var microphoneXML = microphone.toXML();
   * ```
   */
  toXML() {
    var microphone = new JSON$1();
    microphone.tag = "item";
    microphone["item"] = this._disp;
    microphone["name"] = this._name;
    microphone["type"] = "2";
    microphone["selfclosing"] = true;
    return XML.parseJSON(microphone);
  }
  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds this microphone device to the current scene by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value2) {
    return new Promise((resolve2, reject2) => {
      checkSplitmode(value2).then((scenePrefix) => {
        return addToSceneHandler(scenePrefix + "additem", this.toXML().toString());
      }).then((result) => {
        resolve2(result);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
}
class Game {
  /**
   * return: number
   *
   * Gets the game's process ID.
   *
   * #### Usage
   *
   * ```javascript
   * var processId = game.getPid();
   * ```
   */
  getPid() {
    return this._pid;
  }
  /**
   * return: number
   *
   * Gets the Graphics API handle.
   *
   * #### Usage
   *
   * ```javascript
   * var handle = game.getHandle();
   * ```
   */
  getHandle() {
    return this._handle;
  }
  /**
   * return: number
   *
   * Gets the window handle.
   *
   * #### Usage
   *
   * ```javascript
   * var windowHandle = game.getWindowHandle();
   * ```
   */
  getWindowHandle() {
    return this._hwnd;
  }
  /**
   * return: string
   *
   * Gets the Graphics API type.
   *
   * #### Usage
   *
   * ```javascript
   * var gApiType = game.getGapiType();
   * ```
   *
   * #### Possible Values
   *
   * ```
   * OGL, DX8, DX8_SwapChain, DX9, DX9Ex, DX9_SwapChain,
   * DX9_PresentEx, DX10, DX11, DX11.1, DX11.1_Present1
   * ```
   */
  getGapiType() {
    return this._gapitype;
  }
  /**
   * return: Rectangle
   *
   * Gets the game resolution in pixels.
   *
   * #### Usage
   *
   * ```javascript
   * var resolution = game.getResolution();
   * ```
   */
  getResolution() {
    return Rectangle.fromDimensions(this._width, this._height);
  }
  /**
   * return: boolean
   *
   * Checks if game has exclusive full screen.
   *
   * #### Usage
   *
   * ```javascript
   * var isFullscreen = game.isFullscreen();
   * ```
   */
  isFullscreen() {
    return this._flags === 1 ? true : false;
  }
  /**
   * return: string
   *
   * Gets the window title
   *
   * #### Usage
   *
   * ```javascript
   * var windowName = game.getWindowName();
   * ```
   */
  getWindowName() {
    return this._wndname;
  }
  /**
   * return: number
   *
   * Gets timestamp of last frame in milliseconds.
   *
   * #### Usage
   *
   * ```javascript
   * var lastFrameTimestamp = game.getLastFrameTimestamp();
   * ```
   */
  getLastFrameTimestamp() {
    return this._lastframets;
  }
  /**
   * return: number
   *
   * Get the FPS Render of the game
   */
  getFpsRender() {
    return this._fpsRender;
  }
  /**
   * return: number
   *
   * Get the Captured FPS of the game
   */
  getFpsCapture() {
    return this._fpsCapture;
  }
  /**
   * return: string
   *
   * Get the image name of the game
   */
  getImageName() {
    return this._imagename;
  }
  /**
   * return: string
   *
   * Get the replace image value of the game
   */
  getReplace() {
    return this._replace;
  }
  /**
   * param: gameJSON<JXON>
   * ```
   * return: Game
   * ```
   *
   * Converts a JSON object into a Game object
   *
   * #### Usage
   *
   * ```javascript
   * var XJS = require('xjs');
   * var game = XJS.Game.parse(jsonObj);
   * ```
   */
  static parse(jxon) {
    var g = new Game();
    g._pid = jxon["pid"] !== void 0 ? parseInt(jxon["pid"]) : void 0;
    g._handle = jxon["handle"] !== void 0 ? parseInt(jxon["handle"]) : void 0;
    g._hwnd = jxon["hwnd"] !== void 0 ? parseInt(jxon["hwnd"]) : void 0;
    g._gapitype = jxon["GapiType"];
    g._width = jxon["width"] !== void 0 ? parseInt(jxon["width"]) : void 0;
    g._height = jxon["height"] !== void 0 ? parseInt(jxon["height"]) : void 0;
    g._flags = jxon["flags"] !== void 0 ? parseInt(jxon["flags"]) : void 0;
    g._wndname = jxon["wndname"];
    g._lastframets = jxon["lastframets"] !== void 0 ? parseInt(jxon["lastframets"]) : void 0;
    g._fpsRender = jxon["fpsRender"] !== void 0 ? Number(jxon["fpsRender"]) : void 0;
    g._fpsCapture = jxon["fpsCapture"] !== void 0 ? Number(jxon["fpsCapture"]) : void 0;
    g._imagename = jxon["imagename"];
    g._replace = jxon["replace"];
    return g;
  }
  /**
   * return: XML
   *
   * Converts Game object into an XML object
   *
   * #### Usage
   *
   * ```javascript
   * var gameXML = game.toXML();
   * ```
   */
  toXML() {
    var gamesource = new JSON$1();
    gamesource.tag = "src";
    gamesource["pid"] = this._pid;
    gamesource["handle"] = this._handle;
    gamesource["hwnd"] = this._hwnd;
    gamesource["gapitype"] = this._gapitype;
    gamesource["width"] = this._width;
    gamesource["height"] = this._height;
    gamesource["flags"] = this._flags;
    gamesource["wndname"] = this._wndname;
    gamesource["lastframets"] = this._lastframets;
    gamesource["selfclosing"] = true;
    return XML.parseJSON(gamesource);
  }
  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds this game to the current scene by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value2) {
    return new Promise((resolve2, reject2) => {
      checkSplitmode(value2).then((scenePrefix) => {
        return addToSceneHandler(scenePrefix + "addgamesource", "dev:" + this.toXML());
      }).then((result) => {
        resolve2(result);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
  /**
   *  return: Game
   *
   *  Returns a special Game object that may be added to the stage. This
   *  object automatically detects any compatible games that are running
   *  and focused, and changes the displayed game on the stage accordingly.
   *
   *  #### Usage
   *
   * ```javascript
   * var xjs = require('xjs');
   * xjs.Game.autoDetect().addToScene();
   * ```
   */
  static autoDetect() {
    if (Game._autoDetect === void 0) {
      Game._autoDetect = new Game();
      let ad = Game._autoDetect;
      ad._pid = 0;
      ad._handle = 0;
      ad._hwnd = 0;
      ad._gapitype = "";
      ad._width = 0;
      ad._height = 0;
      ad._flags = 0;
      ad._wndname = "";
      ad._lastframets = 0;
      ad._fpsRender = 0;
      ad._fpsCapture = 0;
      ad._imagename = "";
      Game._autoDetect.addToScene = function(value2) {
        return new Promise((resolve2, reject2) => {
          checkSplitmode(value2).then((scenePrefix) => {
            var defposPromise;
            if (Environment.isSourcePlugin()) {
              defposPromise = new Promise((defposResolve) => {
                App$1.get("sceneconfig:-1").then((presetConfig) => {
                  let placementJSON = JSON$1.parse(presetConfig);
                  defposResolve(placementJSON["defpos"]);
                });
              });
            } else {
              defposPromise = new Promise((defposResolve) => {
                App$1.get("scene:0").then((main) => {
                  return App$1.get("sceneconfig:" + main);
                }).then(function(presetConfig) {
                  let placementJSON = JSON$1.parse(presetConfig);
                  defposResolve(placementJSON["defpos"]);
                });
              });
            }
            defposPromise.then((defpos) => {
              let posString;
              if (defpos === "0") {
                posString = 'pos_left="0" pos_top="0" pos_right="0.5" pos_bottom="0.5"';
              } else if (defpos === "1") {
                posString = 'pos_left="0.5" pos_top="0" pos_right="1" pos_bottom="0.5"';
              } else if (defpos === "2") {
                posString = 'pos_left="0" pos_top="0.5" pos_right="0.5" pos_bottom="1"';
              } else if (defpos === "3") {
                posString = 'pos_left="0.5" pos_top="0.5" pos_right="1" pos_bottom="1"';
              } else {
                posString = 'pos_left="0.25" pos_top="0.25" pos_right="0.75" pos_bottom="0.75"';
              }
              let adstring = '<item GameCapTrackActive="1" GameCapTrackActiveFullscreen="0" item="&lt;src pid=&quot;0&quot; handle=&quot;0&quot; hwnd=&quot;0&quot; GapiType=&quot;&quot; width=&quot;0&quot; height=&quot;0&quot; flags=&quot;0&quot; wndname=&quot;&quot; lastframets=&quot;0&quot; fpsRender=&quot;0.000000&quot; fpsCapture=&quot;0.000000&quot; imagename=&quot;&quot;/&gt; " name="Game: Auto Detect"  type="7" ' + posString + " />";
              return addToSceneHandler(scenePrefix + "additem", adstring);
            }).then((result) => {
              resolve2(result);
            });
          }).catch((err) => {
            reject2(err);
          });
        });
      };
    }
    return Game._autoDetect;
  }
}
class Screen {
  constructor(props) {
    this._title = props["title"];
    this._processDetail = props["processDetail"];
    this._class = props["class"];
    this._hwnd = props["hwnd"];
  }
  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds the prepared screen instance to the current screen by defualt.
   * Accpets optional parameter value, whhich when supplied, points
   * to the scene where the item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value2) {
    return new Promise((resolve2, reject2) => {
      let scenePrefix = "";
      if (this instanceof Screen && !Environment.isSourcePlugin()) {
        checkSplitmode(value2).then((prefix) => {
          scenePrefix = prefix;
          return `<screen module="${this._processDetail}" window="${this._title}" class="${this._class}" hwnd="${this._hwnd}" wclient="1" left="0" top="0" width="0" height="0" />`;
        }).then((screen) => {
          return addToSceneHandler(scenePrefix + "addscreen", screen);
        }).then((result) => {
          resolve2(result);
        }).catch((err) => {
          reject2(err);
        });
      } else {
        reject2(Error("Instance is not a Screen"));
      }
    });
  }
  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Initializes the screen region selector crosshair
   * so user may select a desktop region or a window to add to the stage in the current scene.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  static addToScene(value2) {
    return new Promise((resolve2, reject2) => {
      checkSplitmode(value2).then((scenePrefix) => {
        return addToSceneHandler(scenePrefix + "addscreen", null);
      }).then((result) => {
        resolve2(result);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
  /**
   * param: Object
   * ```
   * return Screen
   * ```
   *
   * Converts an object into a Screen object.
   *
   * #### Usage
   *
   * ```javascript
   * var XJS = require('xjs');
   * var screen = XJS.Screen.parse(jsonObj);
   * ```
   */
  static parse(screenInfo) {
    var screen = new Screen({
      "title": screenInfo["title"],
      "class": screenInfo["class"],
      "processDetail": screenInfo["processDetail"],
      "hwnd": screenInfo["hwnd"]
    });
    return screen;
  }
}
const _Dll = class _Dll extends EventEmitter {
  /**
   *  param: (path: string)
   *
   *  Loads one or more DLLs for the plugin to use. Currently, only Xjs.dll is
   *  auto-loaded and does not require loading. Loading DLLs will trigger a
   *  notification for the user, requesting access to be granted to DLL files.
   *  Your plugin should only call this once, at the beginning of execution.
   *
   *  Paths are relative to the main XBC application folder, so sample usage is:
   *
   *  ```javascript
   *  Dll.load(['Scriptdlls\\SplitMediaLabs\\XjsEx.dll']);
   *  ```
   */
  static load(path) {
    return new Promise((resolve2) => {
      exec("LoadDll", path.join(",")).then((result) => {
        resolve2(result);
      });
    });
  }
  /**
   *  param: (event: string, handler: Function)
   *
   *  Allows listening to events that this class emits. Currently there are two:
   *  `access-granted` and `access-revoked`.
   */
  static on(event, handler) {
    _Dll._emitter.on(event, handler);
  }
  /**
   *  param: (event: string, ...params: any[])
   *
   *  Allows this class to emit an event. Generally only useful for testing.
   */
  static emit(event, ...params) {
    params.unshift(event);
    _Dll._emitter.emit.apply(_Dll._emitter, params);
  }
  /**
   *  param: (funcName: string, ...params: string[])
   *
   *  return: Promise<string> (see {@link tutorials.html#/dll DLL documentation})
   *
   *  Calls a function from a loaded "safe" DLL. The only safe DLL we are
   *  currently exposing is `Xjs.dll`.
   */
  static call(func, ...params) {
    return new Promise((resolve2, reject2) => {
      const funcCall = "CallDll";
      params.unshift(func);
      params.unshift(funcCall);
      exec.apply(this, params).then((retValue) => {
        if (retValue !== void 0) {
          resolve2(retValue);
        } else {
          reject2(Error("DLL call not accessible."));
        }
      });
    });
  }
  /**
   *  param: (funcName: string, ...params: string[])
   *
   *  return: Promise<string> (see {@link tutorials.html#/dll DLL documentation})
   *
   *  Calls a function from a loaded "unsafe" DLL. The first DLL containing
   *  the function name will be called, so you need to ensure there are no
   *  function name collisions among DLLs for functions you require.
   *
   *  Some DLLs have callbacks. Assign a handler function to that callback in
   *  the global namespace (`window.callbackName = ...`), and the DLL will call
   *  that function accordingly.
   *
   *  See the documentation of your specific DLL for more details.
   */
  static callEx(func, ...params) {
    return new Promise((resolve2, reject2) => {
      const funcCall = "CallDllEx";
      params.unshift(func);
      params.unshift(funcCall);
      exec.apply(this, params).then((retValue) => {
        if (retValue !== void 0) {
          resolve2(retValue);
        } else {
          reject2(Error("DLL call not accessible."));
        }
      });
    });
  }
  /**
   *  return: Promise<boolean>
   *
   *  Determines if user has granted DLL access for this plugin. This also
   *  resolves to true if DLL security is disabled altogether.
   */
  static isAccessGranted() {
    return new Promise((resolve2) => {
      exec("CheckDllGrant").then((result) => {
        resolve2(result === "1");
      });
    });
  }
};
_Dll._emitter = new _Dll();
let Dll = _Dll;
const oldUpdateLocalProperty = window$1.UpdateLocalProperty;
window$1.UpdateLocalProperty = (prop, value2) => {
  if (prop === "prop:dlldogrant") {
    const granted = value2 === "1";
    if (granted) {
      Dll.emit("access-granted");
    } else {
      Dll.emit("access-revoked");
    }
  }
  if (typeof oldUpdateLocalProperty === "function") {
    oldUpdateLocalProperty(prop, value2);
  }
};
const oldSetdlldogrant = window$1.Setdlldogrant;
window$1.Setdlldogrant = (value2) => {
  const granted = value2 === "1";
  if (granted) {
    Dll.emit("access-granted");
  } else {
    Dll.emit("access-revoked");
  }
  if (typeof oldSetdlldogrant === "function") {
    oldSetdlldogrant(value2);
  }
};
var AudioDeviceDataflow = /* @__PURE__ */ ((AudioDeviceDataflow2) => {
  AudioDeviceDataflow2[AudioDeviceDataflow2["RENDER"] = 1] = "RENDER";
  AudioDeviceDataflow2[AudioDeviceDataflow2["CAPTURE"] = 2] = "CAPTURE";
  AudioDeviceDataflow2[AudioDeviceDataflow2["ALL"] = 3] = "ALL";
  return AudioDeviceDataflow2;
})(AudioDeviceDataflow || {});
var AudioDeviceState = /* @__PURE__ */ ((AudioDeviceState2) => {
  AudioDeviceState2[AudioDeviceState2["ACTIVE"] = 1] = "ACTIVE";
  AudioDeviceState2[AudioDeviceState2["DISABLED"] = 2] = "DISABLED";
  AudioDeviceState2[AudioDeviceState2["UNPLUGGED"] = 4] = "UNPLUGGED";
  AudioDeviceState2[AudioDeviceState2["NOTPRESENT"] = 8] = "NOTPRESENT";
  AudioDeviceState2[AudioDeviceState2["ALL"] = 15] = "ALL";
  return AudioDeviceState2;
})(AudioDeviceState || {});
class System {
  /**
   * return: Promise<AudioDevice[]>
   *
   * Gets audio devices, both input and output
   * See also: {@link #system/AudioDevice System/AudioDevice}
   *
   * #### Usage
   *
   * ```javascript
   * System.getAudioDevices(
   *   XML.AudioDeviceDataflow.ALL,
   *   XML.AudioDeviceState.ACTIVE
   * ).then(function(devices) {
   *   // devices is an array of AudioDevice object
   *   window.audios = devices;
   * });
   * ```
   */
  static getAudioDevices(dataflow = 3, state = 1) {
    return new Promise((resolve2) => {
      App$1.getAsList("wasapienum").then((devicesJXON) => {
        let devices = [];
        if (devicesJXON !== void 0) {
          var devicesJXONLength = devicesJXON.length;
          for (var i = 0; i < devicesJXONLength; ++i) {
            let device = devicesJXON[i];
            let bitsState = AudioDeviceState[String(device["State"]).toUpperCase().replace(/\s+/g, "")];
            if ((bitsState & state) !== bitsState) {
              continue;
            }
            let bitsFlow = AudioDeviceDataflow[String(device["DataFlow"]).toUpperCase()];
            if ((bitsFlow & dataflow) !== bitsFlow) {
              continue;
            }
            if (device["name"].toLowerCase().indexOf("xsplit") > -1) {
              continue;
            }
            devices.push(AudioDevice.parse(device));
          }
        }
        resolve2(devices);
      });
    });
  }
  /**
   * return: Promise<CameraDevice[]>
   *
   * Gets all camera devices
   * See also: {@link #system/CameraDevice System/CameraDevice}
   *
   * #### Usage
   *
   * ```javascript
   * System.getCameraDevices().then(function(devices) {
   *   // devices is an array of CameraDevice object
   *   window.cameras = devices;
   * });
   * ```
   */
  static getCameraDevices() {
    return new Promise((resolve2) => {
      App$1.getAsList("dshowenum:vsrc").then((devicesJSON) => {
        let devices = [];
        if (devicesJSON !== void 0) {
          for (let device of devicesJSON) {
            const dispUpperCase = String(device["disp"]).toUpperCase();
            if (dispUpperCase.indexOf("XSPLIT") === -1 && dispUpperCase !== "@DEVICE:SW:{860BB310-5D01-11D0-BD3B-00A0C911CE86}\\{778ABFB2-E87B-48A2-8D33-675150FCF8A2}" && String(device["name"]).toLowerCase().indexOf("Intel(R) RealSense(TM) 3D Camera Virtual Driver".toLowerCase()) === -1 && String(device["name"]).toLowerCase().indexOf("Intel(R) RealSense(TM) Camera SR300 Virtual Driver".toLowerCase()) === -1 && dispUpperCase.indexOf("@DEVICE:PNP:\\\\?\\USB#VID_8086&PID_0AA5&MI_02#") === -1 && dispUpperCase.indexOf("@DEVICE:PNP:\\\\?\\USB#VID_8086&PID_0A66&MI_02#") === -1) {
              devices.push(CameraDevice.parse(device));
            }
          }
          resolve2(devices);
        }
      });
    });
  }
  /**
   * return: Promise<Game[]>
   *
   * Gets all currently running games
   * See also: {@link #system/Game System/Game}
   *
   * #### Usage
   *
   * ```javascript
   * System.getGames().then(function(games) {
   *   // games is an array of Game object
   *   window.games = games;
   * });
   * ```
   */
  static getGames() {
    return new Promise((resolve2) => {
      App$1.getAsList("gsenum").then((gamesJXON) => {
        let games = [];
        if (gamesJXON !== void 0) {
          var gamesJXONLength = gamesJXON.length;
          for (var i = 0; i < gamesJXONLength; ++i) {
            games.push(Game.parse(gamesJXON[i]));
          }
        }
        resolve2(games);
      });
    });
  }
  /**
   * return: Promise<MicrophoneDevice[]>
   *
   * Gets all audio capture devices that may be added to the stage
   * See also: {@link #system/MicrophoneDevice System/MicrophoneDevice}
   *
   * #### Usage
   *
   * ```javascript
   * System.getMicrophones().then(function(microphones) {
   *   microphones[0].addToScene(); // add first microphone to stage
   * });
   * ```
   */
  static getMicrophones() {
    return new Promise((resolve2) => {
      App$1.getAsList("dshowenum:asrc").then((micsJXON) => {
        let mics = [];
        if (micsJXON !== void 0) {
          let micsJXONLength = micsJXON.length;
          for (var i = 0; i < micsJXONLength; ++i) {
            if (micsJXON[i]["WaveInId"] !== void 0) {
              mics.push(MicrophoneDevice.parse(micsJXON[i]));
            }
          }
        }
        resolve2(mics);
      });
    });
  }
  /**
   * return: Promise<Screen[]>
   *
   * Gets all available screen/windows that may be added to the stage
   * See also: {@link #system/Screen System/Screen}
   *
   * #### Usage
   *
   * ```javascript
   * System.getAvailableScreens().then(function(screens) {
   *   screens[0].addToScene(); // add first screen to stage
   * });
   * ```
   */
  static getAvailableScreens() {
    return new Promise((resolve2) => {
      let screens = [];
      const getParentWindows = Dll.call("xsplit.EnumParentWindows");
      getParentWindows.then((list) => {
        let processArray = list.split(",");
        return Promise.all(processArray.map((process) => {
          return Promise.all([
            Dll.call("xsplit.GetWindowTitle", process),
            Dll.call("xsplit.GetWindowClassName", process),
            Dll.call("xsplit.GetWindowProcessId", process),
            Promise.resolve(process)
          ]);
        }));
      }).then((windowDetailsArr) => {
        let devices2 = windowDetailsArr.filter((windowDetail) => windowDetail[0] !== "").filter((windowDetail) => windowDetail[0].toUpperCase().indexOf("XSPLIT BROADCASTER") !== 0).filter((windowDetail) => windowDetail[1].toUpperCase().indexOf("SHELL_TRAYWND") !== 0).filter((windowDetail) => windowDetail[1].toUpperCase().indexOf("BUTTON") !== 0).filter((windowDetail) => windowDetail[1].toUpperCase().indexOf("WINDOWS.UI.CORE.COREWINDOW") !== 0).map((windowDetail) => {
          Dll.call("xsplit.GetProcessDetailsKernel", windowDetail[2]).then((detail) => {
            let dev = {
              "title": windowDetail[0],
              "class": windowDetail[1],
              "processDetail": detail.toLocaleLowerCase(),
              "hwnd": windowDetail[3]
            };
            return screens.push(Screen.parse(dev));
          });
        });
        return devices2;
      }).then((res) => {
        resolve2(screens);
      });
    });
  }
  /**
   * return: Promise<string[]>
   *
   * Gets array of system-installed fonts
   *
   * #### Usage
   *
   * ```javascript
   * var mySelect = document.getElementById("mySelect");
   *
   * System.getSystemFonts().then(function(fontsArray) {
   *   var fontsArrayLength = fontsArray.length;
   *   for (var i = 0; i < fontsArrayLength; ++i) {
   *     var option = document.createElement('option');
   *     option.text = fontsArray[i];
   *     mySelect.add(option);
   *   }
   * });
   * ```
   */
  static getFonts() {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("function is not available for source"));
      } else {
        App$1.get("html:fontlist").then((fontlist) => {
          if (typeof fontlist === "string" && fontlist !== "") {
            var fontArray = fontlist.split(",");
            resolve2(fontArray);
          } else {
            reject2(Error("cannot fetch list of available system fonts"));
          }
        });
      }
    });
  }
  /**
   * return: Promise<JSON>
   *
   * Gets the position of the cursor. Does not work on Source Plugins.
   *
   * #### Usage
   *
   * ```javascript
   * System.getCursorPosition().then(function(pos) {
   *   var x = pos.x; // X Axis
   *   var y = pos.y; // Y Axis
   * });
   * ```
   */
  static getCursorPosition() {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("function is not available for source"));
      } else {
        let res;
        exec("GetCursorPos").then((result) => {
          res = result;
          if (typeof res === "string") {
            var posArr = res.split(",");
            var pos = {};
            pos["x"] = Number(posArr[0]);
            pos["y"] = Number(posArr[1]);
            resolve2(pos);
          } else {
            reject2(Error("cannot fetch current cursor position"));
          }
        });
      }
    });
  }
  /**
   * param: JSON: {x: number, y: number}
   *
   * Sets the position of the cursor. Does not work on Source Plugins.
   *
   * #### Usage
   *
   * ```javascript
   * System.setCursorPosition({x:0, y:0});
   * ```
   */
  static setCursorPosition(pos) {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("function is not available for source"));
      } else if (typeof pos.x !== "number" || typeof pos.y !== "number") {
        reject2(Error('Invalid parameters. Valid format is:: "JSON: {x: number, y: number}"'));
      } else {
        exec("SetCursorPos", String(pos.x), String(pos.y));
        resolve2(true);
      }
    });
  }
}
const _delayExclusionObject = {
  roxio: "vid_1b80&pid_e0(01|11|12)",
  hauppauge1: "vid_2040&pid_49(0[0-3]|8[0-3])",
  hauppauge2: "vid_2040&pid_e50[012a4]"
};
class SourceCamera {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  getDeviceId() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getDeviceId", true);
        Item$1.get("prop:item", this._id).then((val) => {
          resolve2(val);
        });
      } else {
        Item$1.wrapGet("prop:item", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          resolve2(val);
        });
      }
    });
  }
  getResolution() {
    return new Promise((resolve2) => {
      Item$1.get("prop:resolution", this._id).then((val) => {
        const [width, height] = val.split(",").map(Number);
        resolve2(Rectangle.fromDimensions(width, height));
      });
    });
  }
  getAudioOffset() {
    return new Promise((resolve2) => {
      var streamDelay, audioDelay;
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getAudioOffset", true);
        Item$1.get("prop:StreamDelay", this._id).then((val) => {
          streamDelay = Number(val);
          return Item$1.get("prop:AudioDelay", this._id);
        }).then((val) => {
          audioDelay = Number(val);
          resolve2((audioDelay - streamDelay) / 1e4);
        });
      } else {
        Item$1.wrapGet("prop:StreamDelay", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          streamDelay = Number(val);
          return Item$1.get("prop:AudioDelay", this._id);
        }).then((val) => {
          audioDelay = Number(val);
          resolve2((audioDelay - streamDelay) / 1e4);
        });
      }
    });
  }
  setAudioOffset(value2) {
    return new Promise((resolve2, reject2) => {
      var itemAudio, delay;
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setAudioOffset", true);
        this._checkPromise = Item$1.get("prop:itemaudio", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:itemaudio",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        itemAudio = val;
        return this.isAudioAvailable();
      }).then((val) => {
        if (val === false && itemAudio === "") {
          reject2(Error("Device has no audio"));
        } else {
          return this.getDelay();
        }
      }).then((val) => {
        delay = val;
        if (value2 >= 0) {
          return Item$1.set("prop:StreamDelay", String(delay * 1e4), this._id);
        } else {
          return Item$1.set(
            "prop:StreamDelay",
            String((delay + value2 * -1) * 1e4),
            this._id
          );
        }
      }).then((val) => {
        if (value2 >= 0) {
          return Item$1.set(
            "prop:AudioDelay",
            String((delay + value2) * 1e4),
            this._id
          );
        } else {
          return Item$1.set("prop:AudioDelay", String(delay * 1e4), this._id);
        }
      }).then((val) => {
        resolve2(this);
      });
    });
  }
  getAudioInput() {
    return new Promise((resolve2, reject2) => {
      var itemAudioId;
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getAudioInput", true);
        this._checkPromise = Item$1.get("prop:itemaudio", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:itemaudio",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        if (val === "") {
          reject2(Error("No tied audio input"));
        } else {
          itemAudioId = val;
          return System.getMicrophones();
        }
      }).then((val) => {
        var micDevice;
        if (val !== void 0) {
          for (var i = 0; i < val.length; ++i) {
            if (val[i].getDisplayId() === itemAudioId) {
              micDevice = val[i];
              break;
            }
          }
        }
        if (micDevice !== void 0) {
          resolve2(micDevice);
        } else {
          reject2(Error("Tied audio input not present"));
        }
      });
    });
  }
  setAudioInput(value2) {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setAudioInput", true);
        Item$1.set("prop:itemaudio", value2.getDisplayId(), this._id).then((val) => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet(
          "prop:itemaudio",
          value2.getDisplayId(),
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then((val) => {
          resolve2(this);
        });
      }
    });
  }
  isStreamPaused() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isStreamPaused", true);
        Item$1.get("prop:StreamPause", this._id).then((val) => {
          resolve2(val === "1");
        });
      } else {
        Item$1.wrapGet("prop:StreamPause", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          resolve2(val === "1");
        });
      }
    });
  }
  setStreamPaused(value2) {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setStreamPaused", true);
        this._checkPromise = Item$1.set(
          "prop:StreamPause",
          value2 ? "1" : "0",
          this._id
        );
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:StreamPause",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        return Item$1.get("prop:StreamPause", this._id);
      }).then((val) => {
        if (value2 === (val === "1")) {
          resolve2(this);
        } else {
          reject2(Error("Camera feed cannot be paused/resumed or is not present"));
        }
      });
    });
  }
  isHardwareEncoder() {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isHardwareEncoder", true);
        this._checkPromise = Item$1.get("prop:hwencoder", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:hwencoder",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        if (val === "1") {
          resolve2(true);
        } else {
          this.isActive().then((isActive) => {
            if (isActive) {
              resolve2(false);
            } else {
              reject2(Error("Cannot check hardware encoding. Device not present"));
            }
          });
        }
      });
    });
  }
  isActive() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isActive", true);
        Item$1.get("prop:activestate", this._id).then((val) => {
          resolve2(val === "active");
        });
      } else {
        Item$1.wrapGet("prop:activestate", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          resolve2(val === "active");
        });
      }
    });
  }
  getDelay() {
    return new Promise((resolve2) => {
      var streamDelay, audioDelay;
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getDelay", true);
        this._checkPromise = Item$1.get("prop:StreamDelay", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:StreamDelay",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then((val) => {
          streamDelay = Number(val);
          return Item$1.get("prop:AudioDelay", this._id);
        });
      }
      this._checkPromise.then((val) => {
        streamDelay = Number(val);
        return Item$1.get("prop:AudioDelay", this._id);
      }).then((val) => {
        audioDelay = Number(val);
        if (streamDelay < audioDelay) {
          resolve2(streamDelay / 1e4);
        } else {
          resolve2(audioDelay / 1e4);
        }
      });
    });
  }
  setDelay(value2) {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "setDelay", true);
    }
    return new Promise((resolve2, reject2) => {
      var isPositive, audioOffset;
      this.isHardwareEncoder().then((val) => {
        if (val === true) {
          reject2(Error("Cannot set delay to hardware encoder devices"));
        } else {
          return this.getValue();
        }
      }).then((val) => {
        for (var key in _delayExclusionObject) {
          var regex = new RegExp(
            _delayExclusionObject[key].toLowerCase(),
            "g"
          );
          if (typeof val === "string" && val.toLowerCase().match(regex) != null) {
            reject2(Error("Cannot set delay to specific device"));
            break;
          }
        }
        return this.getAudioOffset();
      }).then((val) => {
        audioOffset = val;
        if (audioOffset >= 0) {
          isPositive = true;
          if (this._isItemCall) {
            return Item$1.set("prop:StreamDelay", String(value2 * 1e4), this._id);
          } else {
            return Item$1.wrapSet("prop:StreamDelay", String(value2 * 1e4), this._srcId, this._id, this._updateId.bind(this));
          }
        } else {
          isPositive = false;
          return Item$1.set(
            "prop:StreamDelay",
            String((value2 + audioOffset * -1) * 1e4),
            this._id
          );
        }
      }).then((val) => {
        if (isPositive) {
          return Item$1.set(
            "prop:AudioDelay",
            String((value2 + audioOffset) * 1e4),
            this._id
          );
        } else {
          return Item$1.set("prop:AudioDelay", String(value2 * 1e4), this._id);
        }
      }).then((val) => {
        resolve2(this);
      });
    });
  }
  isForceDeinterlace() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isForceDeinterlace", true);
        Item$1.get("prop:fdeinterlace", this._id).then((val) => {
          resolve2(val === "3");
        });
      } else {
        Item$1.wrapGet("prop:fdeinterlace", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          resolve2(val === "3");
        });
      }
    });
  }
  setForceDeinterlace(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setForceDeinterlace", true);
        Item$1.set("prop:fdeinterlace", value2 ? "3" : "0", this._id).then(() => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet(
          "prop:fdeinterlace",
          value2 ? "3" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getValue() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getValue", true);
        this._checkPromise = Item$1.get("prop:srcitem", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:srcitem",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((filename) => {
        resolve2(filename);
      });
    });
  }
  setValue(camDevice) {
    return new Promise((resolve2, reject2) => {
      let camName;
      let _getName;
      if (camDevice instanceof CameraDevice) {
        _getName = new Promise((innerResolve) => {
          const name = camDevice.getName();
          camDevice = camDevice.getId();
          innerResolve(name);
        });
      } else if (typeof camDevice === "string") {
        _getName = new Promise((innerResolve) => {
          System.getCameraDevices().then((cameraDevices) => {
            const camGiven = cameraDevices.filter((cam) => {
              return cam.getId().toUpperCase() === camDevice.toUpperCase();
            });
            if (camGiven) {
              innerResolve(camGiven[0].getName());
            } else {
              innerResolve("");
            }
          });
        });
      } else {
        reject2(TypeError("Parameter should either be a CameraDevice or string."));
      }
      _getName.then((name) => {
        camName = name;
        if (this._isItemCall) {
          Logger.warn("sourceWarning", "setValue", true);
          return Item$1.set("prop:item", camDevice, this._id);
        } else {
          return Item$1.wrapSet(
            "prop:srcitem",
            camDevice,
            this._srcId,
            this._id,
            this._updateId.bind(this)
          );
        }
      }).then(() => {
        return Item$1.set("prop:name", camName, this._id);
      }).then(() => {
        resolve2(this);
      });
    });
  }
}
class CameraSource extends Source {
}
applyMixins(CameraSource, [Audio, SourceCamera]);
class SourceAudio {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  isSilenceDetectionEnabled() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isSilenceDetectionEnabled", true);
        Item$1.get("prop:AudioGainEnable", this._id).then((val) => {
          resolve2(val === "1");
        });
      } else {
        Item$1.wrapGet(
          "prop:AudioGainEnable",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then((val) => {
          resolve2(val === "1");
        });
      }
    });
  }
  setSilenceDetectionEnabled(value2) {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setSilenceDetectionEnabled", true);
        Item$1.set("prop:AudioGainEnable", value2 ? "1" : "0", this._id).then((res) => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet(
          "prop:AudioGainEnable",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then((res) => {
          resolve2(this);
        });
      }
    });
  }
  getSilenceThreshold() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getSilenceThreshold", true);
        Item$1.get("prop:AudioGain", this._id).then((val) => {
          resolve2(Number(val));
        });
      } else {
        Item$1.wrapGet("prop:AudioGain", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          resolve2(Number(val));
        });
      }
    });
  }
  setSilenceThreshold(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(Error("Only numbers are acceptable values for threshold"));
      } else if (value2 % 1 !== 0 || value2 < 0 || value2 > 128) {
        reject2(
          Error("Only integers in the range 0-128 are acceptable for threshold")
        );
      } else {
        if (this._isItemCall) {
          Logger.warn("sourceWarning", "setSilenceThreshold", true);
          Item$1.set("prop:AudioGain", String(value2), this._id).then((res) => {
            resolve2(this);
          });
        } else {
          Item$1.wrapSet(
            "prop:AudioGain",
            String(value2),
            this._srcId,
            this._id,
            this._updateId.bind(this)
          ).then((res) => {
            resolve2(this);
          });
        }
      }
    });
  }
  getSilencePeriod() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getSilencePeriod", true);
        Item$1.get("prop:AudioGainLatency", this._id).then((val) => {
          resolve2(Number(val));
        });
      } else {
        Item$1.wrapGet(
          "prop:AudioGainLatency",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then((val) => {
          resolve2(Number(val));
        });
      }
    });
  }
  setSilencePeriod(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(Error("Only numbers are acceptable values for period"));
      } else if (value2 % 1 !== 0 || value2 < 0 || value2 > 1e4) {
        reject2(
          Error("Only integers in the range 0-10000 are acceptable for period")
        );
      } else {
        if (this._isItemCall) {
          Logger.warn("sourceWarning", "setSilencePeriod", true);
          Item$1.set("prop:AudioGainLatency", String(value2), this._id).then((res) => {
            resolve2(this);
          });
        } else {
          Item$1.wrapSet(
            "prop:AudioGainLatency",
            String(value2),
            this._srcId,
            this._id,
            this._updateId.bind(this)
          ).then((res) => {
            resolve2(this);
          });
        }
      }
    });
  }
  getAudioOffset() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getAudioOffset", true);
        Item$1.get("prop:AudioDelay", this._id).then((val) => {
          resolve2(Number(val));
        });
      } else {
        Item$1.wrapGet(
          "prop:AudioDelay",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then((val) => {
          resolve2(Number(val));
        });
      }
    });
  }
  setAudioOffset(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(Error("Only numbers are acceptable values for period"));
      } else if (value2 < 0) {
        reject2(Error("Audio offset cannot be negative"));
      } else {
        if (this._isItemCall) {
          Logger.warn("sourceWarning", "setAudioOffset", true);
          Item$1.set("prop:AudioDelay", String(value2), this._id).then((res) => {
            resolve2(this);
          });
        } else {
          Item$1.wrapSet(
            "prop:AudioDelay",
            String(value2),
            this._srcId,
            this._id,
            this._updateId.bind(this)
          ).then((res) => {
            resolve2(this);
          });
        }
      }
    });
  }
  getValue() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getValue", true);
        this._checkPromise = Item$1.get("prop:srcitem", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:srcitem",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((filename) => {
        resolve2(filename);
      });
    });
  }
  setValue(micDevice) {
    return new Promise((resolve2, reject2) => {
      let audioName;
      let _getName;
      if (micDevice instanceof MicrophoneDevice) {
        _getName = new Promise((innerResolve) => {
          const name = micDevice.getName();
          micDevice = micDevice.getDisplayId();
          innerResolve(name);
        });
      } else if (typeof micDevice === "string") {
        _getName = new Promise((innerResolve) => {
          System.getMicrophones().then((micDevices) => {
            const camGiven = micDevices.filter((cam) => {
              return cam.getDisplayId().toUpperCase() === micDevice.toUpperCase();
            });
            if (camGiven) {
              innerResolve(camGiven[0].getName());
            } else {
              innerResolve("");
            }
          });
        });
      } else {
        reject2(TypeError("Parameter should either be a MicrophoneDevice or string."));
      }
      _getName.then((name) => {
        audioName = name;
        if (this._isItemCall) {
          Logger.warn("sourceWarning", "setValue", true);
          return Item$1.set("prop:item", micDevice, this._id);
        } else {
          return Item$1.wrapSet(
            "prop:srcitem",
            micDevice,
            this._srcId,
            this._id,
            this._updateId.bind(this)
          );
        }
      }).then(() => {
        return Item$1.set("prop:name", audioName, this._id);
      }).then(() => {
        resolve2(this);
      });
    });
  }
}
class AudioSource extends Source {
}
applyMixins(AudioSource, [Audio, SourceAudio]);
class SourceConfigurable {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  loadConfig() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "loadConfig", true);
        this._checkPromise = Item$1.get("prop:BrowserConfiguration", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:BrowserConfiguration",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(
        (config) => {
          let configObj = config === "null" ? {} : JSON.parse(config);
          let persist = Global.getPersistentConfig();
          for (var key in persist) {
            delete configObj[key];
          }
          resolve2(configObj);
        }
      );
    });
  }
  saveConfig(configObj) {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "saveConfig", true);
    }
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin) {
        let slot;
        let savingAllowed = false;
        Item$1.attach(this._id).then((res) => {
          slot = res;
          return Item$1.get("prop:srcid");
        }).then((srcId) => {
          if (typeof srcId !== "string" || srcId === "") {
            savingAllowed = slot === 0;
          } else {
            savingAllowed = srcId === this._srcId;
          }
          if (savingAllowed) {
            if ({}.toString.call(configObj) === "[object Object]") {
              let persist = Global.getPersistentConfig();
              for (var key in persist) {
                configObj[key] = persist[key];
              }
              exec(
                "SetBrowserProperty",
                "Configuration",
                JSON.stringify(configObj)
              );
              resolve2(this);
            } else {
              reject2(Error("Configuration object should be in JSON format."));
            }
          } else {
            reject2(Error("Sources may only request other Sources to save a configuration. Consider calling requestSaveConfig() on this Source instance instead."));
          }
        });
      } else {
        reject2(Error(
          "Extensions and source properties windows are not allowed to directly save configuration objects. Call requestSaveConfig() instead."
        ));
      }
    });
  }
  requestSaveConfig(configObj) {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "requestSaveConfig", true);
    }
    return new Promise((resolve2) => {
      let slot;
      Item$1.attach(this._id).then((res) => {
        slot = res;
        exec(
          "CallInner" + (slot === 0 ? "" : slot + 1),
          "MessageSource",
          JSON.stringify({
            "request": "saveConfig",
            "data": configObj
          })
        );
        resolve2(this);
      });
    });
  }
  applyConfig(configObj) {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "applyConfig", true);
    }
    return new Promise((resolve2) => {
      let slot;
      Item$1.attach(this._id).then((res) => {
        slot = res;
        exec(
          "CallInner" + (slot === 0 ? "" : slot + 1),
          "MessageSource",
          JSON.stringify({
            "request": "applyConfig",
            "data": configObj
          })
        );
        resolve2(this);
      });
    });
  }
}
class SourceVideoPlaylist {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  getVideoNowPlaying() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getVideoNowPlaying", true);
        this._checkPromise = Item$1.get("prop:srcitem", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:srcitem",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((playlist) => {
        let _playlist = String(playlist).slice(0, playlist.indexOf("*"));
        resolve2(_playlist);
      });
    });
  }
  setVideoNowPlaying(value2) {
    let file;
    let _playlist;
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setVideoNowPlaying", true);
        this._checkPromise = Item$1.get("prop:FilePlaylist", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:FilePlaylist",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((playlist) => {
        _playlist = String(playlist).split("|");
        for (var i = 0; i < _playlist.length; i++) {
          _playlist[i] = _playlist[i].slice(0, _playlist[i].indexOf("*"));
        }
        return _playlist;
      }).then((list) => {
        if (typeof value2 === "string") {
          if (_playlist.indexOf(value2) === -1) {
            reject2(Error("File not found on Playlist."));
          } else {
            let index = _playlist.indexOf(value2);
            file = _playlist[index] + "*" + index;
            Item$1.set("prop:srcitem", file, this._id).then((fileplaylist) => {
              resolve2(this);
            });
          }
        } else if (typeof value2 === "number" && value2 <= _playlist.length) {
          file = _playlist[value2] + "*" + value2;
          Item$1.set("prop:srcitem", file, this._id).then(function(fileplaylist) {
            resolve2(this);
          });
        } else {
          reject2(Error("Invalid parameter. Value can only be either filename string or its index equivalent in the VideoPlaylist files array"));
        }
      });
    });
  }
  getVideoPlaylistSources() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getVideoPlaylistSources", true);
        this._checkPromise = Item$1.get("prop:FilePlaylist", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:FilePlaylist",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((playlist) => {
        let _playlist = String(playlist).split("|");
        for (var i = 0; i < _playlist.length; i++) {
          _playlist[i] = _playlist[i].slice(0, _playlist[i].indexOf("*"));
        }
        resolve2(_playlist);
      });
    });
  }
  setVideoPlaylistSources(fileItems) {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "setVideoPlaylistSources", true);
    }
    let fileString;
    let filePromises = fileItems.map((filename) => {
      return IO.getVideoDuration(filename);
    });
    return new Promise((resolve2, reject2) => {
      Promise.all(filePromises).then((duration) => {
        for (var i = 0; i < fileItems.length; i++) {
          if (fileString === void 0) {
            fileString = fileItems[i] + "*" + i + "*1*" + duration[i] + "*100*0*0*0*0*0|";
          } else {
            fileString += fileItems[i] + "*" + i + "*1*" + duration[i] + "*100*0*0*0*0*0";
            if (i + 1 < fileItems.length) {
              fileString += "|";
            }
          }
        }
        if (this._isItemCall) {
          Item$1.set("prop:srcitem", fileItems[0] + "*0", this._id);
        } else {
          Item$1.wrapSet(
            "prop:srcitem",
            fileItems[0] + "*0",
            this._srcId,
            this._id,
            this._updateId.bind(this)
          );
        }
        return fileString;
      }).then((fileString2) => {
        Item$1.set("prop:FilePlaylist", fileString2, this._id).then((fileplaylist) => {
          resolve2(this);
        });
      }).catch((err) => {
        reject2(err);
      });
    });
  }
  isSourceAvailable() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isSourceAvailable", true);
        Item$1.get("prop:itemavail", this._id).then((val) => {
          resolve2(val === "1");
        });
      } else {
        Item$1.wrapGet("prop:itemavail", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          resolve2(val === "1");
        });
      }
    });
  }
}
const _CuePoint = class _CuePoint {
  constructor(time, action) {
    this._time = time;
    this._action = action;
  }
  toString() {
    return String(this._time * 1e7) + this._action;
  }
  /**
   * param: number
   *
   * Sets this cue point's time in seconds, with precision up to 100ns.
   */
  setTime(time) {
    this._time = time;
  }
  /**
   *  param: string
   *
   *  Sets the action to be performed on the cue point. Choose any of the
   *  following values: CuePoint.PAUSE, CuePoint.RESUME, CuePoint.CUT.
   */
  setAction(action) {
    if (action === _CuePoint.PAUSE || action === _CuePoint.RESUME || action === _CuePoint.CUT) {
      this._action = action;
    } else {
      throw new Error("Trying to set to an invalid Cue Point action.");
    }
  }
  /**
   * return: number
   *
   * Gets the time in seconds corresponding to this cue point, with precision
   * up to 100ns.
   */
  getTime() {
    return this._time / 1e7;
  }
  /**
   *  return: string
   *
   *  Gets the action to be performed on the cue point, which may be any of the
   *  following: CuePoint.PAUSE, CuePoint.RESUME, CuePoint.CUT.
   */
  getAction() {
    return this._action;
  }
  static _fromString(value2) {
    const [time, action] = [
      value2.substring(0, value2.length - 1),
      value2.charAt(value2.length - 1)
    ];
    return new _CuePoint(Number(time), action);
  }
};
_CuePoint.PAUSE = "p";
_CuePoint.RESUME = "r";
_CuePoint.CUT = "s";
let CuePoint = _CuePoint;
var ActionAfterPlayback = /* @__PURE__ */ ((ActionAfterPlayback2) => {
  ActionAfterPlayback2[ActionAfterPlayback2["NONE"] = 0] = "NONE";
  ActionAfterPlayback2[ActionAfterPlayback2["REWIND"] = 1] = "REWIND";
  ActionAfterPlayback2[ActionAfterPlayback2["LOOP"] = 2] = "LOOP";
  ActionAfterPlayback2[ActionAfterPlayback2["TRANSPARENT"] = 3] = "TRANSPARENT";
  ActionAfterPlayback2[ActionAfterPlayback2["HIDE"] = 4] = "HIDE";
  return ActionAfterPlayback2;
})(ActionAfterPlayback || {});
const AUDIO_REGEX = /\.(mp3|aac|cda|ogg|m4a|flac|wma|aiff|aif|wav|mid|midi|rma)$/i;
const VIDEO_REGEX = /\.(avi|flv|mkv|mp4|mpg|wmv|3gp|3g2|asf|f4v|mov|mpeg|vob|webm)$/i;
class SourcePlayback {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  isSeekable() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isSeekable", true);
        this._checkPromise = Item$1.get("sync:syncable", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "sync:syncable",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1" ? true : false);
      });
    });
  }
  getPlaybackPosition() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getPlaybackPosition", true);
        this._checkPromise = Item$1.get("sync:position", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "sync:position",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(Number(val) / 1e7);
      });
    });
  }
  setPlaybackPosition(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setPlaybackPosition", true);
        this._checkPromise = Item$1.set("sync:position", String(value2 * 1e7), this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "sync:position",
          String(value2 * 1e7),
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  getPlaybackDuration() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getPlaybackDuration", true);
        this._checkPromise = Item$1.get("sync:duration", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "sync:duration",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(Number(val) / 1e7);
      });
    });
  }
  isPlaying() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isPlaying", true);
        this._checkPromise = Item$1.get("sync:state", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "sync:state",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "running");
      });
    });
  }
  setPlaying(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setPlaying", true);
        this._checkPromise = Item$1.set("sync:state", value2 ? "running" : "stopped", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "sync:state",
          value2 ? "running" : "stopped",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  getPlaybackStartPosition() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getPlaybackStartPosition", true);
        this._checkPromise = Item$1.get("prop:InPoint", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:InPoint",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(Number(val) / 1e7);
      });
    });
  }
  setPlaybackStartPosition(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setPlaybackStartPosition", true);
        this._checkPromise = Item$1.set("prop:InPoint", String(value2 * 1e7), this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:InPoint",
          String(value2 * 1e7),
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  getPlaybackEndPosition() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getPlaybackEndPosition", true);
        this._checkPromise = Item$1.get("prop:OutPoint", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:OutPoint",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(Number(val) / 1e7);
      });
    });
  }
  setPlaybackEndPosition(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setPlaybackEndPosition", true);
        this._checkPromise = Item$1.set("prop:OutPoint", String(value2 * 1e7), this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:OutPoint",
          String(value2 * 1e7),
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  getActionAfterPlayback() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getActionAfterPlayback", true);
        this._checkPromise = Item$1.get("prop:OpWhenFinished", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:OpWhenFinished",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setActionAfterPlayback(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setActionAfterPlayback", true);
        this._checkPromise = Item$1.set("prop:OpWhenFinished", String(value2), this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:OpWhenFinished",
          String(value2),
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isAutostartOnSceneLoad() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isAutostartOnSceneLoad", true);
        this._checkPromise = Item$1.get("prop:StartOnLoad", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:StartOnLoad",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setAutostartOnSceneLoad(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setAutostartOnSceneLoad", true);
        this._checkPromise = Item$1.set("prop:StartOnLoad", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:StartOnLoad",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isForceDeinterlace() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isForceDeinterlace", true);
        this._checkPromise = Item$1.get("prop:fdeinterlace", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:fdeinterlace",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "3");
      });
    });
  }
  setForceDeinterlace(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setForceDeinterlace", true);
        this._checkPromise = Item$1.set("prop:fdeinterlace", value2 ? "3" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:fdeinterlace",
          value2 ? "3" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isRememberingPlaybackPosition() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isRememberingPlaybackPosition", true);
        this._checkPromise = Item$1.get("prop:RememberPosition", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:RememberPosition",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setRememberingPlaybackPosition(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setRememberingPlaybackPosition", true);
        this._checkPromise = Item$1.set("prop:RememberPosition", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:RememberPosition",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isShowingPlaybackPosition() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isShowingPlaybackPosition", true);
        this._checkPromise = Item$1.get("prop:ShowPosition", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:ShowPosition",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setShowingPlaybackPosition(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setShowingPlaybackPosition", true);
        this._checkPromise = Item$1.set("prop:ShowPosition", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:ShowPosition",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  getCuePoints() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getCuePoints", true);
        this._checkPromise = Item$1.get("prop:CuePoints", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:CuePoints",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((cuePointString) => {
        if (cuePointString === "") {
          resolve2([]);
        } else {
          const cuePointStrings = cuePointString.split(",");
          const cuePoints = cuePointStrings.map(
            (string) => CuePoint._fromString(string)
          );
          resolve2(cuePoints);
        }
      });
    });
  }
  setCuePoints(cuePoints) {
    const cuePointString = cuePoints.map((point) => point.toString()).join(",");
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setCuePoints", true);
        this._checkPromise = Item$1.set("prop:CuePoints", cuePointString, this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:CuePoints",
          cuePointString,
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isAudio() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isAudio", true);
        this._checkPromise = Item$1.get("prop:srcitem", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:srcitem",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((filename) => {
        resolve2(AUDIO_REGEX.test(filename));
      });
    });
  }
  isVideo() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isVideo", true);
        this._checkPromise = Item$1.get("prop:srcitem", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:srcitem",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((filename) => {
        resolve2(VIDEO_REGEX.test(filename));
      });
    });
  }
  getValue() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getValue", true);
        this._checkPromise = Item$1.get("prop:srcitem", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:srcitem",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((filename) => {
        resolve2(filename);
      });
    });
  }
  setValue(filename) {
    return new Promise((resolve2, reject2) => {
      filename = filename.split("*")[0];
      if (VIDEO_REGEX.test(filename) || AUDIO_REGEX.test(filename)) {
        if (this._isItemCall) {
          Logger.warn("sourceWarning", "setValue", true);
          this._checkPromise = Item$1.set("prop:srcitem", filename, this._id);
        } else {
          this._checkPromise = Item$1.wrapSet(
            "prop:srcitem",
            filename,
            this._srcId,
            this._id,
            this._updateId.bind(this)
          );
        }
        this._checkPromise.then(() => {
          return Item$1.get("prop:FilePlaylist", this._id);
        }).then((playlist) => {
          if (playlist && playlist !== "PLAYLIST" && playlist.split("|").length < 2) {
            const playlistArray = playlist.split("*");
            playlistArray[0] = filename;
            return Item$1.set("prop:FilePlaylist", playlistArray.join("*"), this._id);
          } else {
            return Promise.resolve(true);
          }
        }).then(() => Item$1.set("prop:name", filename, this._id)).then(() => Item$1.set("prop:CuePoints", "", this._id)).then(() => {
          resolve2(this);
        });
      } else {
        reject2(Error("You can only set the value to a valid media type"));
      }
    });
  }
}
class VideoPlaylistSource extends Source {
}
applyMixins(VideoPlaylistSource, [SourceConfigurable, SourceVideoPlaylist, SourcePlayback, Audio]);
const LoadStatus = {
  loaded: "LOADED",
  not_loaded: "NOT LOADED",
  load_error: "LOAD ERROR",
  unknown: "UNKNOWN"
};
const toStableNumber = function(value2) {
  return Number(value2.toFixed(12));
};
class iSourceHtml {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  /**
   * param: (func: string, arg: string)
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Allow this item to call a pre-exposed function within the HTML Item
   */
  call(func, arg) {
    return new Promise((resolve2) => {
      let slot;
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "call", true);
        this._checkPromise = Item$1.attach(this._id);
      } else {
        this._checkPromise = Item$1.attach(this._id);
      }
      this._checkPromise.then((res) => {
        slot = res;
        exec(
          "CallInner" + (String(slot) === "0" ? "" : slot + 1),
          func,
          arg
        );
        resolve2(this);
      });
    });
  }
  /**
   * return: Promise<string>
   *
   * Gets the URL of this webpage item.
   */
  getURL() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getURL", true);
        this._checkPromise = Item$1.get("prop:srcitem", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:srcitem",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((url) => {
        let _url = String(url).split("*");
        url = _url[0];
        resolve2(url);
      });
    });
  }
  /**
   * param: (url: string)
   * ```
   * return: Promise<ISourceHtml>
   * ```
   *
   * Sets the URL of this webpage item.
   *
   * *Chainable.*
   */
  setURL(value2) {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setURL", true);
        this._checkPromise = Item$1.get("prop:srcitem", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:srcitem",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((url) => {
        const _url = String(url).split("*");
        _url[0] = value2;
        return Item$1.set(this._isItemCall ? "prop:item" : "prop:srcitem", _url.join("*"), this._id);
      }).then((code) => {
        if (code) {
          return Item$1.set("prop:name", value2, this._id);
        } else {
          return Promise.resolve(code);
        }
      }).then((code) => {
        if (code) {
          resolve2(this);
        } else {
          reject2(Error("Invalid value"));
        }
      });
    });
  }
  isBrowserTransparent() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isBrowserTransparent", true);
        this._checkPromise = Item$1.get("prop:BrowserTransparent", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:BrowserTransparent",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((isTransparent) => {
        resolve2(isTransparent === "1");
      });
    });
  }
  enableBrowserTransparency(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "enableBrowserTransparency", true);
        this._checkPromise = Item$1.set(
          "prop:BrowserTransparent",
          value2 ? "1" : "0",
          this._id
        );
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:BrowserTransparent",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isBrowser60FPS() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isBrowser60FPS", true);
        this._checkPromise = Item$1.get("prop:Browser60fps", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:Browser60fps",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((isBrowser60FPS) => {
        resolve2(isBrowser60FPS === "1");
      });
    });
  }
  enableBrowser60FPS(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isBrowser60FPS", true);
        this._checkPromise = Item$1.get("prop:Browser60fps", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:Browser60fps",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((isBrowser60FPS) => {
        if (isBrowser60FPS === "1" !== value2) {
          Item$1.set("prop:Browser60fps", value2 ? "1" : "0", this._id);
        }
        resolve2(this);
      });
    });
  }
  getBrowserCustomSize() {
    return new Promise((resolve2) => {
      let customSize;
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getBrowserCustomSize", true);
        this._checkPromise = Item$1.get("prop:BrowserSize", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:BrowserSize",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        if (val !== "") {
          var [width, height] = decodeURIComponent(val).split(",");
          customSize = Rectangle.fromDimensions(
            toStableNumber(Number(width) / window.devicePixelRatio),
            toStableNumber(Number(height) / window.devicePixelRatio)
          );
        } else {
          customSize = Rectangle.fromDimensions(0, 0);
        }
        resolve2(customSize);
      });
    });
  }
  setBrowserCustomSize(value2) {
    return new Promise((resolve2) => {
      const browserSize = Rectangle.fromDimensions(
        value2.getWidth() * window.devicePixelRatio,
        value2.getHeight() * window.devicePixelRatio
      );
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setBrowserCustomSize", true);
        this._checkPromise = Item$1.set("prop:BrowserSize", browserSize.toDimensionString(), this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:BrowserSize",
          browserSize.toDimensionString(),
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  getAllowRightClick() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getAllowRightClick", true);
        this._checkPromise = Item$1.get("prop:BrowserRightClick", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:BrowserRightClick",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setAllowRightClick(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setAllowRightClick", true);
        this._checkPromise = Item$1.set("prop:BrowserRightClick", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:BrowserRightClick",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  getBrowserJS() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getBrowserJS", true);
        this._checkPromise = Item$1.get("prop:custom", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:custom",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((custom) => {
        let customJS = "";
        try {
          let customObject2 = JSON.parse(custom);
          if (customObject2.hasOwnProperty("customJS")) {
            customJS = customObject2["customJS"];
          }
        } catch (e) {
        }
        resolve2(customJS);
      });
    });
  }
  setBrowserJS(value2, refresh = false) {
    return new Promise((resolve2, reject2) => {
      let customObject2 = {};
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setBrowserJS", true);
        this._checkPromise = Item$1.get("prop:custom", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:custom",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((custom) => {
        let customCSS = "";
        let scriptString = " ";
        let scriptEnabled = true;
        let cssEnabled = true;
        try {
          customObject2 = JSON.parse(custom);
          if (customObject2.hasOwnProperty("cssEnabled")) {
            cssEnabled = customObject2["cssEnabled"] == "true";
          }
          if (customObject2.hasOwnProperty("scriptEnabled")) {
            scriptEnabled = customObject2["scriptEnabled"] == "true";
          }
          if (customObject2.hasOwnProperty("customCSS")) {
            customCSS = customObject2["customCSS"];
          }
        } catch (e) {
        }
        customObject2["cssEnabled"] = cssEnabled.toString();
        customObject2["scriptEnabled"] = scriptEnabled.toString();
        customObject2["customCSS"] = customCSS;
        customObject2["customJS"] = value2;
        if (cssEnabled === true) {
          let cssScript2 = "var xjsCSSOverwrite = document.createElement('style');xjsCSSOverwrite.id = 'splitmedialabsCSSOverwrite';xjsCSSOverwrite.type = 'text/css';var h = document.querySelector('head');var existing = document.querySelector('head #splitmedialabsCSSOverwrite');if (existing != null)h.removeChild(existing);xjsCSSOverwrite.innerHTML = '" + customCSS.replace(/(\r\n|\n|\r)/gm, "").replace(/\s{2,}/g, " ").replace(/(\[br\])/gm, "") + "';h.appendChild(xjsCSSOverwrite);";
          scriptString = scriptString + cssScript2;
        }
        if (value2 !== "" && scriptEnabled === true) {
          scriptString = scriptString + value2;
        }
        return Item$1.set("prop:BrowserJs", scriptString, this._id);
      }).then(() => {
        return Item$1.set("prop:custom", JSON.stringify(customObject2), this._id);
      }).then(() => {
        if (refresh) {
          Item$1.set("refresh", "", this._id).then(() => {
            resolve2(this);
          });
        } else {
          resolve2(this);
        }
      });
    });
  }
  isBrowserJSEnabled() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isBrowserJSEnabled", true);
        this._checkPromise = Item$1.get("prop:custom", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:custom",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((custom) => {
        let enabled = true;
        try {
          let customObject2 = JSON.parse(custom);
          if (customObject2.hasOwnProperty("scriptEnabled")) {
            enabled = customObject2["scriptEnabled"] == "true";
          }
        } catch (e) {
        }
        resolve2(enabled);
      });
    });
  }
  enableBrowserJS(value2) {
    return new Promise((resolve2, reject2) => {
      let customObject2 = {};
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "enableBrowserJS", true);
        this._checkPromise = Item$1.get("prop:custom", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:custom",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((custom) => {
        let customJS = "";
        let customCSS = "";
        let scriptString = " ";
        let cssEnabled = true;
        try {
          customObject2 = JSON.parse(custom);
          if (customObject2.hasOwnProperty("cssEnabled")) {
            cssEnabled = customObject2["cssEnabled"] == "true";
          }
          if (customObject2.hasOwnProperty("customJS")) {
            customJS = customObject2["customJS"];
          }
          if (customObject2.hasOwnProperty("customCSS")) {
            customCSS = customObject2["customCSS"];
          }
        } catch (e) {
        }
        customObject2["cssEnabled"] = cssEnabled.toString();
        customObject2["scriptEnabled"] = value2.toString();
        customObject2["customJS"] = customJS;
        customObject2["customCSS"] = customCSS;
        if (cssEnabled === true) {
          let cssScript2 = 'var xjsCSSOverwrite = document.createElement("style");xjsCSSOverwrite.id = "splitmedialabsCSSOverwrite";xjsCSSOverwrite.type = "text/css";var h = document.querySelector("head");var existing = document.querySelector("head #splitmedialabsCSSOverwrite");if (existing != null)h.removeChild(existing);xjsCSSOverwrite.innerHTML = "' + customCSS.replace(/(\r\n|\n|\r)/gm, "").replace(/\s{2,}/g, " ").replace(/(\[br\])/gm, "") + '";"h.appendChild(xjsCSSOverwrite);';
          scriptString = scriptString + cssScript2;
        }
        if (customJS !== "" && value2 === true) {
          scriptString = scriptString + customJS;
        }
        return Item$1.set("prop:BrowserJs", scriptString, this._id);
      }).then(() => {
        return Item$1.set("prop:custom", JSON.stringify(customObject2), this._id);
      }).then(() => {
        if (!value2) {
          Item$1.set("refresh", "", this._id).then(() => {
            resolve2(this);
          });
        } else {
          resolve2(this);
        }
      });
    });
  }
  getCustomCSS() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getCustomCSS", true);
        this._checkPromise = Item$1.get("prop:custom", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:custom",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((custom) => {
        let customCSS = "";
        try {
          let customObject2 = JSON.parse(custom);
          if (customObject2.hasOwnProperty("customCSS")) {
            customCSS = customObject2["customCSS"];
          }
        } catch (e) {
        }
        resolve2(customCSS);
      });
    });
  }
  setCustomCSS(value2) {
    return new Promise((resolve2, reject2) => {
      let customObject2 = {};
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setCustomCSS", true);
        this._checkPromise = Item$1.get("prop:custom", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:custom",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((custom) => {
        let customJS = "";
        let scriptString = " ";
        let scriptEnabled = true;
        let cssEnabled = true;
        try {
          customObject2 = JSON.parse(custom);
          if (customObject2.hasOwnProperty("cssEnabled")) {
            cssEnabled = customObject2["cssEnabled"] == "true";
          }
          if (customObject2.hasOwnProperty("scriptEnabled")) {
            scriptEnabled = customObject2["scriptEnabled"] == "true";
          }
          if (customObject2.hasOwnProperty("customJS")) {
            customJS = customObject2["customJS"];
          }
        } catch (e) {
        }
        customObject2["cssEnabled"] = cssEnabled.toString();
        customObject2["scriptEnabled"] = scriptEnabled.toString();
        customObject2["customJS"] = customJS;
        customObject2["customCSS"] = value2;
        if (cssEnabled === true) {
          let cssScript2 = 'var xjsCSSOverwrite = document.createElement("style");xjsCSSOverwrite.id = "splitmedialabsCSSOverwrite";xjsCSSOverwrite.type = "text/css";var h = document.querySelector("head");var existing = document.querySelector("head #splitmedialabsCSSOverwrite");if (existing != null)h.removeChild(existing);xjsCSSOverwrite.innerHTML = "' + value2.replace(/(\r\n|\n|\r)/gm, "").replace(/\s{2,}/g, " ").replace(/(\[br\])/gm, "") + '";h.appendChild(xjsCSSOverwrite);';
          scriptString = scriptString + cssScript2;
        }
        if (customJS !== "" && scriptEnabled === true) {
          scriptString = scriptString + customJS;
        }
        return Item$1.set("prop:BrowserJs", scriptString, this._id);
      }).then(() => {
        return Item$1.set("prop:custom", JSON.stringify(customObject2), this._id);
      }).then(() => {
        resolve2(this);
      });
    });
  }
  isCustomCSSEnabled() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isCustomCSSEnabled", true);
        this._checkPromise = Item$1.get("prop:custom", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:custom",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((custom) => {
        let enabled = true;
        try {
          let customObject2 = JSON.parse(custom);
          if (customObject2.hasOwnProperty("cssEnabled")) {
            enabled = customObject2["cssEnabled"] == "true";
          }
        } catch (e) {
        }
        resolve2(enabled);
      });
    });
  }
  enableCustomCSS(value) {
    return new Promise((resolve, reject) => {
      let customObject = {};
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "enableCustomCSS", true);
        this._checkPromise = Item$1.get("prop:custom", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:custom",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((custom) => {
        let customJS = "";
        let customCSS = "";
        let scriptString = " ";
        let scriptEnabled = true;
        try {
          customObject = JSON.parse(custom);
          if (customObject.hasOwnProperty("scriptEnabled")) {
            scriptEnabled = customObject["scriptEnabled"] == "true";
          }
          if (customObject.hasOwnProperty("customJS")) {
            customJS = customObject["customJS"];
          }
          if (customObject.hasOwnProperty("customCSS")) {
            customCSS = customObject["customCSS"];
          }
        } catch (e) {
        }
        customObject["scriptEnabled"] = scriptEnabled.toString();
        customObject["cssEnabled"] = value.toString();
        customObject["customJS"] = customJS;
        customObject["customCSS"] = customCSS;
        if (value === true) {
          let cssScript2 = 'var xjsCSSOverwrite = document.createElement("style");xjsCSSOverwrite.id = "splitmedialabsCSSOverwrite";xjsCSSOverwrite.type = "text/css";var h = document.querySelector("head");var existing = document.querySelector("head #splitmedialabsCSSOverwrite");if (existing != null)h.removeChild(existing);xjsCSSOverwrite.innerHTML = "' + customCSS.replace(/(\r\n|\n|\r)/gm, "").replace(/\s{2,}/g, " ").replace(/(\[br\])/gm, "") + '";h.appendChild(xjsCSSOverwrite);';
          scriptString = scriptString + cssScript2;
        }
        if (customJS !== "" && value === scriptEnabled) {
          scriptString = scriptString + customJS;
        }
        return Item$1.set("prop:BrowserJs", scriptString, this._id);
      }).then(() => {
        return Item$1.set("prop:custom", JSON.stringify(customObject), this._id);
      }).then(() => {
        if (!value) {
          let cssScript = "var h = document.querySelector('head');var existing3 = document.querySelector('head #splitmedialabsCSSOverwrite');if (existing3 != null)h.removeChild(existing3);";
          if (Environment.isSourcePlugin()) {
            eval(cssScript);
          } else {
            exec("CallInner", "eval", cssScript);
          }
          resolve(this);
        } else {
          resolve(this);
        }
      });
    });
  }
  isBrowserOptimized() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isBrowserOptimized", true);
        this._checkPromise = Item$1.get("prop:GameCapSurfSharingCurrent", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:GameCapSurfSharingCurrent",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  getBrowserLoadStatus() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getBrowserLoadStatus", true);
        this._checkPromise = Item$1.get("BrowserLoadStatus", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "BrowserLoadStatus",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((loadStatus) => {
        if (loadStatus === "null") {
          resolve2("UNAVAILABLE");
        } else {
          resolve2(LoadStatus[loadStatus]);
        }
      });
    });
  }
  isReloadOnShowEnabled() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isReloadOnShowEnabled", true);
        this._checkPromise = Item$1.get("prop:RefreshOnSrcShow", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:RefreshOnSrcShow",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  enableReloadOnShow(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "enableReloadOnShow", true);
        this._checkPromise = Item$1.set("prop:RefreshOnSrcShow", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:RefreshOnSrcShow",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isReloadOnSceneEnterEnabled() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isReloadOnShowEnabled", true);
        this._checkPromise = Item$1.get("prop:RefreshOnScnLoad", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:RefreshOnScnLoad",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  enableReloadOnSceneEnter(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "enableReloadOnShow", true);
        this._checkPromise = Item$1.set("prop:RefreshOnScnLoad", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:RefreshOnScnLoad",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  isSourceAvailable() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isSourceAvailable", true);
        Item$1.get("prop:itemavail", this._id).then((val) => {
          resolve2(val === "1");
        });
      } else {
        Item$1.wrapGet("prop:itemavail", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          resolve2(val === "1");
        });
      }
    });
  }
}
class HtmlSource extends Source {
}
applyMixins(HtmlSource, [iSourceHtml, SourceConfigurable, Audio]);
class SourceFlash {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  getCustomResolution() {
    return new Promise((resolve2) => {
      let customSize;
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getCustomResolution", true);
        this._checkPromise = Item$1.get("prop:BrowserSize", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:BrowserSize",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        if (val !== "") {
          var [width, height] = decodeURIComponent(val).split(",");
          customSize = Rectangle.fromDimensions(Number(width), Number(height));
        } else {
          customSize = Rectangle.fromDimensions(0, 0);
        }
        resolve2(customSize);
      });
    });
  }
  setCustomResolution(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setCustomResolution", true);
        Item$1.set(
          "prop:BrowserSize",
          value2.toDimensionString(),
          this._id
        ).then(() => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet(
          "prop:BrowserSize",
          value2.toDimensionString(),
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getAllowRightClick() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getAllowRightClick", true);
        Item$1.get("prop:BrowserRightClick", this._id).then((val) => {
          resolve2(val === "1");
        });
      } else {
        Item$1.wrapGet("prop:BrowserRightClick", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          resolve2(val === "1");
        });
      }
    });
  }
  setAllowRightClick(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setAllowRightClick", true);
        Item$1.set("prop:BrowserRightClick", value2 ? "1" : "0", this._id).then(() => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet("prop:BrowserRightClick", value2 ? "1" : "0", this._srcId, this._id, this._updateId.bind(this)).then(() => {
          resolve2(this);
        });
      }
    });
  }
  isSourceAvailable() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isSourceAvailable", true);
        Item$1.get("prop:itemavail", this._id).then((val) => {
          resolve2(val === "1");
        });
      } else {
        Item$1.wrapGet("prop:itemavail", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          resolve2(val === "1");
        });
      }
    });
  }
  getValue() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getValue", true);
        this._checkPromise = Item$1.get("prop:srcitem", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:srcitem",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((filename) => {
        resolve2(filename);
      });
    });
  }
  setValue(filename) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setValue", true);
        this._checkPromise = Item$1.set("prop:item", filename, this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:srcitem",
          filename,
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        return Item$1.set("prop:name", filename, this._id);
      }).then(() => {
        resolve2(this);
      });
    });
  }
}
class FlashSource extends Source {
}
applyMixins(FlashSource, [Audio, SourceFlash]);
class iSourceScreen {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  isStickToTitle() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isStickToTitle", true);
        this._checkPromise = Item$1.get("prop:ScrCapTrackWindowTitle", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:ScrCapTrackWindowTitle",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "0");
      });
    });
  }
  setStickToTitle(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setStickToTitle", true);
        this._checkPromise = Item$1.set("prop:ScrCapTrackWindowTitle", value2 ? "0" : "1", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:ScrCapTrackWindowTitle",
          value2 ? "0" : "1",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
  getCaptureLayered() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getCaptureLayered", true);
        this._checkPromise = Item$1.get("prop:ScrCapLayered", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:ScrCapLayered",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setCaptureLayered(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setCaptureLayered", true);
        this._checkPromise = Item$1.set("prop:ScrCapLayered", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:ScrCapLayered",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(this);
      });
    });
  }
  getOptimizedCapture() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getOptimizedCapture", true);
        this._checkPromise = Item$1.get("prop:ScrCapOptCapture1", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:ScrCapOptCapture1",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setOptimizedCapture(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setOptimizedCapture", true);
        this._checkPromise = Item$1.set("prop:ScrCapOptCapture1", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:ScrCapOptCapture1",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(this);
      });
    });
  }
  getShowMouseClicks() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getShowMouseClicks", true);
        this._checkPromise = Item$1.get("prop:ScrCapShowClicks", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:ScrCapShowClicks",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setShowMouseClicks(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setShowMouseClicks", true);
        this._checkPromise = Item$1.set("prop:ScrCapShowClicks", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:ScrCapShowClicks",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(this);
      });
    });
  }
  getShowMouse() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getShowMouse", true);
        this._checkPromise = Item$1.get("prop:ScrCapShowMouse", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:ScrCapShowMouse",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setShowMouse(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setShowMouse", true);
        this._checkPromise = Item$1.set("prop:ScrCapShowMouse", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:ScrCapShowMouse",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        if (val === true) {
          Item$1.set("prop:ScrCapShowClicks", value2 ? "1" : "0", this._id);
        }
        resolve2(this);
      });
    });
  }
  getCaptureArea() {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "getCaptureArea", true);
    }
    return new Promise((resolve2) => {
      this.getValue().then((val) => {
        if (!(val instanceof XML)) {
          resolve2(Rectangle.fromCoordinates(0, 0, 0, 0));
        } else {
          let _value = JSON$1.parse(val);
          resolve2(Rectangle.fromCoordinates(
            Number(_value["left"]),
            Number(_value["top"]),
            Number(_value["width"]) + Number(_value["left"]),
            Number(_value["height"]) + Number(_value["top"])
          ));
        }
      });
    });
  }
  setCaptureArea(dimension) {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "setCaptureArea", true);
    }
    return new Promise((resolve2) => {
      this.getValue().then((val) => {
        return new Promise((iResolve) => {
          if (this._isItemCall) {
            this._checkPromise = Item$1.get("screenresolution", this._id);
          } else {
            this._checkPromise = Item$1.wrapGet(
              "screenresolution",
              this._srcId,
              this._id,
              this._updateId.bind(this)
            );
          }
          this._checkPromise.then((res) => {
            let _res = res.split(",");
            iResolve({
              value: val,
              res: Rectangle.fromCoordinates(
                Number(_res[0]),
                Number(_res[1]),
                Number(_res[2]),
                Number(_res[3])
              )
            });
          });
        });
      }).then((obj) => {
        let _config = new JSON$1();
        if (!(obj.value instanceof XML)) {
          _config["tag"] = "screen";
          _config["module"] = "";
          _config["window"] = "";
          _config["hwnd"] = "0";
          _config["wclient"] = "0";
          _config["left"] = "0";
          _config["top"] = "0";
          _config["width"] = "0";
          _config["height"] = "0";
        } else {
          _config = JSON$1.parse(obj.value);
        }
        _config["left"] = dimension.getLeft() >= obj.res.getLeft() ? dimension.getLeft() : Number(_config["left"]) >= obj.res.getLeft() ? _config["left"] : obj.res.getLeft();
        _config["top"] = dimension.getTop() >= obj.res.getTop() ? dimension.getTop() : Number(_config["top"]) >= obj.res.getTop() ? _config["top"] : obj.res.getTop();
        _config["width"] = dimension.getWidth() <= obj.res.getWidth() ? dimension.getWidth() : Number(_config["width"]) <= obj.res.getWidth() ? _config["width"] : obj.res.getWidth();
        _config["height"] = dimension.getHeight() <= obj.res.getHeight() ? dimension.getHeight() : Number(_config["height"]) <= obj.res.getHeight() ? _config["height"] : obj.res.getHeight();
        this.setValue(XML.parseJSON(_config)).then(() => {
          resolve2(this);
        });
      });
    });
  }
  isClientArea() {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "isClientArea", true);
    }
    return new Promise((resolve2) => {
      this.getValue().then((val) => {
        if (!(val instanceof XML)) {
          resolve2(false);
        } else {
          let _value = JSON$1.parse(val);
          resolve2(_value["wclient"] === "1");
        }
      });
    });
  }
  setClientArea(value2) {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "setClientArea", true);
    }
    return new Promise((resolve2) => {
      this.getValue().then((val) => {
        let _config = new JSON$1();
        if (!(val instanceof XML)) {
          _config["tag"] = "screen";
          _config["module"] = "";
          _config["window"] = "";
          _config["hwnd"] = "0";
          _config["wclient"] = "0";
          _config["left"] = "0";
          _config["top"] = "0";
          _config["width"] = "0";
          _config["height"] = "0";
        } else {
          _config = JSON$1.parse(val);
        }
        _config["wclient"] = value2 ? "1" : "0";
        this.setValue(XML.parseJSON(_config)).then(() => {
          resolve2(this);
        });
      });
    });
  }
}
class ScreenSource extends Source {
}
applyMixins(ScreenSource, [iSourceScreen]);
class SourceImage {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  isSourceAvailable() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isSourceAvailable", true);
        Item$1.get("prop:itemavail", this._id).then((val) => {
          resolve2(val === "1");
        });
      } else {
        Item$1.wrapGet("prop:itemavail", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          resolve2(val === "1");
        });
      }
    });
  }
  getValue() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getValue", true);
        this._checkPromise = Item$1.get("prop:srcitem", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:srcitem",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((filename) => {
        resolve2(filename);
      });
    });
  }
  setValue(filename) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setValue", true);
        this._checkPromise = Item$1.set("prop:item", filename, this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:srcitem",
          filename,
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        return Item$1.set("prop:name", filename, this._id);
      }).then(() => {
        resolve2(this);
      });
    });
  }
}
class ImageSource extends Source {
}
applyMixins(ImageSource, [SourceImage]);
const BUFFER_MAX = 120;
class SourceReplay {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  getChannel() {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getChannelName", true);
        this._checkPromise = Item$1.get("prop:presproperty:channelName", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:presproperty:channelName",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((channel) => {
        resolve2(channel);
      }).catch((err) => reject2(err));
    });
  }
  setChannel(channel) {
    return new Promise((resolve2, reject2) => {
      if (typeof channel === "string") {
        if (this._isItemCall) {
          Logger.warn("sourceWarning", "setChannelName", true);
          Item$1.set("prop:presproperty:channelName", channel, this._id).then((val) => {
            resolve2(this);
          });
        } else {
          Item$1.wrapSet(
            "prop:presproperty:channelName",
            channel,
            this._srcId,
            this._id,
            this._updateId.bind(this)
          ).then((val) => {
            resolve2(this);
          });
        }
      } else {
        reject2(Error("Invalid parameter. setChannelName method only accepts channel name as a string."));
      }
    });
  }
  getHotkey() {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getHotkey", true);
        this._checkPromise = Item$1.get("prop:presproperty:hotkey", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:presproperty:hotkey",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((hotkey) => {
        resolve2(Number(hotkey));
      }).catch((err) => reject2(err));
    });
  }
  setHotkey(hotkey) {
    return new Promise((resolve2, reject2) => {
      if (typeof hotkey === "number") {
        if (this._isItemCall) {
          Logger.warn("sourceWarning", "setHotkey", true);
          Item$1.set("prop:presproperty:hotkey", String(hotkey), this._id).then((val) => {
            resolve2(this);
          });
        } else {
          Item$1.wrapSet(
            "prop:presproperty:hotkey",
            String(hotkey),
            this._srcId,
            this._id,
            this._updateId.bind(this)
          ).then((val) => {
            resolve2(this);
          });
        }
      } else {
        reject2(Error("Invalid parameter. setHotkey method only accepts hotkey as a number."));
      }
    });
  }
  getReplayTime() {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getReplayTime", true);
        this._checkPromise = Item$1.get("prop:presproperty:buffer", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:presproperty:buffer",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((buffer) => {
        resolve2(Number(buffer));
      }).catch((err) => reject2(err));
    });
  }
  setReplayTime(buffer) {
    return new Promise((resolve2, reject2) => {
      if (typeof buffer === "number") {
        if (buffer > 120 || buffer < 0) {
          reject2(Error(`Invalid parameter. setReplaytime method only accepts numbers up to ${BUFFER_MAX}.`));
        } else if (this._isItemCall) {
          Logger.warn("sourceWarning", "setReplayTime", true);
          Item$1.set("prop:presproperty:buffer", String(buffer), this._id).then((val) => {
            resolve2(this);
          });
        } else {
          Item$1.wrapSet(
            "prop:presproperty:buffer",
            String(buffer),
            this._srcId,
            this._id,
            this._updateId.bind(this)
          ).then((val) => {
            resolve2(this);
          });
        }
      } else {
        reject2(Error("Invalid parameter. setReplaytime method only accepts buffer as a number."));
      }
    });
  }
  startReplay() {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "startReplay", true);
        Item$1.set("prop:ReplayActive", "1", this._id).then((val) => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet(
          "prop:ReplayActive",
          "1",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then((val) => {
          resolve2(this);
        });
      }
    });
  }
  stopReplay() {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "stopReplay", true);
        Item$1.set("prop:ReplayActive", "0", this._id).then((val) => {
          resolve2(this);
        });
      } else {
        Item$1.wrapSet(
          "prop:ReplayActive",
          "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        ).then((val) => {
          resolve2(this);
        });
      }
    });
  }
  getReplayState() {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getReplayState", true);
        this._checkPromise = Item$1.get("prop:ReplayActive", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:ReplayActive",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((activeState) => resolve2(Number(activeState))).catch((err) => reject2(err));
    });
  }
  isAutostartOnSceneLoad() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isAutostartOnSceneLoad", true);
        this._checkPromise = Item$1.get("prop:StartOnLoad", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:StartOnLoad",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setAutostartOnSceneLoad(value2) {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "setAutostartOnSceneLoad", true);
        this._checkPromise = Item$1.set("prop:StartOnLoad", value2 ? "1" : "0", this._id);
      } else {
        this._checkPromise = Item$1.wrapSet(
          "prop:StartOnLoad",
          value2 ? "1" : "0",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then(() => {
        resolve2(this);
      });
    });
  }
}
class ReplaySource extends Source {
}
applyMixins(ReplaySource, [Audio, SourceReplay]);
class SourceScene {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  _setScene(itemType, uid, name, resolve2, reject2) {
    if (this._isItemCall) {
      Logger.warn("sourceWarning", "setScene", true);
      this._checkPromise = Item$1.set("prop:srctype", `${itemType},${uid}`, this._id);
    } else {
      this._checkPromise = Item$1.wrapSet(
        "prop:srctype",
        `${itemType},${uid}`,
        this._srcId,
        this._id,
        this._updateId.bind(this)
      );
    }
    var code;
    this._checkPromise.then((result) => {
      code = result;
      return Item$1.set("prop:name", `Scene: ${name}`);
    }).then(() => {
      if (code) {
        resolve2(this);
      } else {
        reject2(Error("Invalid value"));
      }
    }).catch((err) => reject2(err));
  }
  getScene() {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getScene", true);
        this._checkPromise = Item$1.get("prop:srcitem", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "prop:srcitem",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((scene) => {
        if (scene === "0") {
          resolve2(Scene.liveScene());
        } else {
          return Scene.getBySceneUid(scene);
        }
      }).then((sceneObj) => resolve2(sceneObj)).catch((err) => reject2(err));
    });
  }
  setScene(scene) {
    return new Promise((resolve2, reject2) => {
      if (scene instanceof Scene || typeof scene === "number" && scene >= 0 && Number["isInteger"](Number(scene))) {
        var itemType = "11";
        if (scene instanceof Scene) {
          var sceneUID = scene["_uid"];
          var name = scene["_name"];
          itemType = sceneUID === "0" ? String(ItemTypes.VIEW) : String(ItemTypes.SCENE);
          this._setScene(itemType, sceneUID, name, resolve2, reject2);
        } else if (typeof scene === "number") {
          var name = "";
          var targetScene;
          Scene.getBySceneIndex(scene).then((sceneByID) => {
            targetScene = sceneByID;
            return targetScene.getName();
          }).then((sceneName) => {
            name = sceneName;
            return targetScene.getSceneUid();
          }).then((uid) => {
            this._setScene(itemType, uid, name, resolve2, reject2);
          }).catch((err) => reject2(err));
        }
      } else {
        if (typeof scene === "number" && (scene < 1 || !Number["isInteger"](Number(scene)))) {
          reject2(Error("Invalid parameters. Valid range is greater than 0."));
        } else {
          reject2(Error("Invalid parameters. Valid range is greater than 0 or a Scene object."));
        }
      }
    });
  }
}
class SceneSource extends Source {
}
applyMixins(SceneSource, [SourceScene]);
class SourceMedia {
  _updateId(id, sceneId) {
    this._id = id;
    this._sceneId = sceneId;
  }
  getFileInfo() {
    return new Promise((resolve2, reject2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "getFileInfo", true);
        this._checkPromise = Item$1.get("FileInfo", this._id);
      } else {
        this._checkPromise = Item$1.wrapGet(
          "FileInfo",
          this._srcId,
          this._id,
          this._updateId.bind(this)
        );
      }
      this._checkPromise.then((val) => {
        try {
          let fileInfoObj = {};
          let fileInfoJXON = JSON$1.parse(val);
          if (typeof fileInfoJXON["children"] !== "undefined" && fileInfoJXON["children"].length > 0) {
            let fileInfoChildren = fileInfoJXON["children"];
            for (var i = fileInfoChildren.length - 1; i >= 0; i--) {
              var child = fileInfoChildren[i];
              var childObj = {};
              var childObjKeys = Object.keys(child);
              for (var j = childObjKeys.length - 1; j >= 0; j--) {
                var key = childObjKeys[j];
                if (key !== "value" && key !== "tag") {
                  childObj[key] = child[key];
                }
              }
              var tag = child["tag"];
              fileInfoObj[tag] = childObj;
            }
            resolve2(fileInfoObj);
          } else {
            resolve2(fileInfoObj);
          }
        } catch (e) {
          reject2(Error("Error retrieving file information"));
        }
      });
    });
  }
  isSourceAvailable() {
    return new Promise((resolve2) => {
      if (this._isItemCall) {
        Logger.warn("sourceWarning", "isSourceAvailable", true);
        Item$1.get("prop:itemavail", this._id).then((val) => {
          resolve2(val === "1");
        });
      } else {
        Item$1.wrapGet("prop:itemavail", this._srcId, this._id, this._updateId.bind(this)).then((val) => {
          resolve2(val === "1");
        });
      }
    });
  }
}
const MediaTypes = [
  ".mp3",
  ".aac",
  ".cda",
  ".ogg",
  ".m4a",
  ".flac",
  ".wma",
  ".aiff",
  ".aif",
  ".wav",
  ".mid",
  ".midi",
  ".rma",
  ".avi",
  ".flv",
  ".mkv",
  ".mp4",
  ".mpg",
  ".wmv",
  ".3gp",
  ".3g2",
  ".asf",
  ".f4v",
  ".mov",
  ".mpeg",
  ".vob",
  ".webm"
];
class MediaSource extends Source {
}
applyMixins(MediaSource, [SourcePlayback, Audio, SourceMedia]);
function SourceTypeResolve(source) {
  let srcType;
  const type = Number(source["type"]);
  const sourceValue = source["item"];
  const uppercaseValue = sourceValue.toUpperCase();
  if (type === ItemTypes.GAMESOURCE) {
    srcType = new GameSource(source);
  } else if ((type === ItemTypes.HTML || type === ItemTypes.FILE) && source["name"].indexOf("Video Playlist") === 0 && source["FilePlaylist"] !== "") {
    srcType = new VideoPlaylistSource(source);
  } else if (type === ItemTypes.HTML) {
    srcType = new HtmlSource(source);
  } else if (type === ItemTypes.SCREEN) {
    srcType = new ScreenSource(source);
  } else if (type === ItemTypes.BITMAP || type === ItemTypes.FILE && /\.gif$/i.test(sourceValue)) {
    srcType = new ImageSource(source);
  } else if (type === ItemTypes.FILE && /\.(gif|xbs)$/i.test(sourceValue) === false && /^(rtsp|rtmp):\/\//i.test(sourceValue) === false && (VIDEO_REGEX.test(sourceValue.split("*")[0]) || AUDIO_REGEX.test(sourceValue.split("*")[0]))) {
    srcType = new MediaSource(source);
  } else if (type === ItemTypes.LIVE && uppercaseValue.indexOf(
    "{33D9A762-90C8-11D0-BD43-00A0C911CE86}"
  ) === -1) {
    srcType = new CameraSource(source);
  } else if (type === ItemTypes.LIVE && uppercaseValue.indexOf(
    "{33D9A762-90C8-11D0-BD43-00A0C911CE86}"
  ) !== -1) {
    srcType = new AudioSource(source);
  } else if (type === ItemTypes.FLASHFILE) {
    srcType = new FlashSource(source);
  } else if (type === ItemTypes.REPLAY) {
    srcType = new ReplaySource(source);
  } else if (type === ItemTypes.SCENE || type === ItemTypes.VIEW) {
    srcType = new SceneSource(source);
  } else {
    srcType = new Source(source);
  }
  return srcType;
}
var ViewTypes = /* @__PURE__ */ ((ViewTypes2) => {
  ViewTypes2[ViewTypes2["MAIN"] = 0] = "MAIN";
  ViewTypes2[ViewTypes2["PREVIEW"] = 1] = "PREVIEW";
  ViewTypes2[ViewTypes2["THUMBNAIL"] = 2] = "THUMBNAIL";
  return ViewTypes2;
})(ViewTypes || {});
const _Item = class _Item extends Source {
  constructor(props) {
    super(props);
    this._isItemCall = true;
  }
  /**
   * param: (event: string,  handler: Function)
   *
   * Allows listening to events per instance.
   * Currently there are only two:
   * `item-changed` and `item-destroyed`.
   *
   * Item change is triggered thru any property change:
   * - via js(source plugin/extension),
   * - via visibility-toggling through the sources list,
   * - or via the source properties dialog
   *
   *  #### Usage:
   *
   * ```javascript
   * let itemChange = function(...args) {
   *   console.log('Item has changed');
   * }
   *
   * let current;
   * let items;
   * xjs.Scene.getActiveScene()
   * .then( scene => {
   *   current = scene;
   *   return current.getItems();
   * }).then( list => {
   *   items = list;
   *   items[0].on('item-changed', itemChange);
   * });
   * ```
   *
   * Duplicate handlers are allowed.
   */
  on(event, handler) {
    _Item._emitter.on(event + "_" + this._id, handler);
    let isItemSubscribeEventsSupported = versionCompare(getVersion()).is.greaterThanOrEqualTo(itemSubscribeEventVersion);
    if (event === "item-changed" && isItemSubscribeEventsSupported && !Environment.isSourceProps() && _Item._subscriptions.indexOf("itempropchange_" + this._id) < 0) {
      _Item._subscriptions.push("itempropchange_" + this._id);
      EventManager.subscribe("itempropchange_" + this._id, (...eventArgs) => {
        _Item._emitter.emit("item-changed_" + this._id, ...eventArgs);
      });
    } else if (event === "item-destroyed" && isItemSubscribeEventsSupported && !Environment.isSourceProps() && _Item._subscriptions.indexOf("itemdestroyed_" + this._id) < 0) {
      _Item._subscriptions.push("itemdestroyed_" + this._id);
      EventManager.subscribe("itemdestroyed_" + this._id, (...eventArgs) => {
        _Item._emitter.emit("item-destroyed_" + this._id, ...eventArgs);
      });
    }
  }
  /**
   * param: (event: string,  handler: Function)
   *
   * Removes specificied event handler bound by `on`.
   * Note that this can only be done for named function handlers.
   *
   *  #### Usage:
   *
   * ```javascript
   * let itemChange = function(...args) {
   *   console.log('Item has changed');
   * }
   *
   * let current;
   * let items;
   * xjs.Scene.getActiveScene()
   * .then( scene => {
   *   current = scene;
   *   return current.getItems();
   * }).then( list => {
   *   items = list;
   *   items[0].on('item-changed', itemChange);
   *   setTimeout( ()=> {
   *     items[0].off('item-changed', itemChange);
   *   }, 10000);
   * });
   * ```
   */
  off(event, handler) {
    _Item._emitter.off(event + "_" + this._id, handler);
  }
  /**
   * return: Promise<Item[]>
   *
   * Gets the list of linked items of the current Item.
   * Linked items are items linked to a single source.
   *
   * #### Usage
   *
   * ```javascript
   * xjs.Item.getItemList().then(function(items) {
   *   for (var i = 0 ; i < items.length ; i++) {
   *     // Manipulate each item here
   *     items[i].setKeepAspectRatio(true);
   *   }
   * })
   * ```
   *
   * This is simply a shortcut to:
   * `xjs.Item.getCurrentSource()` -> `source.getItemList()`
   */
  static getItemList() {
    return new Promise((resolve2) => {
      resolve2(Source.getItemList());
    });
  }
  /**
   * return: Promise<Number>
   *
   * Get the frames rendered per second of an item
   *
   * #### Usage
   *
   * ```javascript
   * item.getFPS().then(function(fps) {
   *   // The rest of your code here
   * });
   * ```
   */
  getFPS() {
    return new Promise((resolve2) => {
      let initial;
      Item$1.get("stats:frames", this._id).then((frames) => {
        initial = frames === "null" || frames === "" ? 0 : Number(frames);
        return new Promise((innerResolve) => {
          setTimeout(innerResolve, 1e3);
        });
      }).then(() => {
        return Item$1.get("stats:frames", this._id);
      }).then((frames) => {
        let final = frames === "null" || frames === "" ? 0 : Number(frames);
        resolve2(final - initial);
      });
    });
  }
  /**
   * return: Promise<ViewTypes>
   *
   * Get the view type of the item
   *
   * #### Usage
   *
   * ```javascript
   * item.getView().then(function(view) {
   *   // view values:
   *   // 0 = main view
   *   // 1 = preview editor
   *   // 2 = thumbnail preview
   * })
   * ```
   */
  getView() {
    return new Promise((resolve2) => {
      Item$1.get("prop:viewid", this._id).then((viewId) => {
        let view = 0;
        if (viewId === "1") {
          let preview;
          App$1.getGlobalProperty("preview_editor_opened").then((result) => {
            preview = result;
            view = preview === "1" ? 1 : 2;
            resolve2(view);
          });
        } else {
          resolve2(view);
        }
      });
    });
  }
  /**
   * return: Promise<number>
   *
   * Get (1-indexed) Scene ID where the source is loaded
   *
   * #### Usage
   *
   * ```javascript
   * source.getSceneId().then(function(id) {
   *   // The rest of your code here
   * });
   * ```
   */
  getSceneId() {
    return new Promise((resolve2) => {
      if (String(this._sceneId) === "i12") {
        resolve2("i12");
      } else {
        resolve2(Number(this._sceneId) + 1);
      }
    });
  }
  /**
   * return: XML
   *
   * Convert the Item object to an XML object. Use `toString()` to
   * get the string version of the returned object.
   *
   * #### Usage
   *
   * ```javascript
   * var xml = item.toXML();
   * ```
   */
  toXML() {
    var item = new JSON$1();
    for (let prop in this._xmlparams) {
      if (!{}.hasOwnProperty.call(this._xmlparams, prop)) continue;
      item[prop] = this._xmlparams[prop];
    }
    item["tag"] = "item";
    item["selfclosing"] = true;
    return XML.parseJSON(item);
  }
  /**
   * param: (options: {linked?:<boolean>, scene?:<Scene> })
   * ```
   * return: Promise<Item>
   * ```
   * Duplicate an item into the current scene or to a specified scene as
   * Linked or Unlinked.
   *
   * Linked items would generally have a single source, and any changes in the
   * property of an item would be applied to all linked items.
   *
   *  *Chainable*
   *
   * #### Usage
   * ```javascript
   * // item pertains to an actual Item instance
   * // Sample 1
   * item.duplicate() // duplicate selected item to the current scene as unlinked
   *```
   * Duplicate the selected item to a specific scene and set it to be linked to
   * a single source with the original item.
   * ```javascript
   * // Sample 2
   * var toScene = xjs.Scene.getById(2)
   * item.duplicate({linked:true, scene:toScene})
   *
   * ```
   */
  duplicate(options) {
    return new Promise((resolve2, reject2) => {
      let cmd = "additem";
      const getItem = (res) => {
        return new Promise((innerResolve, innerReject) => {
          if (!Global.isListenToItemAdd()) {
            innerResolve(this);
          } else {
            Scene.searchItemsById(res).then((item) => {
              innerResolve(item);
            }).catch((err) => {
              innerReject(err);
            });
          }
        });
      };
      checkSplitmode(options ? options.scene : void 0).then((scenePrefix) => {
        if (versionCompare(getVersion()).is.lessThan(globalsrcMinVersion)) {
          return addToSceneHandler(scenePrefix + cmd, this.toXML().toString());
        } else {
          if (options) {
            if (options.linked) {
              Item$1.set("prop:keeploaded", "1", this._id);
            }
            if (options.scene !== void 0 && options.linked !== void 0) {
              cmd = `link:${options.linked ? 1 : 0}|${scenePrefix}additem`;
            } else if (options.linked === void 0) {
              cmd = `link:0|${scenePrefix}additem`;
            } else if (options.scene === void 0) {
              cmd = `link:${options.linked ? 1 : 0}|s:${this._sceneId}|additem`;
            }
          } else {
            cmd = "link:0|additem";
          }
          return addToSceneHandler(cmd, this.toXML().toString());
        }
      }).then((result) => {
        return getItem(result);
      }).then((result) => {
        resolve2(result);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
  /**
   * return: Promise<Item>
   *
   * Unlinks selected item.
   *
   * Unlinks an item to the source of other linked items and renders its
   * own source.
   *
   * #### Usage
   * ```javascript
   * item.unlink()
   * ```
   *
   * Note: Once you unlink an Item, there's still no method to reverse the
   * process.
   *
   */
  unlink() {
    return new Promise((resolve2) => {
      Item$1.set("prop:globalsrc", "0", this._id).then(() => {
        resolve2(this);
      });
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Removes selected item
   *
   * #### Usage
   * ```javascript
   * item.remove()
   * ```
   */
  remove() {
    return new Promise((resolve2) => {
      Item$1.set("remove", "", this._id).then(() => {
        resolve2(true);
      });
    });
  }
  /**
   * return: Promise<Source>
   *
   * Gets the Source of an item, linked items would only have 1 source.
   *
   * *Chainable*
   *
   * #### Usage
   * ```javascript
   * item.getSource().then(function(source) {
   *   //Manipulate source here
   *   source.setName('New Name')
   * })
   * ```
   */
  getSource() {
    return new Promise((resolve2, reject2) => {
      Item$1.get("config", this._id).then((config) => {
        let item = JSON$1.parse(config);
        let srcType = SourceTypeResolve(item);
        resolve2(srcType);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Checks if item is part of a group
   *
   * #### Usage
   * ```javascript
   * item.isChildItem()
   * .then(function(isChild) {
   *   console.log(isChild);
   * });
   * ```
   */
  isChildItem() {
    return new Promise((resolve2) => {
      Scene.searchScenesByItemId(this._id).then((scene) => {
        return scene.getSceneIndex();
      }).then((sceneIndex) => {
        return App$1.get(`scenefindgroup:${sceneIndex}:${this._id}`);
      }).then((groupID) => {
        resolve2(groupID !== "" && groupID !== null);
      });
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Get the GroupItem that contains this item.
   * This rejects if item is not a child item or non-existent
   *
   * #### Usage
   * ```javascript
   * item.getParentItem()
   * .then(function(parentItem) {
   *   console.log(parentItem);
   * });
   * ```
   */
  getParentItem() {
    return new Promise((resolve2, reject2) => {
      Scene.searchScenesByItemId(this._id).then((scene) => {
        return scene.getSceneIndex();
      }).then((sceneIndex) => {
        return App$1.get(`scenefindgroup:${sceneIndex}:${this._id}`);
      }).then((groupID) => {
        if (groupID.trim() === "" || groupID === null) {
          reject2("Item is not a child item or non-existent");
        } else {
          return Scene.searchItemsById(groupID);
        }
      }).then((groupItem) => {
        resolve2(groupItem);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
};
_Item._emitter = new EventEmitter();
_Item._subscriptions = [];
let Item = _Item;
applyMixins(Item, [iSource, ItemLayout]);
class ItemColor {
  getTransparency() {
    return new Promise((resolve2) => {
      Item$1.get("prop:alpha", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setTransparency(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < 0 || value2 > 255) {
        reject2(RangeError("Transparency may only be in the range 0-255."));
      } else {
        Item$1.set("prop:alpha", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getBrightness() {
    return new Promise((resolve2) => {
      Item$1.get("prop:cc_brightness", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setBrightness(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < -100 || value2 > 100) {
        reject2(RangeError("Brightness may only be in the range -100 to 100."));
      } else {
        Item$1.set("prop:cc_brightness", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getContrast() {
    return new Promise((resolve2) => {
      Item$1.get("prop:cc_contrast", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setContrast(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < -100 || value2 > 100) {
        reject2(RangeError("Contrast may only be in the range -100 to 100."));
      } else {
        Item$1.set("prop:cc_contrast", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getHue() {
    return new Promise((resolve2) => {
      Item$1.get("prop:cc_hue", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setHue(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < -180 || value2 > 180) {
        reject2(RangeError("Contrast may only be in the range -180 to 180."));
      } else {
        Item$1.set("prop:cc_hue", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getSaturation() {
    return new Promise((resolve2) => {
      Item$1.get("prop:cc_saturation", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setSaturation(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < -100 || value2 > 100) {
        reject2(RangeError("Saturation may only be in the range -100 to 100"));
      } else {
        Item$1.set("prop:cc_saturation", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getBorderColor() {
    return new Promise((resolve2) => {
      Item$1.get("prop:border", this._id).then((val) => {
        var color;
        if (val === "0") {
          color = Color.fromTransparent();
        } else {
          var bgr = Number(val) - 2147483648;
          color = Color.fromBGRInt(bgr);
        }
        resolve2(color);
      });
    });
  }
  setBorderColor(value2) {
    return new Promise((resolve2, reject2) => {
      if (!(value2 instanceof Color)) {
        reject2(TypeError("Use a Color object as the parameter."));
      } else {
        var colorString;
        if (value2.isTransparent()) {
          colorString = "0";
        } else {
          colorString = String(value2.getIbgr() - 2147483648);
        }
        Item$1.set("prop:border", colorString, this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  isFullDynamicColorRange() {
    return new Promise((resolve2) => {
      Item$1.get("prop:cc_dynamicrange", this._id).then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setFullDynamicColorRange(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "boolean") {
        reject2(TypeError("Parameter should be boolean."));
      } else {
        Item$1.set(
          "prop:cc_dynamicrange",
          value2 ? "1" : "0",
          this._id
        ).then(() => {
          resolve2(this);
        });
      }
    });
  }
}
var KeyingType = /* @__PURE__ */ ((KeyingType2) => {
  KeyingType2[KeyingType2["LEGACY"] = 0] = "LEGACY";
  KeyingType2[KeyingType2["COLORKEY"] = 1] = "COLORKEY";
  KeyingType2[KeyingType2["RGBKEY"] = 2] = "RGBKEY";
  return KeyingType2;
})(KeyingType || {});
var ChromaPrimaryColors = /* @__PURE__ */ ((ChromaPrimaryColors2) => {
  ChromaPrimaryColors2[ChromaPrimaryColors2["RED"] = 0] = "RED";
  ChromaPrimaryColors2[ChromaPrimaryColors2["GREEN"] = 1] = "GREEN";
  ChromaPrimaryColors2[ChromaPrimaryColors2["BLUE"] = 2] = "BLUE";
  return ChromaPrimaryColors2;
})(ChromaPrimaryColors || {});
var ChromaAntiAliasLevel = /* @__PURE__ */ ((ChromaAntiAliasLevel2) => {
  ChromaAntiAliasLevel2[ChromaAntiAliasLevel2["NONE"] = 0] = "NONE";
  ChromaAntiAliasLevel2[ChromaAntiAliasLevel2["LOW"] = 1] = "LOW";
  ChromaAntiAliasLevel2[ChromaAntiAliasLevel2["HIGH"] = 2] = "HIGH";
  return ChromaAntiAliasLevel2;
})(ChromaAntiAliasLevel || {});
class ItemChroma {
  isChromaEnabled() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_chromakey", this._id).then((val) => {
        resolve2(val === "1");
      });
    });
  }
  setChromaEnabled(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "boolean") {
        reject2(TypeError("Parameter should be boolean."));
      } else {
        Item$1.set(
          "prop:key_chromakey",
          value2 ? "1" : "0",
          this._id
        ).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getKeyingType() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_chromakeytype", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setKeyingType(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a KeyingType value as the parameter."));
      } else if (value2 < 0 || value2 > 2) {
        reject2(RangeError("Use a KeyingType value as the parameter."));
      } else {
        Item$1.set(
          "prop:key_chromakeytype",
          String(value2),
          this._id
        ).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getChromaAntiAliasLevel() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_antialiasing", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setChromaAntiAliasLevel(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a ChromaAntiAliasLevel value as the parameter."));
      } else if (value2 < 0 || value2 > 2) {
        reject2(RangeError("Use a ChromaAntiAliasLevel value as the parameter."));
      } else {
        Item$1.set("prop:key_antialiasing", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  // CHROMA LEGACY MODE FUNCTIONS
  getChromaLegacyBrightness() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_chromabr", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setChromaLegacyBrightness(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < 0 || value2 > 255) {
        reject2(RangeError("Valid value is an integer from 0-255."));
      } else {
        Item$1.set("prop:key_chromabr", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getChromaLegacySaturation() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_chromasat", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setChromaLegacySaturation(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < 0 || value2 > 255) {
        reject2(RangeError("Valid value is an integer from 0-255."));
      } else {
        Item$1.set("prop:key_chromasat", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getChromaLegacyHue() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_chromahue", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setChromaLegacyHue(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < 0 || value2 > 180) {
        reject2(RangeError("Valid value is an integer from 0-180."));
      } else {
        Item$1.set("prop:key_chromahue", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getChromaLegacyThreshold() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_chromarang", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setChromaLegacyThreshold(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < 0 || value2 > 255) {
        reject2(RangeError("Valid value is an integer from 0-255."));
      } else {
        Item$1.set("prop:key_chromarang", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getChromaLegacyAlphaSmoothing() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_chromaranga", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setChromaLegacyAlphaSmoothing(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < 0 || value2 > 255) {
        reject2(RangeError("Valid value is an integer from 0-255."));
      } else {
        Item$1.set("prop:key_chromaranga", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  // CHROMA RGB KEY FUNCTIONS
  getChromaRGBKeyPrimaryColor() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_chromargbkeyprimary", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setChromaRGBKeyPrimaryColor(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a ChromaPrimaryColors value as the parameter."));
      } else if (value2 < 0 || value2 > 2) {
        reject2(RangeError("Use a ChromaPrimaryColors value as the parameter."));
      } else {
        Item$1.set("prop:key_chromargbkeyprimary", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getChromaRGBKeyThreshold() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_chromargbkeythresh", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setChromaRGBKeyThreshold(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < 0 || value2 > 255) {
        reject2(RangeError("Valid value is an integer from 0-255."));
      } else {
        Item$1.set("prop:key_chromargbkeythresh", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getChromaRGBKeyExposure() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_chromargbkeybalance", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setChromaRGBKeyExposure(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < 0 || value2 > 255) {
        reject2(RangeError("Valid value is an integer from 0-255."));
      } else {
        Item$1.set("prop:key_chromargbkeybalance", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  // CHROMA COLOR KEY FUNCTIONS
  getChromaColorKeyThreshold() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_colorrang", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setChromaColorKeyThreshold(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < 0 || value2 > 255) {
        reject2(RangeError("Valid value is an integer from 0-255."));
      } else {
        Item$1.set("prop:key_colorrang", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getChromaColorKeyExposure() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_colorranga", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setChromaColorKeyExposure(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < 0 || value2 > 255) {
        reject2(RangeError("Valid value is an integer from 0-255."));
      } else {
        Item$1.set("prop:key_colorranga", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getChromaColorKeyColor() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_colorrgb", this._id).then((val) => {
        let color = Color.fromBGRString(val);
        resolve2(color);
      });
    });
  }
  setChromaColorKeyColor(value2) {
    return new Promise((resolve2, reject2) => {
      if (!(value2 instanceof Color)) {
        reject2(TypeError("Use a Color object as the parameter."));
      } else {
        Item$1.set(
          "prop:key_colorrgb",
          String(value2.getIbgr()),
          this._id
        ).then(() => {
          resolve2(this);
        });
      }
    });
  }
}
const _Filter = class _Filter {
  constructor(key) {
    var value2 = _Filter._filterMap[key];
    if (typeof value2 !== "undefined") {
      this._key = key;
      this._value = value2;
    } else {
      this._key = key;
      this._value = key.toLowerCase();
    }
  }
  /**
   * Converts this transition object to the underlying string representation to be read by XSplit Broadcaster.
   */
  toString() {
    return this._value;
  }
  /**
   * Converts this transition object to a easily identifiable string such as 'NONE'.
   */
  toFilterKey() {
    return this._key;
  }
  /**
   * return: Promise<Filter[]>
   *
   * Get all available filters for use in videoitems
   *
   * ** MINIMUM XBC REQUIREMENT **
   * requires XBC v.3.9.1912.1002 and above
   *
   * #### Usage
   *
   * ```javascript
   * Filter.getFilters()
   * .then(function(filters) {
   *   for (var i = 0; i < filters.length; i++) {
   *     console.log(filters[i].toString(); // Returns the value of the filter
   *   }
   * })
   * ```
   */
  static getFilters() {
    return new Promise((resolve2) => {
      var filters = Object.keys(_Filter._filterMap).map((key) => new _Filter(key));
      resolve2(filters);
    });
  }
};
_Filter._filterMap = {
  NONE: "none",
  COOL: "cool",
  WARM: "warm",
  BLOOM: "bloom",
  MONOCHROME: "monochrome",
  INVERTCOLOR: "invertcolor",
  OLDMOVIE: "oldmovie",
  SKETCHPENCILSTROKE: "sketchpencilstroke",
  MAGNIFYSMOOTH: "magnifysmooth",
  BLUR: "blur",
  LUT: "lut"
};
_Filter.NONE = new _Filter("NONE");
_Filter.COOL = new _Filter("COOL");
_Filter.WARM = new _Filter("WARM");
_Filter.BLOOM = new _Filter("BLOOM");
_Filter.MONOCHROME = new _Filter("MONOCHROME");
_Filter.INVERTCOLOR = new _Filter("INVERTCOLOR");
_Filter.OLDMOVIE = new _Filter("OLDMOVIE");
_Filter.SKETCHPENCILSTROKE = new _Filter("SKETCHPENCILSTROKE");
_Filter.MAGNIFYSMOOTH = new _Filter("MAGNIFYSMOOTH");
_Filter.BLUR = new _Filter("BLUR");
_Filter.LUT = new _Filter("LUT");
let Filter = _Filter;
var MaskEffect = /* @__PURE__ */ ((MaskEffect2) => {
  MaskEffect2[MaskEffect2["NONE"] = 0] = "NONE";
  MaskEffect2[MaskEffect2["SHAPE"] = 1] = "SHAPE";
  MaskEffect2[MaskEffect2["FILE_BIND_TO_SOURCE"] = 2] = "FILE_BIND_TO_SOURCE";
  MaskEffect2[MaskEffect2["FILE_BIND_TO_STAGE"] = 3] = "FILE_BIND_TO_STAGE";
  return MaskEffect2;
})(MaskEffect || {});
const _DEFAULT_EFFECT_VALUES = {
  "MASK_EFFECT": 0,
  "BORDER_RADIUS": 0,
  "BORDER_THICKNESS": 0,
  "BORDER_OPACITY": 100,
  "BORDER_COLOR": Color.fromRGBString("#FFFFFF"),
  "SHADOW_COLOR": Color.fromRGBString("#FFFFFF"),
  "SHADOW_THICKNESS": 0,
  "SHADOW_BLUR": 0,
  "SHADOW_OPACITY": 100,
  "SHADOW_OFFSET_X": 0,
  "SHADOW_OFFSET_Y": 0
};
const _DEFAULT_EDGE_EFFECT_CONFIG = "0,1.00,1.00,1.00,1|1,0,0,0,1|2,0,0,0,0|3,1.00,1.00,1.00,1";
class ItemEffect {
  _convertToHex(value2) {
    var hex = parseInt(String(Number(value2) * 255)).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  }
  _getEdgeEffectValue(value2) {
    return new Promise((resolve2, reject2) => {
      Item$1.get("prop:edgeeffectcfg", this._id).then((val) => {
        if (val !== "" && val !== null) {
          var edgeConfig = val.split("|");
          var arrayIndex = value2["arrayIndex"];
          var individualIndex = value2["indIndex"];
          if (typeof edgeConfig[arrayIndex] !== "undefined") {
            var cfgArray = edgeConfig[arrayIndex].split(",");
            if (Array.isArray(individualIndex)) {
              var newArray = [];
              for (var i = 0; i < individualIndex.length; ++i) {
                var config = individualIndex[i];
                newArray.push(cfgArray[config]);
              }
              resolve2(newArray);
            } else {
              resolve2(cfgArray[individualIndex]);
            }
          } else {
            reject2(RangeError("Invalid parameter. Array index given not included."));
          }
        } else {
          reject2(ReferenceError("Edge effect configuration not set."));
        }
      });
    });
  }
  _setEdgeEffectValue(value2) {
    return new Promise((resolve2, reject2) => {
      Item$1.get("prop:edgeeffectcfg", this._id).then((val) => {
        var edgeConfig = [];
        var edgeEffectString;
        if (val !== "" && val !== null) {
          edgeEffectString = val;
        } else {
          edgeEffectString = _DEFAULT_EDGE_EFFECT_CONFIG;
        }
        var edgeArray = edgeEffectString.split("|");
        var edgeArrayLength = edgeArray.length;
        for (var i = 0; i < edgeArrayLength; ++i) {
          edgeConfig.push(edgeArray[i].split(","));
        }
        var arrayIndex = value2["arrayIndex"];
        var individualIndex = value2["indIndex"];
        var setValue = value2["value"];
        if (typeof edgeConfig[arrayIndex] !== "undefined") {
          var oldArray = edgeConfig[arrayIndex];
          if (Array.isArray(individualIndex)) {
            for (var j = 0; j < individualIndex.length; ++j) {
              var tempIndex = individualIndex[j];
              oldArray[tempIndex] = setValue[j];
            }
          } else {
            oldArray[individualIndex] = setValue;
          }
          edgeConfig[arrayIndex] = oldArray;
          var edgeEffectStringValue = "";
          for (var k = 0; k < edgeConfig.length; ++k) {
            edgeEffectStringValue = edgeEffectStringValue + edgeConfig[k].toString();
            if (k !== edgeConfig.length - 1) {
              edgeEffectStringValue = edgeEffectStringValue + "|";
            }
          }
          Item$1.set("prop:edgeeffectcfg", edgeEffectStringValue, this._id).then(() => {
            resolve2(this);
          });
        } else {
          reject2(RangeError("Invalid parameter. Array index given not included."));
        }
      });
    });
  }
  _getRGBArray(value2) {
    var hex = value2.getRgb();
    var r = parseInt(hex.substring(0, 2), 16) / 255;
    var g = parseInt(hex.substring(2, 4), 16) / 255;
    var b = parseInt(hex.substring(4), 16) / 255;
    return [r, g, b];
  }
  getMaskEffect() {
    return new Promise((resolve2) => {
      Item$1.get("prop:edgeeffectid", this._id).then((val) => {
        if (val === "border") {
          resolve2(
            1
            /* SHAPE */
          );
        } else {
          Item$1.get("prop:edgeeffectmaskmode", this._id).then((val2) => {
            if (val2 === "1" || val2 === "3") {
              resolve2(
                2
                /* FILE_BIND_TO_SOURCE */
              );
            } else if (val2 === "2" || val2 === "4") {
              resolve2(
                3
                /* FILE_BIND_TO_STAGE */
              );
            } else {
              resolve2(_DEFAULT_EFFECT_VALUES["MASK_EFFECT"]);
            }
          });
        }
      });
    });
  }
  setMaskEffect(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a MaskEffect value as the parameter."));
      } else if (value2 < 0 || value2 > 3) {
        reject2(RangeError("Use a MaskEffect value as the parameter."));
      } else {
        if (value2 === 1) {
          Item$1.set("prop:edgeeffectmaskmode", "0", this._id).then(() => {
            return Item$1.set("prop:edgeeffectid", "border", this._id);
          }).then(() => {
            resolve2(this);
          });
        } else {
          Item$1.set("prop:edgeeffectid", "", this._id).then(() => {
            if (value2 === 2 || value2 === 3) {
              value2 = value2 - 1;
            } else {
              value2 = 0;
            }
            return Item$1.set("prop:edgeeffectmaskmode", String(value2), this._id);
          }).then(() => {
            resolve2(this);
          });
        }
      }
    });
  }
  getBorderEffectRadius() {
    return new Promise((resolve2) => {
      var parameterObject = {};
      parameterObject["arrayIndex"] = 1;
      parameterObject["indIndex"] = 1;
      this._getEdgeEffectValue(parameterObject).then((val) => {
        resolve2(Number(val) * 100);
      }).catch((err) => {
        resolve2(_DEFAULT_EFFECT_VALUES["BORDER_RADIUS"]);
      });
    });
  }
  setBorderEffectRadius(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a number as the parameter."));
      } else if (value2 < 0 || value2 > 100) {
        reject2(RangeError("Valid value is a number from 0 - 100."));
      } else {
        var parameterObject = {};
        parameterObject["arrayIndex"] = 1;
        parameterObject["indIndex"] = 1;
        parameterObject["value"] = value2 / 100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getBorderEffectThickness() {
    return new Promise((resolve2) => {
      var parameterObject = {};
      parameterObject["arrayIndex"] = 1;
      parameterObject["indIndex"] = 2;
      this._getEdgeEffectValue(parameterObject).then((val) => {
        resolve2(Number(val) * 100);
      }).catch((err) => {
        resolve2(_DEFAULT_EFFECT_VALUES["BORDER_THICKNESS"]);
      });
    });
  }
  setBorderEffectThickness(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a number as the parameter."));
      } else if (value2 < 0 || value2 > 100) {
        reject2(RangeError("Valid value is a number from 0 - 100."));
      } else {
        var parameterObject = {};
        parameterObject["arrayIndex"] = 1;
        parameterObject["indIndex"] = 2;
        parameterObject["value"] = value2 / 100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getBorderEffectOpacity() {
    return new Promise((resolve2) => {
      var parameterObject = {};
      parameterObject["arrayIndex"] = 0;
      parameterObject["indIndex"] = 4;
      this._getEdgeEffectValue(parameterObject).then((val) => {
        resolve2(Number(val) * 100);
      }).catch((err) => {
        resolve2(_DEFAULT_EFFECT_VALUES["BORDER_OPACITY"]);
      });
    });
  }
  setBorderEffectOpacity(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a number as the parameter."));
      } else if (value2 < 0 || value2 > 100) {
        reject2(RangeError("Valid value is a number from 0 - 100."));
      } else {
        var parameterObject = {};
        parameterObject["arrayIndex"] = 0;
        parameterObject["indIndex"] = 4;
        parameterObject["value"] = value2 / 100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getBorderEffectColor() {
    return new Promise((resolve2) => {
      var parameterObject = {};
      parameterObject["arrayIndex"] = 0;
      parameterObject["indIndex"] = [1, 2, 3];
      this._getEdgeEffectValue(parameterObject).then((val) => {
        resolve2(Color.fromRGBString(
          "#" + this._convertToHex(val[0]) + this._convertToHex(val[1]) + this._convertToHex(val[2])
        ));
      }).catch((err) => {
        resolve2(_DEFAULT_EFFECT_VALUES["BORDER_COLOR"]);
      });
    });
  }
  setBorderEffectColor(value2) {
    return new Promise((resolve2, reject2) => {
      if (!(value2 instanceof Color)) {
        reject2(TypeError("Use a Color object as the parameter."));
      } else {
        var parameterObject = {};
        parameterObject["arrayIndex"] = 0;
        parameterObject["indIndex"] = [1, 2, 3];
        parameterObject["value"] = this._getRGBArray(value2);
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getShadowEffectColor() {
    return new Promise((resolve2) => {
      var parameterObject = {};
      parameterObject["arrayIndex"] = 3;
      parameterObject["indIndex"] = [1, 2, 3];
      this._getEdgeEffectValue(parameterObject).then((val) => {
        resolve2(Color.fromRGBString("#" + this._convertToHex(val[0]) + this._convertToHex(val[1]) + this._convertToHex(val[2])));
      }).catch((err) => {
        resolve2(_DEFAULT_EFFECT_VALUES["SHADOW_COLOR"]);
      });
    });
  }
  setShadowEffectColor(value2) {
    return new Promise((resolve2, reject2) => {
      var parameterObject = {};
      parameterObject["arrayIndex"] = 3;
      parameterObject["indIndex"] = [1, 2, 3];
      parameterObject["value"] = this._getRGBArray(value2);
      this._setEdgeEffectValue(parameterObject).then(() => {
        resolve2(this);
      });
    });
  }
  getShadowEffectThickness() {
    return new Promise((resolve2) => {
      var parameterObject = {};
      parameterObject["arrayIndex"] = 1;
      parameterObject["indIndex"] = 3;
      this._getEdgeEffectValue(parameterObject).then((val) => {
        resolve2(Number(val) * 100);
      }).catch((err) => {
        resolve2(_DEFAULT_EFFECT_VALUES["SHADOW_THICKNESS"]);
      });
    });
  }
  setShadowEffectThickness(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a number as the parameter."));
      } else if (value2 < 0 || value2 > 100) {
        reject2(RangeError("Valid value is a number from 0 - 100."));
      } else {
        var parameterObject = {};
        parameterObject["arrayIndex"] = 1;
        parameterObject["indIndex"] = 3;
        parameterObject["value"] = value2 / 100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getShadowEffectBlur() {
    return new Promise((resolve2) => {
      var parameterObject = {};
      parameterObject["arrayIndex"] = 2;
      parameterObject["indIndex"] = 3;
      this._getEdgeEffectValue(parameterObject).then((val) => {
        resolve2(Number(val) * 100);
      }).catch((err) => {
        resolve2(_DEFAULT_EFFECT_VALUES["SHADOW_BLUR"]);
      });
    });
  }
  setShadowEffectBlur(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a number as the parameter."));
      } else if (value2 < 0 || value2 > 100) {
        reject2(RangeError("Valid value is a number from 0 - 100."));
      } else {
        var parameterObject = {};
        parameterObject["arrayIndex"] = 2;
        parameterObject["indIndex"] = 3;
        parameterObject["value"] = value2 / 100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getShadowEffectOpacity() {
    return new Promise((resolve2) => {
      var parameterObject = {};
      parameterObject["arrayIndex"] = 3;
      parameterObject["indIndex"] = 4;
      this._getEdgeEffectValue(parameterObject).then((val) => {
        resolve2(Number(val) * 100);
      }).catch((err) => {
        resolve2(_DEFAULT_EFFECT_VALUES["SHADOW_OPACITY"]);
      });
    });
  }
  setShadowEffectOpacity(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a number as the parameter."));
      } else if (value2 < 0 || value2 > 100) {
        reject2(RangeError("Valid value is a number from 0 - 100."));
      } else {
        var parameterObject = {};
        parameterObject["arrayIndex"] = 3;
        parameterObject["indIndex"] = 4;
        parameterObject["value"] = value2 / 100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getShadowEffectOffsetX() {
    return new Promise((resolve2) => {
      var parameterObject = {};
      parameterObject["arrayIndex"] = 2;
      parameterObject["indIndex"] = 1;
      this._getEdgeEffectValue(parameterObject).then((val) => {
        resolve2(Number(val) * 100);
      }).catch((err) => {
        resolve2(_DEFAULT_EFFECT_VALUES["SHADOW_OFFSET_X"]);
      });
    });
  }
  setShadowEffectOffsetX(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a number as the parameter."));
      } else if (value2 < -100 || value2 > 100) {
        reject2(RangeError("Valid value is a number from -100 to 100."));
      } else {
        var parameterObject = {};
        parameterObject["arrayIndex"] = 2;
        parameterObject["indIndex"] = 1;
        parameterObject["value"] = value2 / 100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getShadowEffectOffsetY() {
    return new Promise((resolve2) => {
      var parameterObject = {};
      parameterObject["arrayIndex"] = 2;
      parameterObject["indIndex"] = 2;
      this._getEdgeEffectValue(parameterObject).then((val) => {
        resolve2(Number(val) * 100);
      }).catch((err) => {
        resolve2(_DEFAULT_EFFECT_VALUES["SHADOW_OFFSET_Y"]);
      });
    });
  }
  setShadowEffectOffsetY(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use a number as the parameter."));
      } else if (value2 < -100 || value2 > 100) {
        reject2(RangeError("Valid value is a number from -100 to 100."));
      } else {
        var parameterObject = {};
        parameterObject["arrayIndex"] = 2;
        parameterObject["indIndex"] = 2;
        parameterObject["value"] = value2 / 100;
        this._setEdgeEffectValue(parameterObject).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getFileMask() {
    return new Promise((resolve2) => {
      Item$1.get("prop:edgeeffectmask", this._id).then((val) => {
        resolve2(val);
      });
    });
  }
  setFileMask(value2) {
    return new Promise((resolve2) => {
      Item$1.set("prop:edgeeffectmask", value2, this._id).then(() => {
        resolve2(this);
      });
    });
  }
  isFileMaskingGuideVisible() {
    return new Promise((resolve2, reject2) => {
      Item$1.get("prop:edgeeffectmaskmode", this._id).then((val) => {
        if (val === "4" || val === "3") {
          resolve2(true);
        } else if (val === "2" || val === "1") {
          resolve2(false);
        } else {
          reject2(Error("This method is not available if filemasking is not enabled."));
        }
      });
    });
  }
  showFileMaskingGuide(value2) {
    return new Promise((resolve2, reject2) => {
      Item$1.get("prop:edgeeffectmaskmode", this._id).then((val) => {
        if (val === "1" || val === "3") {
          Item$1.set("prop:edgeeffectmaskmode", value2 ? "3" : "1", this._id).then(() => {
            resolve2(this);
          });
        } else if (val === "2" || val === "4") {
          Item$1.set("prop:edgeeffectmaskmode", value2 ? "4" : "2", this._id).then(() => {
            resolve2(this);
          });
        } else {
          reject2(Error("This method is not available if filemasking is not enabled."));
        }
      });
    });
  }
  getFilter() {
    return new Promise((resolve2) => {
      Item$1.get("prop:effects", this._id).then((val) => {
        try {
          var effectsJXON = JSON$1.parse(val);
          resolve2(new Filter(effectsJXON["children"][0]["id"]));
        } catch (e) {
          resolve2(Filter.NONE);
        }
      });
    });
  }
  setFilter(value2, config) {
    return new Promise((resolve2, reject2) => {
      config = config ? config : {};
      const intensity = config["intensity"] ? config["intensity"] / 100 : 1;
      const intensityConfig = `0,${intensity},0,0,0`;
      const filterValue = value2 instanceof Filter ? value2.toString() : value2;
      if (!filterValue || Object.keys(Filter._filterMap).indexOf(filterValue.toUpperCase()) < 0) {
        reject2(Error("Filter non-existent"));
      } else {
        var configString = "";
        var effectString = "";
        if (filterValue === "cool") {
          configString = `${intensityConfig}|1,0.0,0.0,0.0,0.0|2,0.53,0.95,0.95,1.0|3,0.0,0.0,0.1,1.0`;
        } else if (filterValue === "warm") {
          configString = `${intensityConfig}|1,0.0,0.0,0.0,0.0|2,1,0.91,0.77,1.0|3,0.1,0.05,0,1.0`;
        } else if (filterValue !== "none") {
          configString = intensityConfig;
        }
        if (filterValue === "lut") {
          const resourceFile = config["resourceFile"] ? config["resourceFile"] : "";
          const resourceString = `<resource file="${resourceFile}" />`;
          effectString = `<effect id="${filterValue}" cfg="${configString}">${resourceString}</effect>`;
        } else {
          effectString = `<effect id="${filterValue}" cfg="${configString}" />`;
        }
        const effect = `<effects>${effectString}</effects>`;
        Item$1.set("prop:effects", effect, this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  removeFilter() {
    return new Promise((resolve2, reject2) => {
      Item$1.set("prop:effects", "<effects/>", this._id).then(() => {
        resolve2(this);
      });
    });
  }
  getFilterConfig() {
    return new Promise((resolve2, reject2) => {
      Item$1.get("prop:effects", this._id).then((val) => {
        const configObj = {};
        try {
          var effectsJXON = JSON$1.parse(val);
          if (effectsJXON["children"][0]["cfg"]) {
            const cfgArray = effectsJXON["children"][0]["cfg"].split(",");
            configObj["intensity"] = Number(cfgArray[1]) * 100;
          }
          if (effectsJXON["children"][0]["children"] && effectsJXON["children"][0]["children"][0]["file"]) {
            configObj["resourceFile"] = effectsJXON["children"][0]["children"][0]["file"];
          }
        } catch (e) {
        }
        resolve2(configObj);
      });
    });
  }
}
const _Transition = class _Transition {
  constructor(key, setValue = null) {
    var value2 = _Transition._transitionMap[key];
    if (typeof value2 !== "undefined") {
      this._key = key;
      this._value = value2;
    } else if (key.substring(0, 8) === "stinger:") {
      if (typeof setValue !== "undefined" && setValue !== null) {
        this._key = setValue;
      } else {
        var fileName = key.split(",")[0].split("\\").pop().split("/").pop();
        var m = fileName.lastIndexOf(".webm");
        if (m >= 0 && m + fileName.length >= fileName.length) {
          fileName = fileName.substring(0, m);
        }
        var n = fileName.lastIndexOf("_");
        if (n >= 0 && n + fileName.length >= fileName.length) {
          fileName = fileName.substring(0, n) + ": " + fileName.substring(n + 1) + "ms";
        }
        this._key = fileName;
      }
      this._value = key;
    } else if (typeof setValue !== null) {
      this._key = setValue;
      this._value = key;
    } else {
      this._key = key;
      this._value = key.toLowerCase();
    }
  }
  /**
   * Converts this transition object to the underlying string representation to be read by XSplit Broadcaster.
   */
  toString() {
    return this._value;
  }
  /**
   * Converts this transition object to a easily identifiable string such as 'NONE'.
   */
  toTransitionKey() {
    return this._key;
  }
  /**
   * return: Promise<Transition[]>
   *
   * Get all available transitions for use in scene change
   *
   * ** MINIMUM XBC REQUIREMENT **
   * requires XBC v.2.7.1602.0502 and above
   *
   * #### Usage
   *
   * ```javascript
   * Transtition.getSceneTransitions().then(function(transitions) {
   *   for (var i = 0; i < transitions.length; i++) {
   *     transitions.toString(); // Returns the value of the transition
   *     transitions.toTransitionKey(); // Returns the key of the transition
   *   }
   * })
   * ```
   */
  static getSceneTransitions() {
    return new Promise((resolve2) => {
      var transitions = [];
      let transitionString;
      App$1.getGlobalProperty("transitions").then((result) => {
        transitionString = result;
        try {
          if (transitionString !== "") {
            var transitionArray = JSON.parse(transitionString);
            for (var i = transitionArray.length - 1; i >= 0; i--) {
              var transitionObject = transitionArray[i];
              if (transitionObject.hasOwnProperty("Id") && transitionObject.hasOwnProperty("Name")) {
                transitions.push(new _Transition(transitionObject["Id"], transitionObject["Name"]));
              }
            }
            resolve2(transitions);
          } else {
            resolve2(transitions);
          }
        } catch (e) {
          throw new Error("Error retrieving available transitions");
        }
      });
    });
  }
};
_Transition._transitionMap = {
  NONE: "",
  CLOCK: "clock",
  COLLAPSE: "collapse",
  FADE: "fade",
  FAN: "fan",
  HOLE: "hole",
  MOVE_BOTTOM: "move_bottom",
  MOVE_LEFT: "move_left",
  MOVE_LEFT_RIGHT: "move_left_right",
  MOVE_RIGHT: "move_right",
  MOVE_TOP: "move_top",
  MOVE_TOP_BOTTOM: "move_top_bottom",
  WAVE: "wave"
};
_Transition.NONE = new _Transition("NONE");
_Transition.CLOCK = new _Transition("CLOCK");
_Transition.COLLAPSE = new _Transition("COLLAPSE");
_Transition.FADE = new _Transition("FADE");
_Transition.FAN = new _Transition("FAN");
_Transition.HOLE = new _Transition("HOLE");
_Transition.MOVE_BOTTOM = new _Transition("MOVE_BOTTOM");
_Transition.MOVE_LEFT = new _Transition("MOVE_LEFT");
_Transition.MOVE_LEFT_RIGHT = new _Transition("MOVE_LEFT_RIGHT");
_Transition.MOVE_RIGHT = new _Transition("MOVE_RIGHT");
_Transition.MOVE_TOP = new _Transition("MOVE_TOP");
_Transition.MOVE_TOP_BOTTOM = new _Transition("MOVE_TOP_BOTTOM");
_Transition.WAVE = new _Transition("WAVE");
let Transition = _Transition;
class ItemTransition {
  isVisible() {
    return new Promise((resolve2) => {
      Item$1.get("prop:visible", this._id).then((val) => {
        resolve2(val === "1" ? true : false);
      });
    });
  }
  setVisible(value2) {
    return new Promise((resolve2) => {
      Item$1.set("prop:visible", value2 ? "1" : "0", this._id).then(() => {
        resolve2(this);
      });
    });
  }
  getTransition() {
    return new Promise((resolve2) => {
      Item$1.get("prop:transitionid", this._id).then((val) => {
        if (val === "") {
          resolve2(Transition.NONE);
        } else {
          resolve2(Transition[val.toUpperCase()]);
        }
      });
    });
  }
  setTransition(value2) {
    return new Promise((resolve2, reject2) => {
      if (!(value2 instanceof Transition)) {
        reject2(TypeError("Parameter should be a Transition object."));
      } else {
        Item$1.set("prop:transitionid", value2.toString(), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
  getTransitionTime() {
    return new Promise((resolve2) => {
      Item$1.get("prop:transitiontime", this._id).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  setTransitionTime(value2) {
    return new Promise((resolve2, reject2) => {
      if (typeof value2 !== "number") {
        reject2(TypeError("Use an integer as the parameter."));
      } else if (value2 < 0 || value2 > 6e4) {
        reject2(RangeError("Transparency may only be in the range 0 to 60000."));
      } else {
        Item$1.set("prop:transitiontime", String(value2), this._id).then(() => {
          resolve2(this);
        });
      }
    });
  }
}
class GameItem extends Item {
}
applyMixins(GameItem, [
  Item,
  ItemLayout,
  ItemColor,
  ItemChroma,
  ItemTransition,
  ItemEffect,
  iSourceGame
]);
class CameraItem extends Item {
  // special color options pinning
  /**
   * param: (value: boolean)
   *
   * Set this to true to share color settings across all instances of this
   * camera device on the stage.
   *
   * *Chainable.*
   */
  setColorOptionsPinned(value2) {
    return new Promise((resolve2) => {
      Item$1.set("prop:cc_pin", value2 ? "1" : "0", this._id).then(() => {
        resolve2(this);
      });
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Checks whether color settings are shared across all instances of
   * this camera device on the stage.
   */
  getColorOptionsPinned() {
    return new Promise((resolve2) => {
      Item$1.get("prop:cc_pin", this._id).then((val) => {
        resolve2(val === "1" ? true : false);
      });
    });
  }
  // special chroma options pinning
  /**
   * param: (value: boolean)
   *
   * Set this to true to share chroma keying settings across all instances of
   * this camera device on the stage.
   *
   * *Chainable.*
   */
  setKeyingOptionsPinned(value2) {
    return new Promise((resolve2) => {
      Item$1.set("prop:key_pin", value2 ? "1" : "0", this._id).then(() => {
        resolve2(this);
      });
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Checks whether chroma keying settings are shared across all instances of
   * this camera device on the stage.
   */
  getKeyingOptionsPinned() {
    return new Promise((resolve2) => {
      Item$1.get("prop:key_pin", this._id).then((val) => {
        resolve2(val === "1" ? true : false);
      });
    });
  }
}
applyMixins(CameraItem, [
  Item,
  ItemLayout,
  ItemColor,
  ItemChroma,
  ItemTransition,
  Audio,
  ItemEffect,
  SourceCamera
]);
class AudioItem extends Item {
}
applyMixins(AudioItem, [Audio, SourceAudio]);
class VideoPlaylistItem extends Item {
}
applyMixins(VideoPlaylistItem, [
  ItemLayout,
  ItemColor,
  ItemChroma,
  ItemTransition,
  SourceConfigurable,
  SourceVideoPlaylist,
  SourcePlayback,
  Audio
]);
class HtmlItem extends Item {
}
applyMixins(HtmlItem, [
  iSourceHtml,
  ItemLayout,
  ItemColor,
  ItemChroma,
  ItemTransition,
  SourceConfigurable,
  Audio,
  ItemEffect
]);
class FlashItem extends Item {
}
applyMixins(FlashItem, [
  ItemLayout,
  ItemColor,
  ItemChroma,
  ItemTransition,
  Audio,
  ItemEffect,
  SourceFlash
]);
class ScreenItem extends Item {
}
applyMixins(ScreenItem, [
  ItemLayout,
  ItemColor,
  ItemChroma,
  ItemTransition,
  ItemEffect,
  iSourceScreen
]);
class ImageItem extends Item {
}
applyMixins(ImageItem, [Item, ItemLayout, ItemColor, ItemChroma, ItemTransition, ItemEffect, SourceImage]);
class MediaItem extends Item {
}
applyMixins(MediaItem, [
  Item,
  ItemLayout,
  ItemColor,
  ItemChroma,
  ItemTransition,
  SourcePlayback,
  Audio,
  ItemEffect,
  SourceMedia
]);
class SceneItem extends Item {
}
applyMixins(SceneItem, [
  ItemLayout,
  ItemColor,
  ItemChroma,
  ItemTransition,
  Audio,
  ItemEffect,
  SourceScene
]);
class GenericItem extends Item {
}
applyMixins(GenericItem, [
  ItemLayout,
  ItemColor,
  ItemChroma,
  ItemTransition,
  ItemEffect
]);
const findItem = (presetArray, id) => {
  let itemViaID = void 0;
  presetArray.find((item) => {
    const children = item.children || [];
    const result = children.find((child) => child["id"] === id);
    if (result) {
      itemViaID = result;
    }
    return result !== void 0;
  });
  return itemViaID;
};
const getID = (item) => {
  if (item instanceof Item) {
    return item._id;
  } else {
    return item;
  }
};
const toItemString = (items) => {
  if (!Array.isArray(items)) {
    return getID(items);
  }
  const itemStringArray = items.map((item) => {
    return getID(item);
  });
  return itemStringArray.join(",");
};
class ItemGroup {
  getItems() {
    return new Promise((resolve2, reject2) => {
      App$1.getAsList("sceneconfig").then((jsonArray) => {
        const groupItem = findItem(jsonArray, this._id);
        const children = groupItem && groupItem.children[0].children ? groupItem.children[0].children : [];
        const childItems = children.map((item) => ItemTypeResolve(item));
        resolve2(childItems);
      }).catch((err) => {
        reject2(Error("Group item non-existent"));
      });
    });
  }
  addItems(items) {
    return new Promise((resolve2, reject2) => {
      const itemArrayString = toItemString(items);
      Item$1.get("prop:scene", this._id).then((sceneIndex) => {
        if (sceneIndex === "") {
          reject2(Error("Item is not a group item or non-existent"));
        }
        return App$1.get(`scenecanaddtogroup:${sceneIndex}:${this._id},${itemArrayString}`);
      }).then((canAdd) => {
        if (canAdd === "1") {
          return App$1.callFunc("addtogroup", `${this._id},${itemArrayString}`);
        } else {
          reject2(Error("One or more items provided cannot be added to the group"));
        }
      }).then((result) => {
        resolve2(this);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
  removeItems(items) {
    return new Promise((resolve2, reject2) => {
      const itemArrayString = toItemString(items);
      Item$1.get("prop:scene", this._id).then((sceneIndex) => {
        if (sceneIndex === "") {
          reject2(Error("Item is not a group item or non-existent"));
        }
        return App$1.get(`scenecanremovefromgroup:${sceneIndex}:${this._id},${itemArrayString}`);
      }).then((canRemove) => {
        if (canRemove === "1" || canRemove === "2") {
          return App$1.callFunc("removefromgroup", `${this._id},${itemArrayString}`);
        } else {
          reject2(Error("One or more items provided cannot be removed from the group"));
        }
      }).then((result) => {
        resolve2(this);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
  unGroup() {
    return new Promise((resolve2) => {
      App$1.callFunc("removefromgroupall", this._id).then((val) => {
        resolve2(this);
      });
    });
  }
}
class GroupItem extends Item {
}
applyMixins(GroupItem, [
  ItemLayout,
  ItemColor,
  ItemChroma,
  ItemTransition,
  ItemEffect,
  ItemGroup
]);
class ReplayItem extends Item {
}
applyMixins(ReplayItem, [
  ItemLayout,
  ItemColor,
  ItemChroma,
  ItemTransition,
  Audio,
  ItemEffect,
  SourceReplay
]);
function ItemTypeResolve(item) {
  let itemType;
  const type = Number(item["type"]);
  const itemValue = item["item"];
  const uppercaseValue = itemValue.toUpperCase();
  if (type === ItemTypes.GAMESOURCE) {
    itemType = new GameItem(item);
  } else if ((type === ItemTypes.HTML || type === ItemTypes.FILE) && item["name"].indexOf("Video Playlist") === 0 && item["FilePlaylist"] !== "") {
    itemType = new VideoPlaylistItem(item);
  } else if (type === ItemTypes.HTML) {
    itemType = new HtmlItem(item);
  } else if (type === ItemTypes.SCREEN) {
    itemType = new ScreenItem(item);
  } else if (type === ItemTypes.BITMAP || type === ItemTypes.FILE && /\.gif$/i.test(itemValue)) {
    itemType = new ImageItem(item);
  } else if (type === ItemTypes.FILE && /\.(gif|xbs)$/i.test(itemValue) === false && /^(rtsp|rtmp):\/\//i.test(itemValue) === false && (VIDEO_REGEX.test(itemValue.split("*")[0]) || AUDIO_REGEX.test(itemValue.split("*")[0]))) {
    itemType = new MediaItem(item);
  } else if (type === ItemTypes.LIVE && uppercaseValue.indexOf(
    "{33D9A762-90C8-11D0-BD43-00A0C911CE86}"
  ) === -1) {
    itemType = new CameraItem(item);
  } else if (type === ItemTypes.LIVE && uppercaseValue.indexOf(
    "{33D9A762-90C8-11D0-BD43-00A0C911CE86}"
  ) !== -1) {
    itemType = new AudioItem(item);
  } else if (type === ItemTypes.FLASHFILE) {
    itemType = new FlashItem(item);
  } else if (type === ItemTypes.SCENE || type === ItemTypes.VIEW) {
    itemType = new SceneItem(item);
  } else if (type === ItemTypes.GROUP) {
    itemType = new GroupItem(item);
  } else if (type === ItemTypes.REPLAY) {
    itemType = new ReplayItem(item);
  } else {
    itemType = new GenericItem(item);
  }
  return itemType;
}
const supportedPresetTransitionEasingFunctions = [
  "",
  "none",
  "easeInCubic",
  "easeOutCubic",
  "easeInOutCubic"
];
const _Scene = class _Scene {
  constructor(sceneId, name, uid) {
    this._id = sceneId;
    if (!versionCompare(getVersion()).is.lessThan(sceneUidMinVersion)) {
      this._uid = uid;
      this._name = name;
      this._refID = uid;
    } else {
      this._refID = sceneId;
    }
  }
  static _initializeScenePoolAsync() {
    return new Promise((resolve2) => {
      _Scene._scenePool = [];
      App$1.getAsList("sceneconfig").then((jsonArr) => {
        if (versionCompare(getVersion()).is.lessThan(minVersion)) {
          const count = jsonArr.length;
          count > 12 ? _Scene._maxScenes = count : _Scene._maxScenes = 12;
          for (var i = 0; i < _Scene._maxScenes; i++) {
            _Scene._scenePool[i] = new _Scene(i);
          }
          _Scene._scenePool.push(new _Scene("i12"));
          resolve2(_Scene._maxScenes);
        } else {
          let count = 0;
          jsonArr.filter((json) => json["tag"] === "placement").map((scene, index) => {
            count++;
            _Scene._scenePool[index] = new _Scene(index, scene["name"], scene["id"]);
          });
          _Scene._scenePool.push(new _Scene("i12", "i12", "i12"));
          resolve2(count);
        }
      });
    });
  }
  /**
   * return: Promise<number>
   *
   * Get the specific number of scenes loaded.
   * ```javascript
   * var sceneCount;
   * Scene.getSceneCount().then(function(count) {
   *   sceneCount = count;
   * });
   * ```
   */
  static getSceneCount() {
    return new Promise((resolve2) => {
      _Scene._initializeScenePoolAsync().then((count) => {
        resolve2(count);
      });
    });
  }
  /**
   * return: Promise<Scene>
   *
   * Get a specific scene object given the scene number.
   *
   * #### Usage
   *
   * ```javascript
   * var scene1;
   * Scene.getById(1).then(function(scene) {
   *   scene1 = scene;
   * });
   * ```
   * ** For deprecation, please use getBySceneIndex instead.
   */
  static getById(sceneNum) {
    return new Promise((resolve2, reject2) => {
      _Scene._initializeScenePoolAsync().then((cnt) => {
        if (sceneNum === "i12") {
          if (_Scene._scenePool[cnt]._id === "i12") {
            resolve2(_Scene._scenePool[cnt]);
          } else {
            reject2(Error("Invalid parameter. Valid range is 1 to total number of available scenes."));
          }
        } else {
          try {
            if (sceneNum > cnt || typeof _Scene._scenePool[sceneNum - 1] === "undefined") {
              reject2(Error("Invalid parameter. Valid range is 1 to total number of available scenes."));
            } else {
              resolve2(_Scene._scenePool[sceneNum - 1]);
            }
          } catch (e) {
            reject2(Error("Parameter must be a number"));
          }
        }
      });
    });
  }
  /**
   * return: Promise<Scene>
   *
   * Get a specific scene object given the scene index.
   *
   * #### Usage
   *
   * ```javascript
   * var scene1;
   * Scene.getBySceneIndex(0).then(function(scene) {
   *   scene1 = scene;
   * });
   * ```
   */
  static getBySceneIndex(sceneIndex) {
    return new Promise((resolve2, reject2) => {
      _Scene._initializeScenePoolAsync().then((cnt) => {
        if (sceneIndex === "i12") {
          if (_Scene._scenePool[cnt]._id === "i12") {
            resolve2(_Scene._scenePool[cnt]);
          } else {
            reject2(Error("Invalid parameter"));
          }
        } else {
          try {
            if (sceneIndex > cnt || typeof _Scene._scenePool[sceneIndex] === "undefined") {
              reject2(Error("Invalid parameter"));
            } else {
              resolve2(_Scene._scenePool[sceneIndex]);
            }
          } catch (e) {
            reject2(Error("Parameter must be a number"));
          }
        }
      });
    });
  }
  /**
   * return: Promise<Scene>
   *
   * Get a specific scene object given the scene unique Id.
   *
   * #### Usage
   *
   * ```javascript
   * var scene1;
   * Scene.getBySceneUid('{056936DD-DFAA-4148-9D08-21C8E83CE37C}')
   * .then(function(scene) {
   *   scene1 = scene;
   * });
   * ```
   */
  static getBySceneUid(sceneUid) {
    return new Promise((resolve2, reject2) => {
      let isID = /^{[A-F0-9-]*}$/i.test(sceneUid);
      if (!isID) {
        reject2(Error("Not a valid Unique ID format for a Scene"));
      } else {
        this._initializeScenePoolAsync().then(() => {
          const sceneLength = this._scenePool.length;
          this._scenePool.map((scene, idx) => {
            scene.getSceneUid().then((uid) => {
              if (uid === sceneUid) {
                resolve2(scene);
              }
              if (sceneLength - 1 === idx) {
                reject2(Error("No matching Scene with the Unique ID provided."));
              }
            });
          });
        });
      }
    });
  }
  /**
   * return: Promise<Scene[]>
   *
   * Asynchronous function to get a list of scene objects with a specific name.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.getByName('Game').then(function(scenes) {
   *   // manipulate scenes
   * });
   * ```
   */
  static getByName(sceneName) {
    return new Promise((resolve2) => {
      let sceneArr = [];
      this._initializeScenePoolAsync().then((count) => {
        this._scenePool.map((scene, idx) => {
          scene.getName().then((name) => {
            if (name === sceneName) {
              sceneArr.push(scene);
            }
            if (idx + 1 === count) {
              resolve2(sceneArr);
            }
          });
        });
      });
    });
  }
  /**
   * return: Promise<Scene>
   *
   * Get the currently active scene. Does not work on source plugins.
   *
   * #### Usage
   *
   * ```javascript
   * var myScene;
   * Scene.getActiveScene().then(function(scene) {
   *   myScene = scene;
   * });
   * ```
   */
  static getActiveScene() {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Not supported on source plugins"));
      } else {
        App$1.getGlobalProperty("splitmode").then((res) => {
          const preset = res === "1" ? "scene:1" : "scene:0";
          App$1.get(preset).then((id) => {
            return _Scene.getBySceneIndex(Number(id));
          }).then((scene) => {
            resolve2(scene);
          });
        });
      }
    });
  }
  /**
   * param: scene<number|Scene>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Change active scene. Does not work on source plugins.
   */
  static setActiveScene(scene) {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Not supported on source plugins"));
      } else {
        App$1.getGlobalProperty("splitmode").then((res) => {
          const preset = res === "1" ? "scene:1" : "scene:0";
          if (scene instanceof _Scene) {
            App$1.set(preset, String(scene._id)).then((res2) => {
              resolve2(res2);
            });
          } else if (typeof scene === "number") {
            if (scene < 1 || !Number["isInteger"](Number(scene))) {
              reject2(Error("Invalid parameters. Valid range is greater than 0."));
            } else {
              App$1.set(preset, String(scene - 1)).then((res2) => {
                resolve2(res2);
              });
            }
          } else {
            reject2(Error("Invalid parameters. Valid range is greater than 0 or a Scene object."));
          }
        });
      }
    });
  }
  /**
   * return: Promise<Item>
   *
   * Searches all scenes for an item by ID. ID search will return exactly 1 result (IDs are unique) or null.
   *
   * See also: {@link #core/Item Core/Item}
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchItemsById('{10F04AE-6215-3A88-7899-950B12186359}')
   * .then(function(item) {
   *   // result is either an Item or null
   * });
   * ```
   *
   */
  static searchItemsById(id) {
    return new Promise((resolve2, reject2) => {
      let isID = /^{[A-F0-9\-]*}$/i.test(id);
      if (!isID) {
        reject2(Error("Not a valid ID format for items"));
      } else {
        _Scene._initializeScenePoolAsync().then((cnt) => {
          let match = null;
          let found = false;
          let promiseArray = [];
          let scenePromise = (scene, idx, arr) => new Promise((sceneResolve) => {
            if (match === null) {
              scene.getItems().then((items) => {
                found = items.some((item) => {
                  if (item["_id"] === id.toUpperCase()) {
                    match = item;
                    return true;
                  } else {
                    return false;
                  }
                });
                if (found || Number(idx) === arr.length - 1) {
                  sceneResolve(match);
                } else {
                  sceneResolve(null);
                }
              }).catch((err) => {
                sceneResolve(null);
              });
            }
          });
          _Scene._scenePool.map((scene, idx, arr) => {
            promiseArray.push(scenePromise(scene, idx, arr));
          });
          Promise.all(promiseArray).then((results) => {
            resolve2(match);
          });
        });
      }
    });
  }
  /**
   * return: Promise<Scene>
   *
   * Searches all scenes for one that contains the given item ID.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchScenesByItemId('{10F04AE-6215-3A88-7899-950B12186359}')
   * .then(function(scene) {
   *   // scene contains the item
   * });
   * ```
   *
   */
  static searchScenesByItemId(id) {
    return new Promise((resolve2, reject2) => {
      let isID = /^{[A-F0-9-]*}$/i.test(id);
      if (!isID) {
        reject2(Error("Not a valid ID format for items"));
      } else {
        _Scene._initializeScenePoolAsync().then((cnt) => {
          let match = null;
          let found = false;
          let promiseArray = [];
          let scenePromise = (scene, idx, arr) => new Promise((sceneResolve) => {
            if (match === null) {
              scene.getItems().then((items) => {
                found = items.some((item) => {
                  if (item["_id"] === id.toUpperCase()) {
                    match = scene;
                    return true;
                  } else {
                    return false;
                  }
                });
                if (found || Number(idx) === arr.length - 1) {
                  sceneResolve(match);
                } else {
                  sceneResolve(null);
                }
              }).catch((err) => {
                sceneResolve(null);
              });
            }
          });
          _Scene._scenePool.map((scene, idx, arr) => {
            promiseArray.push(scenePromise(scene, idx, arr));
          });
          Promise.all(promiseArray).then((results) => {
            resolve2(match);
          });
        });
      }
    });
  }
  /**
   * return: Promise<Items[]>
   *
   * Searches all items for an item by name substring. This function
   * compares against custom name first (recommended) before falling back to the
   * name property of the item.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchItemsByName('camera')
   * .then(function(items) {
   *   // do something to each item in items array
   * });
   * ```
   *
   * Note: With the XBC 2.9 change, linked items would have the same
   * Name and Custom Name. Changes made on an item would reflect on all
   * linked items.
   *
   */
  static searchItemsByName(param) {
    return new Promise((resolve2) => {
      this.filterItems((item, filterResolve) => {
        if (item["_cname"] === param) {
          filterResolve(true);
        } else if (item["_name"] === param) {
          filterResolve(true);
        } else if (item["_value"] === param) {
          filterResolve(true);
        } else {
          filterResolve(false);
        }
      }).then((items) => {
        resolve2(items);
      });
    });
  }
  /**
   * param: (func: function)
   * ```
   * return: Promise<Item[]>
   * ```
   *
   * Searches all scenes for items that satisfies the provided testing function.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.filterItems(function(item, resolve) {
   *   // We'll only fetch Flash Items by resolving 'true' if the item is an
   *   // instance of FlashItem
   *   resolve((item instanceof FlashItem));
   * }).then(function(items) {
   *   // items would either be an empty array if no Flash items was found,
   *   // or an array of FlashItem objects
   * });
   * ```
   */
  static filterItems(func) {
    return new Promise((resolve2, reject2) => {
      _Scene._initializeScenePoolAsync().then((cnt) => {
        let matches = [];
        if (typeof func === "function") {
          return Promise.all(_Scene._scenePool.map((scene) => {
            return new Promise((resolveScene) => {
              scene.getItems().then((items) => {
                if (items.length === 0) {
                  resolveScene();
                } else {
                  return Promise.all(items.map((item) => {
                    return new Promise((resolveItem) => {
                      func(item, (checker) => {
                        if (checker) {
                          matches.push(item);
                        }
                        resolveItem();
                      });
                    });
                  })).then(() => {
                    resolveScene();
                  });
                }
              }).catch(() => {
                resolveScene();
              });
            });
          })).then(() => {
            resolve2(matches);
          });
        } else {
          reject2(Error("Parameter is not a function"));
        }
      });
    });
  }
  /**
   * param: (func: function)
   * ```
   * return: Promise<Scene[]>
   * ```
   *
   * Searches all scenes for items that satisfies the provided testing
   * function, and then return the scene that contains the item.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.filterScenesByItems(function(item, resolve) {
   *   // We'll only fetch the scenes with flash items by resolving 'true' if
   *   // the item is an instance of FlashItem
   *   resolve((item instanceof FlashItem));
   * }).then(function(scenes) {
   *   // scenes would be an array of all scenes with FlashItem
   * });
   * ```
   */
  static filterScenesByItems(func) {
    return new Promise((resolve2, reject2) => {
      _Scene._initializeScenePoolAsync().then((cnt) => {
        let matches = [];
        if (typeof func === "function") {
          return Promise.all(_Scene._scenePool.map((scene) => {
            return new Promise((resolveScene) => {
              scene.getItems().then((items) => {
                if (items.length === 0) {
                  resolveScene();
                } else {
                  return Promise.all(items.map((item) => {
                    return new Promise((resolveItem) => {
                      func(item, (checker) => {
                        if (checker) {
                          matches.push(scene);
                        }
                        resolveItem();
                      });
                    });
                  })).then(() => {
                    resolveScene();
                  });
                }
              }).catch(() => resolveScene());
            });
          })).then(() => {
            resolve2(matches);
          });
        } else {
          reject2(Error("Parameter is not a function"));
        }
      });
    });
  }
  /**
   * return: Promise<Source>
   *
   * Searches all scenes for a source by ID. ID search will return exactly 1
   * result (IDs are unique) or null.
   *
   * See also: {@link #core/Source Core/Source}
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchSourcesById('{10F04AE-6215-3A88-7899-950B12186359}')
   * .then(function(sources) {
   *   // result would return one instance of the source per scene
   * });
   * ```
   *
   */
  static searchSourcesById(srcId) {
    return new Promise((resolve2, reject2) => {
      let isID = /^{[A-F0-9\-]*}$/i.test(srcId);
      if (!isID) {
        reject2(Error("Not a valid ID format for sources"));
      } else {
        _Scene._initializeScenePoolAsync().then((cnt) => {
          let match = null;
          let found = false;
          let promiseArray = [];
          let scenePromise = (scene, idx, arr) => new Promise((sceneResolve) => {
            if (match === null) {
              scene.getSources().then((sources) => {
                found = sources.some((source) => {
                  if (source["_srcId"] === srcId.toUpperCase()) {
                    match = source;
                    return true;
                  } else {
                    return false;
                  }
                });
                if (found || Number(idx) === arr.length - 1) {
                  sceneResolve(match);
                } else {
                  sceneResolve(null);
                }
              }).catch((err) => {
                sceneResolve(null);
              });
            }
          });
          _Scene._scenePool.map((scene, idx, arr) => {
            promiseArray.push(scenePromise(scene, idx, arr));
          });
          Promise.all(promiseArray).then((results) => {
            let finalResults = [];
            for (var i = 0; i < results.length; i++) {
              if (results[i] !== null) {
                finalResults.push(results[i]);
              }
            }
            resolve2(finalResults);
          });
        });
      }
    });
  }
  /**
   * return: Promise<Scene>
   *
   * Searches all scenes for one that contains the given source ID.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchScenesBySourceId('{10F04AE-6215-3A88-7899-950B12186359}')
   * .then(function(scenes) {
   *   // scenes that contains the source with matching source id
   * });
   * ```
   *
   */
  static searchScenesBySourceId(srcId) {
    return new Promise((resolve2, reject2) => {
      let isID = /^{[A-F0-9-]*}$/i.test(srcId);
      if (!isID) {
        reject2(Error("Not a valid ID format for sources"));
      } else {
        _Scene._initializeScenePoolAsync().then((cnt) => {
          let match = null;
          let found = false;
          let promiseArray = [];
          let scenePromise = (scene, idx, arr) => new Promise((sceneResolve) => {
            if (match === null) {
              scene.getSources().then((sources) => {
                found = sources.some((source) => {
                  if (source["_srcId"] === srcId.toUpperCase()) {
                    match = scene;
                    return true;
                  } else {
                    return false;
                  }
                });
                if (found || Number(idx) === arr.length - 1) {
                  sceneResolve(match);
                } else {
                  sceneResolve(null);
                }
              }).catch((err) => {
                sceneResolve(null);
              });
            }
          });
          _Scene._scenePool.map((scene, idx, arr) => {
            promiseArray.push(scenePromise(scene, idx, arr));
          });
          Promise.all(promiseArray).then((results) => {
            let finalResults = [];
            for (var i = 0; i < results.length; i++) {
              if (results[i] !== null) {
                finalResults.push(results[i]);
              }
            }
            resolve2(finalResults);
          });
        });
      }
    });
  }
  /**
   * return: Promise<Source[]>
   *
   * Searches all scenes for a source by name substring. This function
   * compares against custom name first (recommended) before falling back to the
   * name property of the source.
   *
   *
   * #### Usage
   *
   * ```javascript
   * Scene.searchSourcesByName('camera').then(function(sources) {
   *   // do something to each source in sources array
   * });
   * ```
   *
   */
  static searchSourcesByName(param) {
    return new Promise((resolve2) => {
      this.filterSources((source, filterResolve) => {
        source.getCustomName().then((cname) => {
          if (cname.match(param)) {
            filterResolve(true);
          } else {
            return source.getName();
          }
        }).then((name) => {
          if (name !== void 0) {
            if (name.match(param)) {
              filterResolve(true);
            } else {
              return source.getValue();
            }
          }
        }).then((value2) => {
          if (value2 !== void 0) {
            if (value2.toString().match(param)) {
              filterResolve(true);
            } else {
              filterResolve(false);
            }
          }
        });
      }).then((sources) => {
        resolve2(sources);
      });
    });
  }
  /**
   * param: (func: function)
   * ```
   * return: Promise<Source[]>
   * ```
   *
   * Searches all scenes for sources that satisfies the provided testing function.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.filterSources(function(source, resolve) {
   *   // We'll only fetch Flash Sources by resolving 'true' if the source is
   *   // an instance of FlashSource
   *   resolve((source instanceof FlashSource));
   * }).then(function(sources) {
   *   // sources would either be an empty array if no Flash sources was
   *   // found, or an array of FlashSource objects
   * });
   * ```
   */
  static filterSources(func) {
    return new Promise((resolve2, reject2) => {
      _Scene._initializeScenePoolAsync().then((cnt) => {
        let matches = [];
        if (typeof func === "function") {
          return Promise.all(_Scene._scenePool.map((scene) => {
            return new Promise((resolveScene) => {
              scene.getSources().then((sources) => {
                if (sources.length === 0) {
                  resolveScene();
                } else {
                  return Promise.all(sources.map((source) => {
                    return new Promise((resolveSource) => {
                      func(source, (checker) => {
                        if (checker) {
                          matches.push(source);
                        }
                        resolveSource();
                      });
                    });
                  })).then(() => {
                    resolveScene();
                  });
                }
              }).catch(() => {
                resolveScene();
              });
            });
          })).then(() => {
            resolve2(matches);
          });
        } else {
          reject2(Error("Parameter is not a function"));
        }
      });
    });
  }
  /**
   * param: (func: function)
   * ```
   * return: Promise<Scene[]>
   * ```
   *
   * Searches all scenes for sources that satisfies the provided testing
   * function, and then return the scene that contains the source.
   *
   * #### Usage
   *
   * ```javascript
   * Scene.filterScenesBySources(function(source, resolve) {
   *   // We'll only fetch the scenes with flash sources by resolving 'true'
   *   // if the source is an instance of FlashSource
   *   resolve((source instanceof FlashSource));
   * }).then(function(scenes) {
   *   // scenes would be an array of all scenes with FlashSources
   * });
   * ```
   */
  static filterScenesBySources(func) {
    return new Promise((resolve2, reject2) => {
      _Scene._initializeScenePoolAsync().then((cnt) => {
        let matches = [];
        if (typeof func === "function") {
          return Promise.all(_Scene._scenePool.map((scene) => {
            return new Promise((resolveScene) => {
              scene.getSources().then((sources) => {
                if (sources.length === 0) {
                  resolveScene();
                } else {
                  return Promise.all(sources.map((source) => {
                    return new Promise((resolveSource) => {
                      func(source, (checker) => {
                        if (checker) {
                          matches.push(scene);
                        }
                        resolveSource();
                      });
                    });
                  })).then(() => {
                    resolveScene();
                  });
                }
              });
            });
          })).then(() => {
            resolve2(matches);
          });
        } else {
          reject2(Error("Parameter is not a function"));
        }
      });
    });
  }
  /**
     * return: Promise<boolean>
  
     * Load scenes that are not yet initialized in XSplit Broadcaster.
     *
     * Note: This is only necessary for XSplit version 2.7 and below.
     * Also, for memory saving purposes, this is not called automatically.
     * If your extension wants to manipulate multiple scenes, it is imperative that you call this function.
     * This function is only available to extensions.
     *
     * #### Usage
     *
     * ```javascript
     * Scene.initializeScenes().then(function(val) {
     *   if (val === true) {
     *     // Now you know that all scenes are loaded :)
     *   }
     * })
     * ```
     */
  static initializeScenes() {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("function is not available for source"));
      } else {
        if (versionCompare(getVersion()).is.lessThan(minVersion)) {
          App$1.get("scenecount").then((cnt) => {
            if (Number(cnt) < 12) {
              App$1.set("sceneconfig:11", '<placement name="Scene 12" defpos="0" />').then((res) => {
                resolve2(res);
              });
            } else {
              resolve2(true);
            }
          });
        } else {
          resolve2(true);
        }
      }
    });
  }
  /**
   * return: Scene
   *
   * Returns a special `liveScene` object that may be added as a source to the stage.
   * The Scene.liveScene object whenever called upon,
   * gives access to the current active scene.
   * This is made possible because the liveScene object does not pertain to a real scene
   * in the context of XBC, but the actual view,
   * or at least the scene which is currently loaded in that view.
   *
   * #### Usage
   *
   * ```javascript
   * var xjs = require('xjs');
   * xjs.Scene.liveScene().addAsSource();
   * ```
   */
  static liveScene() {
    if (_Scene._liveScene === void 0) {
      _Scene._liveScene = new _Scene("LIVE", "Live Scene", "0");
      _Scene._liveScene.getSources = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.getSources();
          }).then((sources) => {
            resolve2(sources);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.getSceneNumber = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.getSceneNumber();
          }).then((sceneNumber) => {
            resolve2(sceneNumber);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.getSceneIndex = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.getSceneIndex();
          }).then((sceneIndex) => {
            resolve2(sceneIndex);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.getSceneUid = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.getSceneUid();
          }).then((sceneUID) => {
            resolve2(sceneUID);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.getName = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.getName();
          }).then((name) => {
            resolve2(name);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.setName = (name) => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.setName(name);
          }).then((setFlag) => {
            resolve2(setFlag);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.getItems = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.getItems();
          }).then((items) => {
            resolve2(items);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.getTopLevelItems = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.getTopLevelItems();
          }).then((items) => {
            resolve2(items);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.isEmpty = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.isEmpty();
          }).then((empty) => {
            resolve2(empty);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.setItemOrder = (items) => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.setItemOrder(items);
          }).then((sources) => {
            resolve2(this);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.getPresets = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.getPresets();
          }).then((presets) => {
            resolve2(presets);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.getActivePreset = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.getActivePreset();
          }).then((preset) => {
            resolve2(preset);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.switchToPreset = (preset) => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.switchToPreset(preset);
          }).then((setFlag) => {
            resolve2(setFlag);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.addPreset = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.addPreset();
          }).then((preset) => {
            resolve2(preset);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.removePreset = (preset) => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.removePreset(preset);
          }).then((setFlag) => {
            resolve2(setFlag);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.getPresetTransitionEasing = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.getPresetTransitionEasing();
          }).then((easing) => {
            resolve2(easing);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.setPresetTransitionEasing = (presetTransitionEasing) => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.setPresetTransitionEasing(presetTransitionEasing);
          }).then((setFlag) => {
            resolve2(setFlag);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.getPresetTransitionTime = () => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.getPresetTransitionTime();
          }).then((time) => {
            resolve2(time);
          }).catch((err) => reject2(err));
        });
      };
      _Scene._liveScene.setPresetTransitionTime = (presetTransitionTime) => {
        return new Promise((resolve2, reject2) => {
          _Scene.getActiveScene().then((activeScene) => {
            return activeScene.setPresetTransitionTime(presetTransitionTime);
          }).then((setFlag) => {
            resolve2(setFlag);
          }).catch((err) => reject2(err));
        });
      };
    }
    return _Scene._liveScene;
  }
  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds this scene as a source to the current scene by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addAsSource(value2) {
    return new Promise((resolve2, reject2) => {
      if (!versionCompare(getVersion()).is.lessThan(sceneSourceVersion)) {
        checkSplitmode(value2).then((scenePrefix) => {
          const sceneToAdd = new JSON$1();
          sceneToAdd.tag = "item";
          sceneToAdd["item"] = this._uid;
          sceneToAdd["name"] = this._name;
          sceneToAdd["type"] = this._uid === "0" ? ItemTypes.VIEW : ItemTypes.SCENE;
          sceneToAdd["selfclosing"] = true;
          const sceneXML = XML.parseJSON(sceneToAdd);
          return addToSceneHandler(scenePrefix + "additem", sceneXML.toString());
        }).then((result) => {
          resolve2(result);
        }).catch((err) => {
          reject2(err);
        });
      } else {
        reject2(Error("Not supported in this XBC version"));
      }
    });
  }
  /**
   * return: Promise<Source[]>
   *
   * Get all unique Sources from the current scene.
   * Total number of Sources returned may be less that total number of Items on
   * the scenes due to `Linked` items only having a single Source.
   * See also: {@link #core/Source Core/Source}
   *
   * #### Usage
   * ```javascript
   * scene.getSources().then(function(sources) {
   *   for(var i = 0 ; i < sources.length ; i++) {
   *      if(sources[i] instanceof xjs.HtmlSource) {
   *        // Manipulate HTML Source here
   *      }
   *   }
   * })
   * ```
   */
  getSources() {
    return new Promise((resolve2, reject2) => {
      App$1.getAsItemList("sceneconfig:" + this._refID).then((jsonArr) => {
        var promiseArray = [];
        let uniqueObj = {};
        let uniqueSrc = [];
        let typePromise = (index) => new Promise((typeResolve) => {
          let source = jsonArr[index];
          let srcType = SourceTypeResolve(source);
          typeResolve(srcType);
        });
        if (Array.isArray(jsonArr)) {
          for (var i = 0; i < jsonArr.length; i++) {
            jsonArr[i]["sceneId"] = this._id;
            promiseArray.push(typePromise(i));
          }
        }
        Promise.all(promiseArray).then((results) => {
          for (var h = 0; h < results.length; h++) {
            for (var key in results[h]) {
              if (key === "_srcId") {
                uniqueObj[results[h][key]] = results[h];
              }
            }
          }
          for (var j in uniqueObj) {
            if (uniqueObj.hasOwnProperty(j)) {
              uniqueSrc.push(uniqueObj[j]);
            }
          }
          resolve2(uniqueSrc);
        });
      }).catch((err) => {
        reject2(err);
      });
    });
  }
  /**
   * return: Promise<number>
   *
   * Get the 1-indexed scene number of this scene object.
   *
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getSceneNumber().then(function(num) {
   *  console.log('My scene is scene number ' + num);
   * });
   * ```
   *
   * ** For deprecation, please use getSceneIndex instead.
   */
  getSceneNumber() {
    return new Promise((resolve2) => {
      let curUid = this._uid;
      if (versionCompare(getVersion()).is.lessThan(sceneUidMinVersion)) {
        if (typeof this._id === "number") {
          resolve2(Number(this._id) + 1);
        } else {
          resolve2(this._id);
        }
      } else {
        _Scene._initializeScenePoolAsync().then(() => {
          return _Scene.getBySceneUid(curUid);
        }).then((curScene) => {
          if (typeof curScene !== "number") {
            resolve2(Number(curScene._id) + 1);
          } else {
            resolve2(curScene._id);
          }
        });
      }
    });
  }
  /**
   * return: Promise<number>
   *
   * Get the 0-indexed scene number of this scene object.
   *
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getSceneIndex().then(function(num) {
   *  console.log('Scene index is ' + num);
   * });
   * ```
   */
  getSceneIndex() {
    return new Promise((resolve2) => {
      let curUid = this._uid;
      if (versionCompare(getVersion()).is.lessThan(sceneUidMinVersion)) {
        if (typeof this._id !== "number") {
          resolve2(Number(this._id));
        } else {
          resolve2(this._id);
        }
      } else {
        _Scene._initializeScenePoolAsync().then(() => {
          return _Scene.getBySceneUid(curUid);
        }).then((curScene) => {
          resolve2(curScene._id);
        });
      }
    });
  }
  /**
   * return: Promise<string>
   *
   * Get the unique id of this scene object.
   * Scenes unique id is only available for XBC v.3.0.1704.2101 or higher.
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getSceneUid().then(function(res) {
   *  console.log('Scene unique id is  ' + res);
   * });
   * ```
   */
  getSceneUid() {
    return new Promise((resolve2, reject2) => {
      if (!versionCompare(getVersion()).is.lessThan(sceneUidMinVersion)) {
        resolve2(this._uid);
      } else {
        reject2(Error("Scenes unique id is only available for XBC v.3.0.1704.2101 or higher"));
      }
    });
  }
  /**
   * return: Promise<string>
   *
   * Get the name of this scene object.
   *
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getName().then(function(name) {
   *  console.log('My scene is named ' + name);
   * });
   * ```
   */
  getName() {
    return new Promise((resolve2) => {
      App$1.get("scenename:" + this._refID).then((val) => {
        resolve2(val);
      });
    });
  }
  /**
   * param: (value: string)
   * Set the name of this scene object. Cannot be set by source plugins.
   *
   * #### Usage
   *
   * ```javascript
   * myScene.setName('Gameplay');
   * ```
   */
  setName(name) {
    return new Promise((resolve2, reject2) => {
      if (!Environment.isSourceProps()) {
        reject2(Error("Scene names are readonly for source plugins and extensions."));
      } else {
        App$1.set("scenename:" + this._refID, name).then((value2) => {
          resolve2(value2);
        });
      }
    });
  }
  /**
   * return: Promise<string>
   *
   * Get the transition override of this scene object.
   * Transition overrides take priority over the more generic one from App.GetTransition
   * See also: {@link #core/Transition Core/Transition} and {@link #core/App#getTransition getTransition}
   *
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getTransitionOverride().then(function(transition) {
   *  // do something here
   * });
   * ```
   */
  getTransitionOverride() {
    return new Promise((resolve2) => {
      App$1.get("scenetransitionid:" + this._refID).then((val) => {
        if (val === "") {
          resolve2(Transition.NONE);
        } else {
          let currTransition = Transition[val.toUpperCase()];
          if (typeof currTransition !== "undefined") {
            resolve2(currTransition);
          } else {
            Transition.getSceneTransitions().then((transitions) => {
              let inTransition = false;
              let transitionObj;
              let i;
              for (i = 0; i < transitions.length; i++) {
                transitionObj = transitions[i];
                if (transitionObj.toString() === val) {
                  inTransition = true;
                  break;
                }
              }
              if (inTransition) {
                resolve2(transitionObj);
              } else {
                resolve2(new Transition(val));
              }
            }).catch((err) => {
              resolve2(new Transition(val));
            });
          }
        }
      });
    });
  }
  /**
   * param: (value: string)
   * Set the transition override of this scene object.
   * Transition overrides take priority over the more generic one from App.GetTransition
   * See also: {@link #core/Transition Core/Transition} and {@link #core/App#setTransition setTransition}
   *
   *
   * #### Usage
   *
   * ```javascript
   * myScene.setTransitionOverride('xjs.Transition.CLOCK');
   * ```
   */
  setTransitionOverride(value2) {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Scene transition overrides are readonly for source plugins."));
      } else {
        App$1.set("scenetransitionid:" + this._refID, value2 instanceof Transition ? value2.toString() : value2).then((value22) => {
          resolve2(value22);
        }).catch((err) => {
          reject2(Error("Invalid parameter. Only Transition objects or transition strings are allowed."));
        });
      }
    });
  }
  /**
   * return: Promise<number>
   *
   * Get the transition time override of this scene object.
   * The scene transition time override will only take effect
   * if the scene transition override itself is not equal to ''(Transition.NONE)
   *
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getTransitionTime().then(function(time) {
   *  // do something here
   * });
   * ```
   */
  getTransitionTime() {
    return new Promise((resolve2) => {
      App$1.get("scenetransitiontime:" + this._refID).then((val) => {
        resolve2(Number(val));
      });
    });
  }
  /**
   * param: (value: string)
   *
   * Set the transition time override of this scene object.
   * The scene transition time override will only take effect
   * if the scene transition override itself is not equal to ''(Transition.NONE)
   *
   * #### Usage
   *
   * ```javascript
   * myScene.setTransitionTime(1000);
   * ```
   */
  setTransitionTime(time) {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Scene transition overrides are readonly for source plugins."));
      } else {
        App$1.set("scenetransitiontime:" + this._refID, String(time)).then((value2) => {
          resolve2(value2);
        });
      }
    });
  }
  /**
   * return: Promise<Item[]>
   *
   * Gets all the items in a specific scene.
   * See also: {@link #core/Item Core/Item}
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getItems().then(function(items) {
   *  // do something to each item in items array
   * });
   * ```
   */
  getItems() {
    return new Promise((resolve2, reject2) => {
      App$1.getAsItemList("sceneconfig:" + this._refID).then((jsonArr) => {
        var promiseArray = [];
        let typePromise = (index) => new Promise((typeResolve) => {
          let item = jsonArr[index];
          let itemType = ItemTypeResolve(item);
          typeResolve(itemType);
        });
        if (Array.isArray(jsonArr)) {
          for (var i = 0; i < jsonArr.length; i++) {
            jsonArr[i]["sceneId"] = this._id;
            promiseArray.push(typePromise(i));
          }
        }
        Promise.all(promiseArray).then((results) => {
          resolve2(results);
        });
      }).catch((err) => {
        reject2(err);
      });
    });
  }
  /**
   * return: Promise<Item[]>
   *
   * Gets all non-child Items (not belonging to a group) in a specific scene
   * See also: {@link #core/Item Core/Item}
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getTopLevelItems().then(function(items) {
   *  // do something to each item in items array
   * });
   * ```
   */
  getTopLevelItems() {
    return new Promise((resolve2, reject2) => {
      App$1.getAsList("sceneconfig:" + this._refID).then((jsonArr) => {
        var promiseArray = [];
        let typePromise = (index) => new Promise((typeResolve) => {
          let item = jsonArr[index];
          let itemType = ItemTypeResolve(item);
          typeResolve(itemType);
        });
        if (Array.isArray(jsonArr)) {
          for (var i = 0; i < jsonArr.length; i++) {
            jsonArr[i]["sceneId"] = this._id;
            promiseArray.push(typePromise(i));
          }
        }
        Promise.all(promiseArray).then((results) => {
          resolve2(results);
        });
      }).catch((err) => {
        reject2(err);
      });
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Checks if a scene is empty.
   *
   * #### Usage
   *
   * ```javascript
   * myScene.isEmpty().then(function(empty) {
   *   if (empty === true) {
   *     console.log('My scene is empty.');
   *   }
   * });
   * ```
   */
  isEmpty() {
    return new Promise((resolve2) => {
      App$1.get("sceneisempty:" + this._refID).then((val) => {
        resolve2(val === "1");
      });
    });
  }
  /**
   * param: Array<Item> | Array<string> (item IDs)
   * ```
   * return: Promise<Scene>
   * ```
   *
   * Sets the item order of the current scene. The first item in the array
   * will be on top (will cover items below it).
   */
  setItemOrder(items) {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("not available for source plugins"));
      } else {
        items.reverse();
        let ids = [];
        _Scene.getActiveScene().then((scene) => {
          if (items.every((el) => {
            return el instanceof Source || el instanceof Item;
          })) {
            return new Promise((resolve22) => {
              let promises = [];
              for (let i in items) {
                promises.push(((_i) => {
                  return new Promise((resolve3) => {
                    items[_i].getId().then((id) => {
                      ids[_i] = id;
                      resolve3(this);
                    });
                  });
                })(i));
              }
              Promise.all(promises).then(() => {
                return scene.getSceneNumber();
              }).then((id) => {
                resolve22(id);
              });
            });
          } else {
            ids = items;
            return scene.getSceneNumber();
          }
        }).then((id) => {
          if (Number(id) - 1 === this._id && (Environment.isSourceProps() || Environment.isExtension)) {
            exec("SourcesListOrderSave", String(ViewTypes.MAIN), ids.join(","));
            resolve2(this);
          } else {
            let sceneName;
            this.getName().then((name) => {
              sceneName = name;
              return App$1.getAsList("sceneconfig:" + this._refID);
            }).then((jsonArr) => {
              let newOrder = new JSON$1();
              newOrder.children = [];
              newOrder["tag"] = "placement";
              newOrder["name"] = sceneName;
              if (Array.isArray(jsonArr)) {
                let attrs = ["name", "cname", "item"];
                for (let i = 0; i < jsonArr.length; i++) {
                  for (let a = 0; a < attrs.length; a++) {
                    jsonArr[i][attrs[a]] = jsonArr[i][attrs[a]].replace(/\\/g, "\\\\");
                    jsonArr[i][attrs[a]] = jsonArr[i][attrs[a]].replace(/"/g, "&quot;");
                  }
                  newOrder.children[ids.indexOf(jsonArr[i]["id"])] = jsonArr[i];
                }
                App$1.set(
                  "sceneconfig:" + this._refID,
                  //Revert back the formatting from json when transforming to xml
                  XML.parseJSON(newOrder).toString().replace(/\\\\/g, "\\")
                ).then(() => {
                  resolve2(this);
                });
              } else {
                reject2(Error("Scene does not have any source"));
              }
            });
          }
        });
      }
    });
  }
  /**
   * return: Promise<string[]>
   *
   * Get all presets for the scene, returns an array of preset UIDs
   * Does not work on source plugins.
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getPresets().then(function(presets) {
   *  // do something to each preset UID in UIDs array
   * });
   * ```
   */
  getPresets() {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Not supported on source plugins"));
      } else if (versionCompare(getVersion()).is.lessThan(scenePresetsVersion)) {
        reject2(Error("Not supported in this XBC version"));
      } else {
        let presetArray = ["{00000000-0000-0000-0000-000000000000}"];
        App$1.get("scenepresetlist:" + this._uid).then((presetlist) => {
          if (presetlist !== "") {
            presetArray.push(...presetlist.split(","));
          }
          resolve2(presetArray);
        });
      }
    });
  }
  /**
   * return: Promise<string>
   *
   * Get the UID of the active preset.
   * Does not work on source plugins.
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getActivePreset().then(function(preset) {
   *  console.log('Active preset UID is ' + preset);
   * });
   * ```
   */
  getActivePreset() {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Not supported on source plugins"));
      } else if (versionCompare(getVersion()).is.lessThan(scenePresetsVersion)) {
        reject2(Error("Not supported in this XBC version"));
      } else {
        App$1.get("scenepreset:" + this._uid).then((value2) => {
          resolve2(value2);
        });
      }
    });
  }
  /**
   * param: (preset: string)
   * ```
   * return: Promise<boolean>
   * ```
   * Switch to the specified preset for the scene.
   * Does not work on source plugins.
   *
   * #### Usage
   *
   * ```javascript
   *
   * myScene.getPresets()
   * .then(presets => {
   *   const lastPreset = presets.pop()
   *   return myScene.switchToPreset(lastPreset);
   * })
   * .then(isSwitched => {
   *   console.log('switched to preset : ' + isSwitched)
   * });
   * ```
   */
  switchToPreset(preset) {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Not supported on source plugins"));
      } else if (versionCompare(getVersion()).is.lessThan(scenePresetsVersion)) {
        reject2(Error("Not supported in this XBC version"));
      } else {
        App$1.set("scenepreset:" + this._uid, preset).then((value2) => {
          if (value2) {
            resolve2(value2);
          } else {
            reject2(Error("Cannot switch to preset or preset non-existent"));
          }
        });
      }
    });
  }
  /**
   * return: Promise<string>
   *
   * Add a new preset to the scene, returns the UID of the new preset
   * Does not work on source plugins.
   *
   * #### Usage
   *
   * ```javascript
   * myScene.addPreset().then(function(preset) {
   *  console.log('New preset UID is ' + preset);
   * });
   * ```
   */
  addPreset() {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Not supported on source plugins"));
      } else if (versionCompare(getVersion()).is.lessThan(scenePresetsVersion)) {
        reject2(Error("Not supported in this XBC version"));
      } else {
        App$1.get("scenenewpreset:" + this._uid).then((value2) => {
          resolve2(value2);
        });
      }
    });
  }
  /**
   * param: (preset: string)
   * ```
   * return: Promise<boolean>
   * ```
   * Remove the specified preset for the scene.
   * Does not work on source plugins.
   *
   * #### Usage
   *
   * ```javascript
   *
   * myScene.removePreset(lastPreset)
   * .then(isRemoved => {
   *   console.log('preset is removed : ' + isRemoved)
   * });
   * ```
   */
  removePreset(preset) {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Not supported on source plugins"));
      } else if (versionCompare(getVersion()).is.lessThan(scenePresetsVersion)) {
        reject2(Error("Not supported in this XBC version"));
      } else if (preset === "{00000000-0000-0000-0000-000000000000}") {
        reject2(Error("Cannot delete the default preset"));
      } else {
        App$1.set("sceneremovepreset:" + this._uid, preset).then((value2) => {
          if (value2) {
            resolve2(value2);
          } else {
            reject2(Error("Cannot delete preset or preset non-existent"));
          }
        });
      }
    });
  }
  /**
   * return: Promise<string>
   *
   * Get the preset transition easing function for the scene.
   * Does not work on source plugins.
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getPresetTransition().then(function(presetTransition) {
   *  console.log('Preset transition is ' + presetTransition);
   * });
   * ```
   */
  getPresetTransitionEasing() {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Not supported on source plugins"));
      } else if (versionCompare(getVersion()).is.lessThan(scenePresetsVersion)) {
        reject2(Error("Not supported in this XBC version"));
      } else {
        App$1.get("scenepresettransitionfunc:" + this._uid).then((value2) => {
          if (value2 === "") {
            value2 = "none";
          }
          resolve2(value2);
        });
      }
    });
  }
  /**
   * param: (presetTransitionEasing: string)
   * ```
   * return: Promise<boolean>
   * ```
   * Switch to the specified preset transition easing function for the scene
   * Possible values ('' or 'none', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic')
   * Does not work on source plugins.
   *
   * #### Usage
   *
   * ```javascript
   *
   * myScene.setPresetTransitionEasing('easeInCubic');
   * ```
   */
  setPresetTransitionEasing(presetTransitionEasing) {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Not supported on source plugins"));
      } else if (versionCompare(getVersion()).is.lessThan(scenePresetsVersion)) {
        reject2(Error("Not supported in this XBC version"));
      } else if (supportedPresetTransitionEasingFunctions.indexOf(presetTransitionEasing) < 0) {
        reject2(Error("Easing function not supported for preset transitions"));
      } else {
        presetTransitionEasing = presetTransitionEasing === "none" ? "" : presetTransitionEasing;
        App$1.set("scenepresettransitionfunc:" + this._uid, presetTransitionEasing).then((value2) => {
          resolve2(value2);
        });
      }
    });
  }
  /**
   * return: Promise<number>
   *
   * Get the preset transition time for the scene, in ms
   * Does not work on source plugins.
   *
   * #### Usage
   *
   * ```javascript
   * myScene.getPresetTransitionTime().then(function(presetTransitionTime) {
   *  console.log('Preset transition time is ' + presetTransitionTime);
   * });
   * ```
   */
  getPresetTransitionTime() {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Not supported on source plugins"));
      } else if (versionCompare(getVersion()).is.lessThan(scenePresetsVersion)) {
        reject2(Error("Not supported in this XBC version"));
      } else {
        App$1.get("scenepresettransitiontime:" + this._uid).then((value2) => {
          resolve2(Number(value2));
        });
      }
    });
  }
  /**
   * param: (presetTransitionTime: number)
   * ```
   * return: Promise<boolean>
   * ```
   * Set the preset transition time for the scene, in ms
   * Does not work on source plugins.
   *
   * #### Usage
   *
   * ```javascript
   *
   * myScene.setPresetTransitionTime(500);
   * ```
   */
  setPresetTransitionTime(presetTransitionTime) {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("Not supported on source plugins"));
      } else if (versionCompare(getVersion()).is.lessThan(scenePresetsVersion)) {
        reject2(Error("Not supported in this XBC version"));
      } else if (typeof presetTransitionTime !== "number") {
        reject2(Error("Parameter must be a number"));
      } else {
        App$1.set("scenepresettransitiontime:" + this._uid, String(presetTransitionTime)).then((value2) => {
          resolve2(value2);
        });
      }
    });
  }
};
_Scene._maxScenes = 12;
_Scene._scenePool = [];
let Scene = _Scene;
const _Output = class _Output {
  constructor(props) {
    this._name = props.name;
  }
  /**
   * param: (id: string)
   *
   * ```
   * return Promise<Output[]>
   * ```
   *
   * Fetch all available Outputs you can broadcast on based on your installed
   * Broadcast plugin.
   *
   * ### Basic Usage
   *
   * ```javascript
   * var xjs = require('xjs');
   *
   * xjs.Output.getOutputList()
   * .then(function(outputs) {
   *   outputs.map(output => {
   *    output.getName()
   *    .then(function(name) {
   *      if(name.includes('Twitch')) {
   *        output.startBroadcast({
   *          suppressPrestreamDialog : true
   *        });
   *      }
   *    })
   *  })
   * })
   * ```
   */
  static getOutputList() {
    return new Promise((resolve2, reject2) => {
      let _checkId;
      if (Environment.isExtension()) {
        _checkId = Extension.getInstance().getId();
      } else if (Environment.isSourcePlugin()) {
        _checkId = Item$1.get("itemlist").then((result) => {
          let results = result.split(",");
          return results[0];
        });
      } else {
        _checkId = new Promise((innerResolve, innerReject) => {
          innerReject(Error("Outputs class is only accessible from Source Plugins and Extensions."));
        });
      }
      _checkId.then((id) => {
        _Output._getBroadcastChannels(id).then((result) => {
          const results = JSON$1.parse(result);
          let channels = [];
          for (var i = 0; i < results.children.length; i++) {
            channels.push(new _Output({
              name: results.children[i]["name"].replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&")
            }));
          }
          resolve2(channels);
        });
      }).catch(function(err) {
        reject2(err);
      });
    });
  }
  /**
   * param: scene<number|Scene>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets a scene to record. Set to live scene or blank string to reset
   */
  static setSceneToRecord(scene) {
    return new Promise((resolve2, reject2) => {
      if (scene === "" || scene === Scene.liveScene()) {
        exec("CallHostFunc", "setSceneToRecord", "-1");
        resolve2(true);
      } else if (scene instanceof Scene) {
        scene.getSceneIndex().then((sceneIndex) => {
          exec("CallHostFunc", "setSceneToRecord", Number(sceneIndex));
          resolve2(true);
        }).catch((err) => {
          reject2(err);
        });
      } else if (typeof scene === "number") {
        if (scene < 1 || !Number["isInteger"](Number(scene))) {
          reject2(Error("Invalid parameters. Valid range is greater than 0."));
        } else {
          exec("CallHostFunc", "setSceneToRecord", String(scene - 1));
          resolve2(true);
        }
      } else {
        reject2(Error("Invalid parameters. Valid range is greater than 0 or a Scene object."));
      }
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Start a local recording.
   */
  static startLocalRecording() {
    return new Promise((resolve2) => {
      exec("CallHostFunc", "startBroadcast", "Local Recording", "suppressPrestreamDialog=1");
      resolve2(true);
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Unpause a local recording.
   */
  static stopLocalRecording() {
    return new Promise((resolve2) => {
      exec("CallHost", "stopBroadcast", "Local Recording");
      resolve2(true);
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Pause a local recording.
   */
  static pauseLocalRecording() {
    return new Promise((resolve2) => {
      exec("CallHost", "pauseRecording", "Local Recording");
      resolve2(true);
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Unpause a local recording.
   */
  static unpauseLocalRecording() {
    return new Promise((resolve2) => {
      exec("CallHost", "unpauseRecording", "Local Recording");
      resolve2(true);
    });
  }
  /**
   *  return: Promise<string>
   *
   *  Gets the actual name of the Output.
   */
  getName() {
    return new Promise((resolve2) => {
      resolve2(this._name);
    });
  }
  /**
   *  return: Promise<string>
   *
   *  Gets the name of the Output as displayed in the Outputs menu.
   */
  getDisplayName() {
    return new Promise((resolve2) => {
      _Output._getBroadcastChannels(_Output._id, this._name).then((channelJXON) => {
        channelJXON["displayName"] = channelJXON["displayName"] ? channelJXON["displayName"].replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&") : this._name;
        resolve2(channelJXON["displayName"]);
      });
    });
  }
  /**
   * param: ([options]) -- see below
   *
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Start a broadcast of the provided channel.
   *
   * Accepts an optional JSON object argument,
   * which can be used to indicate certain flags, such as (additional options may be added):
   * - `suppressPrestreamDialog` : used to bypass the showing of the pre-stream dialog
   *  of the outputs supporting it, will use last settings provided
   */
  startBroadcast(optionBag) {
    return new Promise((resolve2) => {
      if (versionCompare(getVersion()).is.greaterThanOrEqualTo(handlePreStreamDialogFixVersion) && typeof optionBag !== "undefined" && optionBag !== null && optionBag["suppressPrestreamDialog"]) {
        exec("CallHostFunc", "startBroadcast", this._name, "suppressPrestreamDialog=1");
        resolve2(true);
      } else {
        exec("CallHost", "startBroadcast", this._name);
        resolve2(true);
      }
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Stop a broadcast of the provided channel.
   */
  stopBroadcast() {
    return new Promise((resolve2) => {
      exec("CallHost", "stopBroadcast", this._name);
      resolve2(true);
    });
  }
  /**
   * ** For Deprecation, please use the static method instead
   *
   * return: Promise<boolean>
   *
   * Pause a local recording.
   */
  pauseLocalRecording() {
    return new Promise((resolve2, reject2) => {
      if (this._name === "Local Recording") {
        StreamInfo.getActiveStreamChannels().then((channels) => {
          _Output._localRecording = false;
          for (var i = 0; i < channels.length; i++) {
            if (channels[i]["_name"] === "Local Recording") {
              _Output._localRecording = true;
              break;
            }
          }
          if (_Output._localRecording) {
            exec("CallHost", "pauseRecording");
            resolve2(true);
          } else {
            reject2(Error("Local recording is not active."));
          }
        });
      } else {
        reject2(Error("Output is not a local recording"));
      }
    });
  }
  /**
   * ** For Deprecation, please use the static method instead
   *
   * return: Promise<boolean>
   *
   * Unpause a local recording.
   */
  unpauseLocalRecording() {
    return new Promise((resolve2, reject2) => {
      if (this._name === "Local Recording") {
        StreamInfo.getActiveStreamChannels().then((channels) => {
          _Output._localRecording = false;
          for (var i = 0; i < channels.length; i++) {
            if (channels[i]["_name"] === "Local Recording") {
              _Output._localRecording = true;
              break;
            }
          }
          if (_Output._localRecording) {
            exec("CallHost", "unpauseRecording");
            resolve2(true);
          } else {
            reject2(Error("Local recording is not active."));
          }
        });
      } else {
        reject2(Error("Output is not a local recording"));
      }
    });
  }
  static _getBroadcastChannels(id, ...args) {
    let callback = null;
    let name;
    let callbackName;
    if (args.length === 1) {
      if (typeof args[0] === "string") {
        name = args[0];
        callbackName = id + "_" + name;
        _Output._id = id;
      }
    } else if (args.length === 2) {
      if (typeof args[0] === "string") {
        name = args[0];
        callbackName = id + "_" + name;
        _Output._id = id;
      } else {
        _Output._id = id;
      }
      if (args[1] instanceof Function) {
        callback = args[1];
      }
    } else {
      _Output._id = id;
    }
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        let isID = /^{[A-F0-9\-]*}$/i.test(_Output._id);
        if (!isID) {
          reject2(Error("Not a valid ID format for items"));
        }
      }
      if (Remote.remoteType === "remote") {
        let message = {
          type: "broadcastChannels",
          id,
          name: name ? name : void 0
        };
        Extension._remoteCallback[name ? callbackName : _Output._id] = { resolve: resolve2 };
        Remote.sendMessage(encodeURIComponent(JSON.stringify(message)));
      } else if (Remote.remoteType === "proxy") {
        if (_Output._proxyCallback[name ? callbackName : _Output._id] === void 0) {
          _Output._proxyCallback[name ? callbackName : _Output._id] = [];
        }
        _Output._proxyCallback[name ? callbackName : _Output._id] = callback;
        name ? exec("CallHostFunc", "getBroadcastChannelXml", name, "0", (channelXML) => {
          window$1.SetBroadcastChannelXml(channelXML, name);
        }) : exec("CallHostFunc", "getBroadcastChannelList", window$1.SetBroadcastChannelList);
      } else {
        if (_Output._callback[name ? callbackName : _Output._id] === void 0) {
          _Output._callback[name ? callbackName : _Output._id] = [];
        }
        _Output._callback[name ? callbackName : _Output._id] = { resolve: resolve2 };
        name ? exec("CallHostFunc", "getBroadcastChannelXml", name, "0", (channelXML) => {
          window$1.SetBroadcastChannelXml(channelXML, name);
        }) : exec("CallHostFunc", "getBroadcastChannelList", window$1.SetBroadcastChannelList);
      }
    });
  }
  static _finalCallback(message) {
    return new Promise((resolve2) => {
      const result = JSON.parse(decodeURIComponent(message));
      Extension._remoteCallback[_Output._id].resolve(result["result"]);
    });
  }
};
_Output._callback = {};
_Output._remoteCallback = {};
_Output._proxyCallback = {};
_Output._localRecording = false;
let Output = _Output;
const oldSetBroadcastChannelList = window$1.SetBroadcastChannelList;
window$1.SetBroadcastChannelList = function(channels) {
  if (Remote.remoteType === "proxy") {
    Output._proxyCallback[Output._id].call(this, channels);
  } else {
    Output._callback[Output._id].resolve(channels);
  }
  if (typeof oldSetBroadcastChannelList === "function") {
    oldSetBroadcastChannelList(channels);
  }
};
const oldSetBroadcastChannelXml = window$1.SetBroadcastChannelXml;
window$1.SetBroadcastChannelXml = function(channelXML, name) {
  const channelJXON = JSON$1.parse(channelXML);
  channelJXON["name"] = channelJXON["name"] ? channelJXON["name"] : name;
  channelJXON["displayName"] = channelJXON["displayName"] ? channelJXON["displayName"] : name;
  channelJXON["name"] = channelJXON["name"].replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  if (Remote.remoteType === "proxy") {
    Output._proxyCallback[Output._id + "_" + channelJXON["name"]].call(this, channelXML);
  } else {
    Output._callback[Output._id + "_" + channelJXON["name"]].resolve(channelJXON);
  }
  if (typeof oldSetBroadcastChannelXml === "function") {
    oldSetBroadcastChannelXml(channelXML);
  }
};
const _Remote = class _Remote {
  /**
   * param: (value: string) / remoteType
   *
   * Allows user to set the remoteType.
   * May be used for instances that the extension may need to call a method locally.
   *
   * `Note: This may break handling of calls if the type is not returned to its original assignment`
   */
  static setRemoteType(val) {
    let xbcPattern = /XSplit Broadcaster\s(.*?)\s/;
    const isInXBC = navigator.appVersion.match(xbcPattern);
    return new Promise((resolve2, reject2) => {
      if (_Remote._RemoteTypes.indexOf(val) > -1 && isInXBC && val !== _Remote.remoteType) {
        resolve2(true);
      } else {
        reject2(Error("Unable to change the remoteType: Make sure the type is correct and the extension is in XBC."));
      }
    });
  }
  /**
   * param: (value: connection)
   *
   * Allows reassigning of `Remote.sendMessage` for instances when sending messages
   * is replaced.
   */
  static setSendMessage(newSendMessage) {
    return new Promise((resolve2) => {
      _Remote.sendMessage = newSendMessage;
      resolve2(true);
    });
  }
  /**
   * param: (value: string)
   *
   * Handles received messages to properly relay it to either the proxy
   * and make the actual calls, or remote and return the results from
   * proxy.
   *
   */
  static receiveMessage(message) {
    let messageObj = {};
    return new Promise((resolve2, reject2) => {
      if (_Remote.remoteType === "remote" && !_Remote._isVersion && message.indexOf("setVersion") !== -1) {
        _Remote._isVersion = true;
        let mockVersion2 = message;
        let msgArray = message.split("::");
        if (typeof msgArray[1] !== "undefined") {
          mockVersion2 = msgArray[1];
        }
        resolve2(finishReady({ version: mockVersion2 }));
      } else if (_Remote.remoteType === "proxy" && message !== void 0 && message === "getVersion") {
        _Remote.sendMessage("setVersion::" + window.navigator.appVersion);
        resolve2(true);
      } else if (_Remote.remoteType === "local") {
        reject2(Error("Remote calls do not work on local mode."));
      }
      if (message !== void 0) {
        try {
          messageObj = JSON.parse(decodeURIComponent(message));
        } catch (e) {
        }
      }
      if (Object.keys(messageObj).length !== 0) {
        switch (messageObj["type"]) {
          case "exec":
            _Remote._execHandler(message);
            break;
          case "event-emitter":
            _Remote._eventEmitterHandler(message);
            break;
          case "event-manager":
            _Remote._eventManagerHandler(message);
            break;
          case "window":
            _Remote._allWindowHandler(message);
            break;
          case "extWindow":
            _Remote._allWindowHandler(message);
            break;
          case "broadcastChannels":
            _Remote._allWindowHandler(message);
            break;
          default:
            reject2(Error("Call type is undefined."));
            break;
        }
      }
    });
  }
  // Handle exec messages
  static _execHandler(message) {
    return new Promise((resolve2) => {
      if (_Remote.remoteType === "remote") {
        finalCallback(decodeURIComponent(message)).then((result) => {
          resolve2(result);
        });
      } else if (_Remote.remoteType === "proxy") {
        let messageObj = {};
        return new Promise((resolve22, reject2) => {
          messageObj = JSON.parse(decodeURIComponent(message));
          messageObj["callback"] = ((result) => {
            let retObj = {
              result,
              asyncId: Number(messageObj["asyncId"]),
              type: "exec"
            };
            resolve22(
              _Remote.sendMessage(
                encodeURIComponent(JSON.stringify(retObj))
              )
            );
          });
          let messageArr = [
            messageObj["funcName"],
            ...messageObj["args"],
            messageObj["callback"]
          ];
          exec.apply(this, messageArr);
        });
      }
    });
  }
  // Handle emit on/off events
  static _eventEmitterHandler(message) {
    return new Promise((resolve2) => {
      if (_Remote.remoteType === "remote") {
        EventEmitter._finalCallback(message);
      } else if (_Remote.remoteType === "proxy") {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj["callback"] = ((result) => {
          let retObj = {
            result,
            type: "event-emitter",
            id: messageObj["id"],
            event: messageObj["event"]
          };
          resolve2(
            _Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
            )
          );
        });
        let messageArr = [
          messageObj["event"],
          messageObj["callback"],
          messageObj["id"]
        ];
        EventEmitter._setCallback.call(this, messageArr);
      }
    });
  }
  static _eventManagerHandler(message) {
    return new Promise((resolve2) => {
      if (_Remote.remoteType === "remote") {
        EventManager._finalCallback(message);
      } else if (_Remote.remoteType === "proxy") {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj["callback"] = ((result) => {
          let retObj = {
            result,
            type: "event-manager",
            id: messageObj["id"],
            event: messageObj["event"]
          };
          resolve2(
            _Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
            )
          );
        });
        let messageArr = [
          messageObj["event"],
          messageObj["callback"],
          messageObj["id"]
        ];
        EventManager._setCallback.call(this, messageArr);
      }
    });
  }
  static _allWindowHandler(message) {
    return new Promise((resolve2) => {
      if (_Remote.remoteType === "remote") {
        let messageObj = JSON.parse(decodeURIComponent(message));
        if (messageObj["type"] === "window") {
          IO._finalCallback(message);
        } else if (messageObj["type"] === "extWindow") {
          Extension._finalCallback(message);
        } else if (messageObj["type"] === "broadcastChannels") {
          Output._finalCallback(message);
        } else if (messageObj["type"] === "event-manager") {
          EventManager._finalCallback(message);
        }
      } else if (_Remote.remoteType === "proxy") {
        let messageObj = JSON.parse(decodeURIComponent(message));
        messageObj["callback"] = ((result) => {
          let retObj = {
            result,
            file: messageObj["file"],
            type: messageObj["type"]
          };
          resolve2(
            _Remote.sendMessage(
              encodeURIComponent(JSON.stringify(retObj))
            )
          );
        });
        if (messageObj["type"] === "window") {
          let messageArr = [
            messageObj["file"],
            messageObj["callback"]
          ];
          IO.getVideoDuration.call(this, messageArr);
        } else if (messageObj["type"] === "extWindow") {
          let Ext = messageObj["instance"] = new Extension();
          Ext.getId(messageObj["callback"]);
        } else if (messageObj["type"] === "broadcastChannels") {
          Output._getBroadcastChannels(messageObj["id"], messageObj["name"], messageObj["callback"]);
        } else if (messageObj["type"] === "event-manager") {
          EventManager._finalCallback(messageObj["event"]);
        }
      }
    });
  }
};
_Remote._isVersion = false;
_Remote._RemoteTypes = ["local", "remote", "proxy"];
_Remote.remoteType = "local";
let Remote = _Remote;
let _callbacks = {};
let _proxyCallbacks = {};
let _remoteCallbacks = {};
let counter = 0;
function exec(funcName, ...args) {
  return new Promise((resolve2, reject2) => {
    let callback = null;
    let ret = false;
    if (args.length > 0) {
      callback = args[args.length - 1];
      if (callback instanceof Function) {
        args.pop();
      } else {
        callback = null;
      }
    }
    if (Remote.remoteType === "remote") {
      counter++;
      let message = {};
      if (args.length >= 1) {
        message = {
          funcName,
          args,
          asyncId: counter,
          type: "exec"
        };
      } else {
        message = {
          funcName,
          asyncId: counter,
          type: "exec"
        };
      }
      Remote.sendMessage(encodeURIComponent(JSON.stringify(message)));
    }
    if (window$1.external && window$1.external[funcName] && window$1.external[funcName] instanceof Function) {
      ret = window$1.external[funcName](...args);
    }
    if (callback !== null) {
      if (Remote.remoteType === "remote") {
        _remoteCallbacks[counter] = callback;
      } else if (Remote.remoteType === "proxy") {
        _proxyCallbacks[ret] = callback;
      } else {
        _callbacks[ret] = callback;
      }
    } else {
      if (Remote.remoteType === "remote") {
        _remoteCallbacks[counter] = (result) => {
          resolve2(result);
        };
      }
    }
    if (Remote.remoteType === "proxy" && typeof ret !== "number") {
      if (_proxyCallbacks[ret] !== void 0) {
        let result = _proxyCallbacks[ret](decodeURIComponent(ret));
        delete _proxyCallbacks[ret];
        resolve2(result);
      } else {
        resolve2(ret);
      }
    } else if (Remote.remoteType === "local") {
      resolve2(ret);
    }
  });
}
function finalCallback(message) {
  return new Promise((resolve2) => {
    const result = JSON.parse(message);
    if (typeof result["asyncId"] === "number" && _remoteCallbacks[result["asyncId"]] !== void 0) {
      _remoteCallbacks[result["asyncId"]](result["result"]);
      delete _remoteCallbacks[result["asyncId"]];
    } else {
      resolve2(result["result"]);
    }
  });
}
let asyncCallback = window$1.OnAsyncCallback;
window$1.OnAsyncCallback = function(asyncID, ...result) {
  let formattedResult;
  try {
    formattedResult = result.map((res) => decodeURIComponent(res));
  } catch (e) {
    formattedResult = result;
  }
  if (Remote.remoteType === "proxy") {
    let callback = _proxyCallbacks[asyncID];
    if (callback instanceof Function) {
      callback(...formattedResult);
      delete _proxyCallbacks[asyncID];
    }
  } else {
    let callback = _callbacks[asyncID];
    if (callback instanceof Function) {
      callback(...formattedResult);
      delete _callbacks[asyncID];
    }
  }
  if (typeof asyncCallback === "function") {
    asyncCallback(asyncID, ...result);
  }
};
const _IO = class _IO {
  /**
   * param: (path: string)
   * ```
   * return: Promise<string>
   * ```
   *
   * Returns a base-64 encoded string of the target file's contents.
   * UTF-8 encoded files may be decoded through:
   * ```javascript
   * IO.getFileContent('C:\\text.txt').then(function(base64Content) {
   *   var actualContent = decodeURIComponent(escape(window.atob(base64Content));
   * });
   * ```
   */
  static getFileContent(path) {
    return new Promise((resolve2) => {
      resolve2(exec("GetFileContent", path));
    });
  }
  /**
   * param: (url: string)
   * ```
   * return: Promise<string>
   * ```
   *
   * Returns a base-64 encoded string of the target endpoint's contents.
   * Redirects are resolved, and this bypasses access-control-allow-origin.
   *
   * UTF-8 encoded content may be decoded through:
   * ```javascript
   * IO.getWebContent('http://example.com').then(function(base64Content) {
   *   var actualContent = decodeURIComponent(escape(window.atob(base64Content));
   * });
   * ```
   */
  static getWebContent(url) {
    return new Promise((resolve2) => {
      exec("GetWebContent", url, (encoded) => {
        resolve2(encoded);
      });
    });
  }
  /**
   * param: (url: string)
   *
   * Opens a URL in the user's default browser. URL must specify HTTP or HTTPS.
   *
   */
  static openUrl(url) {
    return new Promise((resolve2) => {
      exec("OpenUrl", url).then((res) => {
        resolve2(res);
      });
    });
  }
  /**
   * param: ([options] [, filter]) -- see below
   * ```
   * return: Promise<string[]>
   * ```
   * Opens a file dialog for the user to select a file (or multiple files).
   * Resolves with an array of strings, each of which contains the full path
   * and filename of a selected file. Rejects when the dialog is canceled.
   *
   * The first (optional) argument is a JSON object that can be used to indicate
   * that certain flags should be true. These are documented as follows:
   * - `allowMultiSelect`: allows users to select multiple files.
   * - `fileMustExist`: prevents users from typing a name of a nonexistent file
   * - `forceShowHidden`: lets the dialog show files marked as System or Hidden
   *  (but not both)
   *
   * The second argument (also optional) is a JSON object used to specify the
   * filter for items to be displayed. It takes two members:
   * - `name`: the description of the filter (for example: Image Files)
   * - `extensions`: an array of file extensions (for example: `['jpg','bmp']`);
   */
  static openFileDialog(optionBag, filter) {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("function is not available for source"));
      } else {
        let flags = 0;
        if (optionBag !== void 0 && optionBag !== null) {
          if (optionBag.allowMultiSelect === true) {
            flags = flags | _IO._ALLOW_MULTI_SELECT;
          }
          if (optionBag.fileMustExist === true) {
            flags = flags | _IO._FILE_MUST_EXIST;
          }
          if (optionBag.forceShowHidden === true) {
            flags = flags | _IO._FORCE_SHOW_HIDDEN;
          }
        }
        let filterString = "";
        if (filter !== void 0 && filter !== null && filter.name !== void 0 && filter.extensions !== void 0) {
          filterString = filter.name + "|";
          filterString += filter.extensions.map((val) => {
            return "*." + val;
          }).join(";");
          filterString += "||";
        }
        exec(
          "OpenFileDialogAsync",
          null,
          null,
          String(flags),
          filterString,
          (path) => {
            if (path !== "null") {
              resolve2(path.split("|"));
            } else {
              reject2(Error("File selection cancelled."));
            }
          }
        );
      }
    });
  }
  /**
   * param: (file: string)
   *
   * return: Promise<number>
   *
   * Returns the duration of a video file on the local system, specified in
   * units of 10^-7 seconds.
   */
  static getVideoDuration(file) {
    return new Promise((resolve2, reject2) => {
      if (Environment.isSourcePlugin()) {
        reject2(Error("function is not available for source"));
      } else {
        if (typeof file !== "undefined") {
          if (Remote.remoteType === "remote") {
            let message = {
              file,
              type: "window"
            };
            if (_IO._remoteCallback[file] === void 0) {
              _IO._remoteCallback[file] = [];
            }
            _IO._remoteCallback[file].push({ resolve: resolve2, reject: reject2 });
            Remote.sendMessage(encodeURIComponent(JSON.stringify(message)));
          } else if (Remote.remoteType === "proxy") {
            if (_IO._proxyCallback[file[0]] === void 0) {
              _IO._proxyCallback[file[0]] = [];
            }
            _IO._proxyCallback[file[0]].push(file[1]);
            exec("GetVideoDuration", file[0]);
          } else {
            if (_IO._callback[file] === void 0) {
              _IO._callback[file] = [];
            }
            _IO._callback[file].push({ resolve: resolve2, reject: reject2 });
            exec("GetVideoDuration", file);
          }
        } else {
          reject2(Error("No file indicated."));
        }
      }
    });
  }
  static _finalCallback(message) {
    return new Promise((resolve2) => {
      const result = JSON.parse(decodeURIComponent(message));
      if (result["result"] !== void 0) {
        _IO._remoteCallback[result["file"]].shift().resolve(result["result"]);
      } else {
        _IO._remoteCallback[decodeURIComponent(result["file"])].shift().reject(
          Error(`Invalid file path or cannot get file duration: '${decodeURIComponent(result["file"])}'`)
        );
      }
    });
  }
};
_IO._ALLOW_MULTI_SELECT = 512;
_IO._FILE_MUST_EXIST = 4096;
_IO._FORCE_SHOW_HIDDEN = 268435456;
_IO._callback = {};
_IO._remoteCallback = {};
_IO._proxyCallback = {};
let IO = _IO;
const oldOnGetVideoDuration = window$1.OnGetVideoDuration;
window$1.OnGetVideoDuration = function(file, duration) {
  if (Remote.remoteType === "proxy") {
    IO._proxyCallback[decodeURIComponent(file)][0].apply(this, [Number(duration), file]);
  } else {
    IO._callback[decodeURIComponent(file)].shift().resolve(Number(duration));
    if (IO._callback[decodeURIComponent(file)].length === 0) {
      delete IO._callback[decodeURIComponent(file)];
    }
  }
  if (typeof oldOnGetVideoDuration === "function") {
    oldOnGetVideoDuration(file, duration);
  }
};
const oldOnGetVideoDurationFailed = window$1.OnGetVideoDurationFailed;
window$1.OnGetVideoDurationFailed = function(file) {
  if (Remote.remoteType === "proxy") {
    IO._proxyCallback[decodeURIComponent(file)][0].apply(this, [void 0, file]);
  } else {
    IO._callback[decodeURIComponent(file)].shift().reject(
      Error(`Invalid file path or cannot get file duration: '${decodeURIComponent(file)}'`)
    );
    if (IO._callback[decodeURIComponent(file)].length === 0) {
      delete IO._callback[decodeURIComponent(file)];
    }
  }
  if (typeof oldOnGetVideoDurationFailed === "function") {
    oldOnGetVideoDuration(file);
  }
};
class Thumbnail {
  /**
   * param?: scene<id|Scene|undefined>
   * ```
   * return: Promise<string>
   * ```
   *
   * Returns a base64 png url of a specified or current scene.
   *
   * #### Usage
   *
   * ```javascript
   * var sceneThumbnail
   *
   * Thumbnail.getSceneThumbnail().then(function(image) {
   *   sceneThumbnail = image;
   *   // can be used as:
   *   // div.style.backgroundImage = 'url(data:image/png;base64, image)'
   * })
   */
  static getSceneThumbnail(scene) {
    let scenePromise;
    return new Promise((resolve2, reject2) => {
      scenePromise = new Promise((innerResolve) => {
        if (scene instanceof Scene) {
          scene.getSceneUid().then((sceneUid) => innerResolve(sceneUid));
        } else if (typeof scene === "number") {
          if (scene < 0) {
            reject2(Error("Invalid parameters. Valid range is 0 or higher"));
          } else {
            Scene.getBySceneIndex(scene).then((curScene) => {
              return curScene.getSceneUid();
            }).then((sceneUid) => {
              innerResolve(sceneUid);
            });
          }
        } else if (!scene) {
          Scene.getActiveScene().then((curScene) => {
            return curScene.getSceneUid();
          }).then((sceneUid) => {
            innerResolve(sceneUid);
          });
        } else {
          reject2(Error("Invalid parameters. Valid parameter is scene or scene index"));
        }
      });
      scenePromise.then((sceneUid) => {
        App$1.get(`scenethumbnail:${sceneUid}`).then((thumb) => {
          resolve2(thumb);
        });
      });
    });
  }
}
var DEFAULT_SILENCE_DETECTION_THRESHOLD = 5;
var DEFAULT_SILENCE_DETECTION_PERIOD = 1e3;
const arrayToObj = function(array, separator) {
  var obj = {};
  array.map(function(el) {
    var separatorIndex = el.indexOf(separator);
    var key = el.substring(0, separatorIndex);
    obj[key] = el.substring(separatorIndex + 1);
  });
  return obj;
};
class App {
  /**
   * return: Promise<number>
   *
   * Gets application's frame time (duration per frame in 100ns unit)
   *
   * #### Usage
   *
   * ```javascript
   * App.getFrameTime().then(function(res) {
   *   var frameTime = res;
   * });
   * ```
   */
  getFrameTime() {
    return new Promise((resolve2) => {
      App$1.get("frametime").then((val) => {
        resolve2(Number(val));
      });
    });
  }
  /**
   * Compatibility alias for older examples and functional tests.
   */
  getFrametime() {
    return this.getFrameTime();
  }
  /**
   * return: Promise<Rectangle>
   *
   * Gets application default output resolution in pixels.
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   *
   * #### Usage
   *
   * ```javascript
   * App.getResolution().then(function(res) {
   *   var height = res.getHeight();
   *   var width = res.getWidth();
   * });
   * ```
   */
  getResolution() {
    return new Promise((resolve2) => {
      App$1.get("resolution").then((val) => {
        var dimensions = val.split(",");
        resolve2(Rectangle.fromDimensions(
          parseInt(dimensions[0]),
          parseInt(dimensions[1])
        ));
      });
    });
  }
  /**
   * return: Promise<Rectangle>
   *
   * Gets application viewport display resolution
   *
   * See also: {@link #util/Rectangle Util/Rectangle}
   *
   * #### Usage
   *
   * ```javascript
   * App.getViewport().then(function(res) {
   *   var height = res.getHeight();
   *   var width = res.getWidth();
   * });
   * ```
   */
  getViewport() {
    return new Promise((resolve2) => {
      App$1.get("viewport").then((val) => {
        var dimensions = val.split(",");
        resolve2(Rectangle.fromDimensions(
          parseInt(dimensions[0]),
          parseInt(dimensions[1])
        ));
      });
    });
  }
  /**
   * return: Promise<string>
   *
   * Refers to XSplit Broadcaster version number
   *
   * #### Usage
   *
   * ```javascript
   * App.getVersion().then(function(res) {
   *   var version = res;
   * });
   * ```
   */
  getVersion() {
    return new Promise((resolve2, reject2) => {
      try {
        resolve2(getVersion());
      } catch (error) {
        reject2(error);
      }
    });
  }
  /**
   * return: Promise<number>
   *
   * Gets the total number of frames rendered
   *
   * #### Usage
   *
   * ```javascript
   * App.getFramesRendered().then(function(res) {
   *   var framesrendered = res;
   * });
   * ```
   */
  getFramesRendered() {
    return new Promise((resolve2) => {
      App$1.get("framesrendered").then((val) => {
        resolve2(Number(val));
      });
    });
  }
  // Audio Services
  /**
   * return: Promise<AudioDevice[]>
   *
   * Gets the primary microphone device used in the application
   *
   * See also: {@link #system/AudioDevice System/AudioDevice}
   *
   * ### Usage
   *
   * ```javascript
   * App.getPrimaryMic().then(function(audioDevice) {
   *   var primaryMic = audioDevice;
   * });
   * ```
   */
  getPrimaryMic() {
    return new Promise((resolve2, reject2) => {
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 0) {
          resolve2(audioDevices[0]);
        } else {
          reject2(Error("No audio device is set as primary microphone"));
        }
      });
    });
  }
  /**
   * return: Promise<AudioDevice[]>
   *
   * Gets the primary speaker/audio render device used in the application
   *
   * See also: {@link #system/AudioDevice System/AudioDevice}
   *
   * ### Usage
   *
   * ```javascript
   * App.getPrimarySpeaker().then(function(audioDevice) {
   *   var primarySpeaker = audioDevice;
   * });
   * ```
   */
  getPrimarySpeaker() {
    return new Promise((resolve2, reject2) => {
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 1) {
          resolve2(audioDevices[1]);
        } else {
          reject2(Error("No audio device is set as primary speaker"));
        }
      });
    });
  }
  /**
   * param: volume<number> (0 to 100 normal range, > 100 will boost volume level)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets the application audio level of the primary microphone set
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimaryMicLevel(volume).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimaryMicLevel(volume) {
    return new Promise((resolve2, reject2) => {
      if (volume < 0) {
        reject2(Error("Volume can only be positive"));
      }
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 0) {
          var micDevice = audioDevices[0];
          micDevice._setLevel(volume);
          audioDevices[0] = micDevice;
          var dev = "";
          if (Array.isArray(audioDevices)) {
            for (var i = 0; i < audioDevices.length; ++i) {
              dev += audioDevices[i].toString();
            }
          }
          dev = "<devices>" + dev + "</devices>";
          App$1.set("microphonedev2", dev).then((setVal) => {
            resolve2(setVal);
          });
        } else {
          reject2(Error("No audio device is set as primary microphone"));
        }
      });
    });
  }
  /**
   * param: enabled<boolean>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets whether the primary microphone set is enabled or disabled in the applicaation
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimaryMicEnabled(enabled).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimaryMicEnabled(enabled) {
    return new Promise((resolve2, reject2) => {
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 0) {
          var micDevice = audioDevices[0];
          micDevice._setEnabled(enabled);
          audioDevices[0] = micDevice;
          var dev = "";
          if (Array.isArray(audioDevices)) {
            for (var i = 0; i < audioDevices.length; ++i) {
              dev += audioDevices[i].toString();
            }
          }
          dev = "<devices>" + dev + "</devices>";
          App$1.set("microphonedev2", dev).then((setVal) => {
            resolve2(setVal);
          });
        } else {
          reject2(Error("No audio device is set as primary microphone"));
        }
      });
    });
  }
  /**
   * param: volume<number> (0 to 100)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets the system audio level of the primary microphone set
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimaryMicSystemLevel(volume).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimaryMicSystemLevel(volume) {
    return new Promise((resolve2, reject2) => {
      if (volume < 0) {
        reject2(Error("Volume can only be positive"));
      }
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 0) {
          var micDevice = audioDevices[0];
          micDevice._setSystemLevel(volume);
          audioDevices[0] = micDevice;
          var dev = "";
          if (Array.isArray(audioDevices)) {
            for (var i = 0; i < audioDevices.length; ++i) {
              dev += audioDevices[i].toString();
            }
          }
          dev = "<devices>" + dev + "</devices>";
          App$1.set("microphonedev2", dev).then((setVal) => {
            resolve2(setVal);
          });
        } else {
          reject2(Error("No audio device is set as primary microphone"));
        }
      });
    });
  }
  /**
   * param: hwenabled<number> (0 or 1, or set to 255 to avoid mute change)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets whether the primary microphone set is enabled or disabled in the system
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimaryMicSystemEnabled(enabled).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimaryMicSystemEnabled(hwenabled) {
    return new Promise((resolve2, reject2) => {
      if (hwenabled !== 0 && hwenabled !== 1 && hwenabled !== 255) {
        reject2(Error("Value can only be 0, 1 or 255"));
      }
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 0) {
          var micDevice = audioDevices[0];
          micDevice._setSystemEnabled(hwenabled);
          audioDevices[0] = micDevice;
          var dev = "";
          if (Array.isArray(audioDevices)) {
            for (var i = 0; i < audioDevices.length; ++i) {
              dev += audioDevices[i].toString();
            }
          }
          dev = "<devices>" + dev + "</devices>";
          App$1.set("microphonedev2", dev).then((setVal) => {
            resolve2(setVal);
          });
        } else {
          reject2(Error("No audio device is set as primary microphone"));
        }
      });
    });
  }
  /**
   * param: delay<number> (100 nanoseconds in units)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets the loopback capture delay of the primary microphone set
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimaryMicDelay(delay).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimaryMicDelay(delay) {
    return new Promise((resolve2, reject2) => {
      if (delay < 0) {
        reject2(Error("Delay can only be positive"));
      }
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 0) {
          var micDevice = audioDevices[0];
          micDevice._setDelay(delay);
          audioDevices[0] = micDevice;
          var dev = "";
          if (Array.isArray(audioDevices)) {
            for (var i = 0; i < audioDevices.length; ++i) {
              dev += audioDevices[i].toString();
            }
          }
          dev = "<devices>" + dev + "</devices>";
          App$1.set("microphonedev2", dev).then((setVal) => {
            resolve2(setVal);
          });
        } else {
          reject2(Error("No audio device is set as primary microphone"));
        }
      });
    });
  }
  /**
   * param: volume<number> (0 to 100 normal range, > 100 will boost volume level)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets the application audio level of the primary speaker/audio render device
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimarySpeakerLevel(volume).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimarySpeakerLevel(volume) {
    return new Promise((resolve2, reject2) => {
      if (volume < 0) {
        reject2(Error("Volume can only be positive"));
      }
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 1) {
          var speakerDevice = audioDevices[1];
          speakerDevice._setLevel(volume);
          audioDevices[1] = speakerDevice;
          var dev = "";
          if (Array.isArray(audioDevices)) {
            for (var i = 0; i < audioDevices.length; ++i) {
              dev += audioDevices[i].toString();
            }
          }
          dev = "<devices>" + dev + "</devices>";
          App$1.set("microphonedev2", dev).then((setVal) => {
            resolve2(setVal);
          });
        } else {
          reject2(Error("No audio device is set as primary speaker/audio render device"));
        }
      });
    });
  }
  /**
   * param: enabled<boolean>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets whether the primary speaker/audio render device set is enabled or disabled in the applicaation
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimarySpeakerEnabled(enabled).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimarySpeakerEnabled(enabled) {
    return new Promise((resolve2, reject2) => {
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 1) {
          var speakerDevice = audioDevices[1];
          speakerDevice._setEnabled(enabled);
          audioDevices[1] = speakerDevice;
          var dev = "";
          if (Array.isArray(audioDevices)) {
            for (var i = 0; i < audioDevices.length; ++i) {
              dev += audioDevices[i].toString();
            }
          }
          dev = "<devices>" + dev + "</devices>";
          App$1.set("microphonedev2", dev).then((setVal) => {
            resolve2(setVal);
          });
        } else {
          reject2(Error("No audio device is set as primary speaker/audio render device"));
        }
      });
    });
  }
  /**
   * param: volume<number> (0 to 100)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets the system audio level of the primary speaker/audio render device set
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimarySpeakerSystemLevel(volume).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimarySpeakerSystemLevel(volume) {
    return new Promise((resolve2, reject2) => {
      if (volume < 0) {
        reject2(Error("Volume can only be positive"));
      }
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 1) {
          var speakerDevice = audioDevices[1];
          speakerDevice._setSystemLevel(volume);
          audioDevices[1] = speakerDevice;
          var dev = "";
          if (Array.isArray(audioDevices)) {
            for (var i = 0; i < audioDevices.length; ++i) {
              dev += audioDevices[i].toString();
            }
          }
          dev = "<devices>" + dev + "</devices>";
          App$1.set("microphonedev2", dev).then((setVal) => {
            resolve2(setVal);
          });
        } else {
          reject2(Error("No audio device is set as primary speaker/audio render device"));
        }
      });
    });
  }
  /**
   * param: hwenabled<number> (0 or 1, or set to 255 to avoid mute change)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets whether the primary speaker/audio render device set is enabled or disabled in the system
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimarySpeakerSystemEnabled(enabled).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimarySpeakerSystemEnabled(hwenabled) {
    return new Promise((resolve2, reject2) => {
      if (hwenabled !== 0 && hwenabled !== 1 && hwenabled !== 255) {
        reject2(Error("Value can only be 0, 1 or 255"));
      }
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 1) {
          var speakerDevice = audioDevices[1];
          speakerDevice._setSystemEnabled(hwenabled);
          audioDevices[1] = speakerDevice;
          var dev = "";
          if (Array.isArray(audioDevices)) {
            for (var i = 0; i < audioDevices.length; ++i) {
              dev += audioDevices[i].toString();
            }
          }
          dev = "<devices>" + dev + "</devices>";
          App$1.set("microphonedev2", dev).then((setVal) => {
            resolve2(setVal);
          });
        } else {
          reject2(Error("No audio device is set as primary speaker/audio render device"));
        }
      });
    });
  }
  /**
   * param: delay<number> (100 nanoseconds in units)
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets the loopback capture delay of the primary speaker/audio render device
   *
   * ### Usage
   *
   * ```javascript
   * App.setPrimarySpeakerDelay(delay).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setPrimarySpeakerDelay(delay) {
    return new Promise((resolve2, reject2) => {
      if (delay < 0) {
        reject2(Error("Delay can only be positive"));
      }
      App$1.getAsList("microphonedev2").then((arr) => {
        var audioDevices = arr.map((val) => {
          return AudioDevice.parse(val);
        });
        if (audioDevices.length && audioDevices.length > 1) {
          var speakerDevice = audioDevices[1];
          speakerDevice._setDelay(delay);
          audioDevices[1] = speakerDevice;
          var dev = "";
          if (Array.isArray(audioDevices)) {
            for (var i = 0; i < audioDevices.length; ++i) {
              dev += audioDevices[i].toString();
            }
          }
          dev = "<devices>" + dev + "</devices>";
          App$1.set("microphonedev2", dev).then((setVal) => {
            resolve2(setVal);
          });
        } else {
          reject2(Error("No audio device is set as primary speaker/audio render device"));
        }
      });
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Gets whether silence detection is enabled
   *
   * ### Usage
   *
   * ```javascript
   * App.isSilenceDetectionEnabled().then(function(val) {
   *   var isEnabled = val;
   * });
   * ```
   */
  isSilenceDetectionEnabled() {
    return new Promise((resolve2) => {
      App$1.get("microphonegain").then((val) => {
        var micGainObj = JSON$1.parse(val);
        resolve2(micGainObj["enable"] == "1");
      });
    });
  }
  /**
   * param: enabled<boolean>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Enables or disables silence detection
   *
   * ### Usage
   *
   * ```javascript
   * App.enableSilenceDetection(enabled).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  enableSilenceDetection(enabled) {
    return new Promise((resolve2) => {
      App$1.get("microphonegain").then((val) => {
        var silenceDetectionObj = JSON$1.parse(val);
        silenceDetectionObj["enable"] = enabled ? "1" : "0";
        App$1.set("microphonegain", XML.parseJSON(silenceDetectionObj).toString()).then((setVal) => {
          resolve2(setVal);
        });
      });
    });
  }
  /**
   * return: Promise<number>
   *
   * Gets silence detection period,
   * the length of time after voice detection before silence is again detected
   *
   * ### Usage
   *
   * ```javascript
   * App.getSilenceDetectionPeriod().then(function(val) {
   *   var silenceDetectionPeriod = val;
   * });
   * ```
   */
  getSilenceDetectionPeriod() {
    return new Promise((resolve2) => {
      App$1.get("microphonegain").then((val) => {
        var micGainObj = JSON$1.parse(val);
        resolve2(micGainObj["latency"] !== void 0 ? Number(micGainObj["latency"]) : DEFAULT_SILENCE_DETECTION_PERIOD);
      });
    });
  }
  /**
   * param: sdPeriod<number>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets silence detection period (0-60000 ms),
   * the length of time after voice detection before silence is again detected
   *
   * ### Usage
   *
   * ```javascript
   * App.setSilenceDetectionPeriod(sdPeriod).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setSilenceDetectionPeriod(sdPeriod) {
    return new Promise((resolve2, reject2) => {
      if (typeof sdPeriod !== "number") {
        reject2(Error("Silence detection period must be a number"));
      } else if (sdPeriod % 1 != 0) {
        reject2(Error("Silence detection period must be an integer"));
      } else if (sdPeriod < 0 || sdPeriod > 6e4) {
        reject2(Error("Silence detection must be in the range 0-60000."));
      }
      App$1.get("microphonegain").then((val) => {
        var silenceDetectionObj = JSON$1.parse(val);
        silenceDetectionObj["latency"] = sdPeriod.toString();
        App$1.set("microphonegain", XML.parseJSON(silenceDetectionObj).toString()).then((setVal) => {
          resolve2(setVal);
        });
      });
    });
  }
  /**
   * return: Promise<number>
   *
   * Gets silence detection threshold/silence amplitude
   *
   * ### Usage
   *
   * ```javascript
   * App.getSilenceDetectionThreshold().then(function(val) {
   *   var silenceDetectionTfhreshold = val;
   * });
   * ```
   */
  getSilenceDetectionThreshold() {
    return new Promise((resolve2) => {
      App$1.get("microphonegain").then((val) => {
        var micGainObj = JSON$1.parse(val);
        resolve2(micGainObj["gain"] !== void 0 ? Number(micGainObj["gain"]) : DEFAULT_SILENCE_DETECTION_THRESHOLD);
      });
    });
  }
  /**
   * param: sdThreshold<number>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets silence detection threshold/silence amplitude (values from 0-128)
   *
   * ### Usage
   *
   * ```javascript
   * App.setSilenceDetectionThreshold(sdThreshold).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  setSilenceDetectionThreshold(sdThreshold) {
    return new Promise((resolve2, reject2) => {
      if (typeof sdThreshold !== "number") {
        reject2(Error("Silence detection threshold must be a number"));
      } else if (sdThreshold % 1 != 0) {
        reject2(Error("Silence detection threshold must be an integer"));
      } else if (sdThreshold < 0 || sdThreshold > 128) {
        reject2(Error("Silence detection threshold must be in the range 0-128."));
      }
      App$1.get("microphonegain").then((val) => {
        var silenceDetectionObj = JSON$1.parse(val);
        silenceDetectionObj["gain"] = sdThreshold.toString();
        App$1.set("microphonegain", XML.parseJSON(silenceDetectionObj).toString()).then((setVal) => {
          resolve2(setVal);
        });
      });
    });
  }
  /**
   * return: Promise<boolean>
   *
   * Gets whether noise suppression is enabled
   *
   * ### Usage
   *
   * ```javascript
   * App.isNoiseSuppressionEnabled().then(function(val) {
   *   var isEnabled = val;
   * });
   * ```
   */
  isNoiseSuppressionEnabled() {
    return new Promise((resolve2) => {
      exec("CallHostFunc", "getProperty", "sound_ns", (queryString) => {
        var queryParams = queryString.split("&");
        var queryObj = arrayToObj(queryParams, "=");
        resolve2(queryObj["Enabled"] === "1");
      });
    });
  }
  /**
   * param: enabled<boolean>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Enables or disables noise suppression
   *
   * ### Usage
   *
   * ```javascript
   * App.enableNoiseSuppression(enabled).then(function(val) {
   *   var isSet = val;
   * });
   * ```
   */
  enableNoiseSuppression(enabled) {
    return new Promise((resolve2) => {
      exec("CallHostFunc", "setProperty", "sound_ns", `Enabled=${Number(enabled)}`, (setVal) => {
        resolve2(setVal);
      });
    });
  }
  // Transition Services
  /**
   * return: Promise<Transition>
   *
   * Gets the transition for scene changes
   *
   * See also: {@link #core/Transition Core/Transition}
   *
   * #### Usage
   *
   * ```javascript
   * App.getTransition().then(function(res) {
   *   var transitionid = res;
   * });
   * ```
   */
  getTransition() {
    return new Promise((resolve2) => {
      App$1.get("transitionid").then((val) => {
        if (val === "") {
          resolve2(Transition.NONE);
        } else {
          let currTransition = Transition[val.toUpperCase()];
          if (typeof currTransition !== "undefined") {
            resolve2(currTransition);
          } else {
            Transition.getSceneTransitions().then((transitions) => {
              let inTransition = false;
              let transitionObj;
              let i;
              for (i = 0; i < transitions.length; i++) {
                transitionObj = transitions[i];
                if (transitionObj.toString() === val) {
                  inTransition = true;
                  break;
                }
              }
              if (inTransition) {
                resolve2(transitionObj);
              } else {
                resolve2(new Transition(val));
              }
            }).catch((err) => {
              resolve2(new Transition(val));
            });
          }
        }
      });
    });
  }
  /**
     * param: transition<Transition>
     * ```
     * return: Promise<boolean>
     * ```
     *
     * Sets the transition for scene changes
     *
     * See also: {@link #core/Transition Core/Transition}
     *
     * #### Usage
     *
     * ```javascript
     * var xjs = require('xjs'),
     *     Transition = xjs.Transition,
     *     App = new xjs.App();
  
     * App.setTransition(Transition.CLOCK).then(function(val) {
     *  var isSet = val;
     * });
     * ```
     */
  setTransition(transition) {
    return new Promise((resolve2) => {
      App$1.set("transitionid", transition.toString()).then((val) => {
        resolve2(val);
      });
    });
  }
  /**
   * return: Promise<number>
   *
   * Gets the scene transition duration in milliseconds
   *
   * #### Usage
   *
   * ```javascript
   * App.getTransitionTime().then(function(res) {
   *   var transitiontime = res;
   * });
   * ```
   */
  getTransitionTime() {
    return new Promise((resolve2) => {
      App$1.get("transitiontime").then((val) => {
        resolve2(Number(val));
      });
    });
  }
  /**
   * param: time<number>
   * ```
   * return: Promise<boolean>
   * ```
   *
   * Sets the scene transition duration in milliseconds
   *
   * #### Usage
   *
   * ```javascript
   * App.setTransitionTime(time).then(function(val) {
   *  var isSet = val;
   * });
   * ```
   */
  setTransitionTime(time) {
    return new Promise((resolve2) => {
      App$1.set("transitiontime", time.toString()).then((val) => {
        resolve2(val);
      });
    });
  }
  /**
   * return: Promise<boolean>
   *
   *  Clears all cookies across all browser instances. Not available to
   *  source plugins (call this from the source properties window instead.)
   *
   * #### Usage
   *
   * ```javascript
   * App.clearBrowserCookies().then(function(val) {
   *  var isCleared = val;
   * });
   * ```
   */
  clearBrowserCookies(cookiePath) {
    return new Promise((resolve2, reject2) => {
      if (cookiePath && cookiePath !== "" && typeof window.external["CallHostFunc"] === "function") {
        exec("CallHostFunc", "deleteCookie", cookiePath);
      } else if (Environment.isSourcePlugin()) {
        reject2(Error("This method is not available to source plugins."));
      } else {
        exec("CallHost", "deletecookie:videoitemprop");
      }
      resolve2(true);
    });
  }
  /**
   * return: Promise<string>
   *
   * Returns a hashed string that may be used to differentiate among logged-in
   * users. This will be useful in such cases as persisting data to be used by
   * certain XSplit users only.
   */
  getUserIdHash() {
    return new Promise((resolve2) => {
      App$1.getGlobalProperty("userid").then((res) => {
        resolve2(res);
      });
    });
  }
}
const _LanguageInfo = class _LanguageInfo extends EventEmitter {
  /**
   * param: (event:string, ...params: any[])
   *
   * Allows this class to emit an event.
   */
  static emit(event, ...params) {
    params.unshift(event);
    _LanguageInfo._emitter.emit.apply(_LanguageInfo._emitter, params);
  }
  /**
   * param: (event: string, handler: Function)
   *
   * Allows listening to the event this class emits.
   *
   * #### Usage:
   *
   * ```javascript
   * xjs.LanguageInfo.on('language-change', function(res) {
   *   var lang = res
   *   //Do other manipulation here
   * })
   * ```
   *
   */
  static on(event, handler) {
    _LanguageInfo._emitter.on(event, (lang) => {
      handler.call(this, { lang });
    });
  }
  static getCode() {
    return new Promise((resolve2) => {
      exec("CallHostFunc", "getProperty", "html:language", (langCode) => {
        resolve2(langCode);
      });
    });
  }
};
_LanguageInfo._emitter = new _LanguageInfo();
let LanguageInfo = _LanguageInfo;
EventManager.subscribe(
  ["LanguageChanged"],
  (langObj) => {
    let eventString;
    if (langObj.hasOwnProperty("event") && langObj.hasOwnProperty("lang")) {
      eventString = langObj["event"];
      if (langObj["event"] === "LanguageChanged") {
        eventString = "language-change";
      }
      LanguageInfo.emit(eventString, langObj["lang"]);
    }
  }
);
class Url {
  /**
   *  param: (url: string)
   *
   *  Creates a URL object. If unspecified, protocol is http.
   */
  constructor(url) {
    this._url = url;
  }
  _getUrl() {
    return new Promise((resolve2, reject2) => {
      if (/^https?:\/\//i.test(this._url)) {
        resolve2(this._url);
      } else if (/[a-z]+:\/\//i.test(this._url)) {
        reject2(Error("You may only add HTTP or HTTPS URLs to the stage."));
      } else {
        resolve2("http://" + this._url);
      }
    });
  }
  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds this URL to the current scene as an HTML source by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Will only raise an error if URL is not http or https.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value2) {
    return new Promise((resolve2, reject2) => {
      let scenePrefix = "";
      checkSplitmode(value2).then((prefix) => {
        scenePrefix = prefix;
        return this._getUrl();
      }).then((url) => {
        return addToSceneHandler(scenePrefix + "addurl", url);
      }).then((result) => {
        resolve2(result);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
}
class File {
  /**
   *  param: (file: string)
   *
   *  Creates a File object pertaining to a file's full path.
   */
  constructor(file) {
    this._path = file;
  }
  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds this file to the current scene by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value2) {
    return new Promise((resolve2, reject2) => {
      checkSplitmode(value2).then((scenePrefix) => {
        return addToSceneHandler(scenePrefix + "addfile", this._path);
      }).then((result) => {
        resolve2(result);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
}
class VideoPlaylist {
  /**
   *  param: (files: string[])
   *
   *  Creates a VideoPlaylist object for several video files.
   */
  constructor(items) {
    this._id = 0;
    this._fileplaylist = "";
    this._playlist = items;
  }
  /**
   * return: XML
   *
   * Creates an XML object with the playlist properties. This method is used
   * internally for the `addToScene` method.
   */
  toXML() {
    return new Promise((resolve2, reject2) => {
      let filePromises = this._playlist.map((filename) => {
        return new Promise((ioResolve) => {
          IO.getVideoDuration(filename).then((duration) => {
            ioResolve(duration);
          }).catch((err) => {
            ioResolve(err);
          });
        });
      });
      Promise.all(filePromises).then((duration) => {
        var fileItems = new JSON$1();
        let isError = false;
        if (this._playlist.length) {
          for (var i = 0; i < this._playlist.length; i++) {
            if (typeof duration[i] === "object") {
              isError = true;
              break;
            }
            this._fileplaylist += this._playlist[i] + "*" + i + "*1*" + duration[i] + "*100*0*0*0*0*0|";
          }
          let _inner_this = this;
          if (!isError) {
            App$1.get("scene:0").then(function(main) {
              return App$1.get("sceneconfig:" + main);
            }).then(function(presetConfig) {
              let placementJSON = JSON$1.parse(presetConfig);
              let defpos = placementJSON["defpos"];
              fileItems.tag = "item";
              fileItems["type"] = "1";
              fileItems["name"] = "Video Playlist";
              if (defpos === "0") {
                fileItems["pos_left"] = "0";
                fileItems["pos_top"] = "0";
                fileItems["pos_right"] = "0.5";
                fileItems["pos_bottom"] = "0.5";
              } else if (defpos === "1") {
                fileItems["pos_left"] = "0.5";
                fileItems["pos_top"] = "0";
                fileItems["pos_right"] = "1";
                fileItems["pos_bottom"] = "0.5";
              } else if (defpos === "2") {
                fileItems["pos_left"] = "0";
                fileItems["pos_top"] = "0.5";
                fileItems["pos_right"] = "0.5";
                fileItems["pos_bottom"] = "1";
              } else if (defpos === "3") {
                fileItems["pos_left"] = "0.5";
                fileItems["pos_top"] = "0.5";
                fileItems["pos_right"] = "1";
                fileItems["pos_bottom"] = "1";
              } else {
                fileItems["pos_left"] = "0.25";
                fileItems["pos_top"] = "0.25";
                fileItems["pos_right"] = "0.75";
                fileItems["pos_bottom"] = "0.75";
              }
              fileItems["item"] = _inner_this._playlist[0] + "*0";
              fileItems["FilePlaylist"] = _inner_this._fileplaylist;
              resolve2(XML.parseJSON(fileItems));
            });
          } else {
            reject2(Error("One or more files included are invalid."));
          }
        } else {
          reject2(Error("No media file included."));
        }
      });
    });
  }
  /**
   * param: (value?: number | Scene)
   * ```
   *  return: Promise<any>
   * ```
   *
   * Adds the prepared video playlist to the current scene by default.
   * Accepts an optional parameter value, which when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   * This function is not available to sources.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value2) {
    return new Promise((resolve2, reject2) => {
      let scenePrefix = "";
      if (Environment.isSourcePlugin()) {
        reject2(Error("This function is not available to sources."));
      } else {
        checkSplitmode(value2).then((prefix) => {
          scenePrefix = prefix;
          return this.toXML();
        }).then((fileItem) => {
          return addToSceneHandler(scenePrefix + "additem", " " + fileItem);
        }).then((result) => {
          resolve2(result);
        }).catch((err) => {
          reject2(err);
        });
      }
    });
  }
}
class Group {
  constructor(itemArray) {
    this._items = itemArray;
  }
  toStringArray() {
    var itemStringArray = this._items.map((item) => {
      if (item instanceof Item) {
        return item._id;
      } else {
        return item;
      }
    });
    return itemStringArray;
  }
  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds this group to the current scene by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value2) {
    return new Promise((resolve2, reject2) => {
      var splitScene;
      var activeSceneIdx;
      App$1.get("scene").then((sceneIdx) => {
        activeSceneIdx = sceneIdx;
        return checkSplitmode(value2);
      }).then((scenePrefix) => {
        splitScene = scenePrefix;
        if (scenePrefix.split(":")[1]) {
          activeSceneIdx = scenePrefix.split(":")[1];
        }
        return App$1.get(`scenecanaddgroup:${activeSceneIdx}:${this.toStringArray().join(",")}`);
      }).then((canAdd) => {
        if (canAdd === "1") {
          return addToSceneHandler(splitScene + "addgroup", ...this.toStringArray());
        } else {
          reject2("Items provided cannot be grouped");
        }
      }).then((result) => {
        resolve2(result);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
}
var REPLAY_INCREMENT_COUNTER = 0;
const generateReplayName = function() {
  REPLAY_INCREMENT_COUNTER++;
  return Date.now() + `_replay#${REPLAY_INCREMENT_COUNTER}`;
};
class Replay {
  constructor(replayOptions) {
    this._buffer = replayOptions && replayOptions["buffer"] || 10;
    this._channelName = replayOptions && replayOptions["channelName"] || "auto";
    this._hotkey = replayOptions && replayOptions["hotkey"] || 0;
    this._propName = "Replay";
  }
  toXML() {
    var replay = new JSON$1();
    replay.tag = "item";
    replay["item"] = generateReplayName();
    replay["name"] = this._propName;
    replay["type"] = "13";
    replay["selfclosing"] = false;
    var bufferJXON = new JSON$1();
    bufferJXON.tag = "presproperty";
    bufferJXON.value = String(this._buffer);
    bufferJXON["__map_id"] = "buffer";
    bufferJXON["selfclosing"] = false;
    var channelNameJXON = new JSON$1();
    channelNameJXON.tag = "presproperty";
    channelNameJXON.value = this._channelName;
    channelNameJXON["__map_id"] = "channelName";
    channelNameJXON["selfclosing"] = false;
    var hotkeyJXON = new JSON$1();
    hotkeyJXON.tag = "presproperty";
    hotkeyJXON.value = String(this._hotkey);
    hotkeyJXON["__map_id"] = "hotkey";
    hotkeyJXON["selfclosing"] = false;
    replay.children = [bufferJXON, channelNameJXON, hotkeyJXON];
    return XML.parseJSON(replay);
  }
  /**
   * param: (value?: number | Scene)
   * ```
   * return: Promise<any>
   * ```
   *
   * Adds this replay object to the current scene by default.
   * Accepts an optional parameter value, which, when supplied,
   * points to the scene where item will be added instead.
   * If ready config {listenToItemAdd: true} it returns item id,
   * else returns boolean.
   *
   * Note: There is yet no way to detect error responses for this action.
   */
  addToScene(value2) {
    return new Promise((resolve2, reject2) => {
      checkSplitmode(value2).then((scenePrefix) => {
        return addToSceneHandler(scenePrefix + "additem", this.toXML().toString());
      }).then((result) => {
        resolve2(result);
      }).catch((err) => {
        reject2(err);
      });
    });
  }
}
const _SourcePluginWindow = class _SourcePluginWindow extends EventEmitter {
  /**
   * ** For deprecation, the need for getting the instance of a SourcePluginWindow looks redundant,
   * `** since a SourcePluginWindow should technically have a single instance`
   *
   * Gets the instance of the window utility. Use this instead of the constructor.
   */
  static getInstance() {
    if (_SourcePluginWindow._instance === void 0) {
      _SourcePluginWindow._instance = new _SourcePluginWindow();
    }
    return _SourcePluginWindow._instance;
  }
  /**
   *  ** For Deprecation
   *
   *  Use getInstance()
   */
  constructor() {
    super();
    if (!Environment.isSourcePlugin()) {
      throw new Error("SourcePluginWindow class is only available for source plugins");
    }
    this.on("message-source", function(message) {
      if (message.request !== void 0) {
        if (message.request === "saveConfig") {
          this.emit("save-config", this._hideGlobalConfig(message.data));
        } else if (message.request === "applyConfig") {
          this.emit("apply-config", this._hideGlobalConfig(message.data));
        }
      }
    });
    _SourcePluginWindow._instance = this;
    _SourcePluginWindow._subscriptions = [];
  }
  /**
   *  param: (event: string, ...params: any[])
   *
   *  Allows this class to emit an event.
   */
  static emit(event, ...params) {
    params.unshift(event);
    try {
      _SourcePluginWindow.getInstance().emit.apply(_SourcePluginWindow._instance, params);
    } catch (event2) {
      _SourcePluginWindow._instance.emit.apply(_SourcePluginWindow._instance, params);
    }
  }
  /**
   *  param: (event: string, handler: Function)
   *
   *  Allows listening to events that this class emits. 
   *
   */
  static on(event, handler) {
    _SourcePluginWindow.getInstance().on(event, handler);
    let isDeleteSceneEventFixed = versionCompare(getVersion()).is.greaterThanOrEqualTo(deleteSceneEventFixVersion);
    if (event === "scene-delete" && isDeleteSceneEventFixed) {
      if (_SourcePluginWindow._subscriptions.indexOf("SceneDeleted") < 0) {
        EventManager.subscribe("SceneDeleted", function(settingsObj) {
          if (Environment.isSourcePlugin()) {
            _SourcePluginWindow.emit(event, settingsObj["index"] === "" ? null : Number(settingsObj["index"]) + 1);
          }
        });
      }
    } else if (["set-background-color", "scene-load", "apply-config", "save-config"].indexOf(event) >= 0) ;
    else {
      console.warn('Warning! The event "' + event + '" is not yet supported on this version.');
    }
  }
  static off(event, handler) {
    _SourcePluginWindow.getInstance().off(event, handler);
  }
  // We modify the configuration sent from the source properties window
  // so that we do not see 'persistent' configuration such as config-url.
  // When saving, this is restored back to the config object through
  // Item#saveConfig().
  //
  // Note that we could have chosen to hide this from Item#requestSaveConfig()
  // or Item#applyConfig() calls, but unfortunately, the context of the source
  // properties window cannot always correctly determine the global config nodes
  // when dealing with sources other than the current source (right-clicked.)
  _hideGlobalConfig(data) {
    let persist = Global.getPersistentConfig();
    for (var key in persist) {
      delete data[key];
    }
    return data;
  }
};
_SourcePluginWindow._subscriptions = [];
let SourcePluginWindow = _SourcePluginWindow;
window$1.MessageSource = function(message) {
  SourcePluginWindow.emit(
    "message-source",
    JSON.parse(message)
  );
};
window$1.SetConfiguration = function(configObj) {
  try {
    var data = JSON.parse(configObj);
    SourcePluginWindow.emit("apply-config", data);
    SourcePluginWindow.emit("save-config", data);
  } catch (e) {
    return;
  }
};
window$1.setBackGroundColor = function(color) {
  SourcePluginWindow.emit("set-background-color", color);
};
let prevOnSceneLoad = window$1.OnSceneLoad;
window$1.OnSceneLoad = function(...args) {
  if (Environment.isSourcePlugin()) {
    SourcePluginWindow.emit("scene-load");
  }
  if (prevOnSceneLoad !== void 0) {
    prevOnSceneLoad(...args);
  }
};
const _RESIZE = "2";
const _ExtensionWindow = class _ExtensionWindow extends EventEmitter {
  /**
   * ** For deprecation, the need for getting the instance of an ExtensionWindow looks redundant,
   * `** since an ExtensionWinow should technically have a single instance`
   *
   * Gets the instance of the window utility. Use this instead of the constructor.
   */
  static getInstance() {
    if (_ExtensionWindow._instance === void 0) {
      _ExtensionWindow._instance = new _ExtensionWindow();
    }
    return _ExtensionWindow._instance;
  }
  /**
   *  ** For Deprecation
   *
   *  Use getInstance()
   */
  constructor() {
    super();
    if (!Environment.isExtension()) {
      throw new Error("ExtensionWindow class is only available for extensions");
    }
    _ExtensionWindow._instance = this;
    _ExtensionWindow._subscriptions = [];
    _ExtensionWindow._encounteredFirstSceneChange = false;
  }
  /**
   *  param: (event: string, ...params: any[])
   *
   *  Allows this class to emit an event.
   */
  static emit(event, ...params) {
    params.unshift(event);
    try {
      _ExtensionWindow.getInstance().emit.apply(_ExtensionWindow._instance, params);
    } catch (event2) {
      _ExtensionWindow._instance.emit.apply(_ExtensionWindow._instance, params);
    }
  }
  /**
   *  param: (event: string, handler: Function)
   *
   *  Allows listening to events that this class emits.
   *
   */
  static on(event, handler) {
    return new Promise((resolve2, reject2) => {
      let id = (/* @__PURE__ */ new Date()).getTime() + "_" + Math.floor(Math.random() * 1e3);
      _ExtensionWindow.getInstance().on(event, handler, id);
      let isDeleteSceneEventFixed = versionCompare(getVersion()).is.greaterThanOrEqualTo(deleteSceneEventFixVersion);
      let isAddSceneEventFixed = versionCompare(getVersion()).is.greaterThanOrEqualTo(addSceneEventFixVersion);
      let isSceneUidParamAvailable = versionCompare(getVersion()).is.greaterThanOrEqualTo(sceneUidAddDeleteVersion);
      if (event === "scene-delete" && isDeleteSceneEventFixed) {
        let eventSubscribe = isSceneUidParamAvailable ? "OnSceneDelete" : "SceneDeleted";
        if (_ExtensionWindow._subscriptions.indexOf(eventSubscribe) < 0) {
          _ExtensionWindow._subscriptions.push(eventSubscribe);
          EventManager.subscribe(eventSubscribe, function(settingsObj) {
            if (Environment.isExtension()) {
              if (isSceneUidParamAvailable) {
                let returnObj = {};
                const sceneId = settingsObj["args"][1].split("&")[1].split(":");
                const sceneNum = settingsObj["args"][1].split("&")[2].split(":");
                returnObj[sceneId[0]] = sceneId[1];
                returnObj[sceneNum[0]] = Number(sceneNum[1]) + 1;
                _ExtensionWindow.emit(settingsObj["id"] ? settingsObj["id"] : event, returnObj["scene"], returnObj["sceneid"]);
              } else {
                _ExtensionWindow.emit(settingsObj["id"] ? settingsObj["id"] : event, settingsObj["index"] === "" ? null : Number(settingsObj["index"]) + 1);
              }
            }
            resolve2(this);
          }, id);
        } else {
          resolve2(this);
        }
      } else if (event === "scene-add" && isAddSceneEventFixed) {
        let eventSubscribe = isSceneUidParamAvailable ? "OnSceneAdd" : "OnSceneAddByUser";
        if (_ExtensionWindow._subscriptions.indexOf(eventSubscribe) < 0) {
          _ExtensionWindow._subscriptions.push(eventSubscribe);
          EventManager.subscribe(eventSubscribe, function(settingsObj) {
            if (isSceneUidParamAvailable) {
              let returnObj = {};
              const sceneId = settingsObj["args"][1].split("&")[1].split(":");
              const sceneNum = settingsObj["args"][1].split("&")[2].split(":");
              returnObj[sceneId[0]] = sceneId[1];
              returnObj[sceneNum[0]] = Number(sceneNum[1]) + 1;
              _ExtensionWindow.emit(settingsObj["id"] ? settingsObj["id"] : event, returnObj["scene"], returnObj["sceneid"]);
            } else {
              Scene.getSceneCount().then(function(count) {
                if (Environment.isExtension()) {
                  _ExtensionWindow.emit(settingsObj["id"] ? settingsObj["id"] : event, count);
                  resolve2(this);
                } else {
                  reject2(Error("ExtensionWindow class is only available for extensions."));
                }
              });
            }
          }, id);
        } else {
          resolve2(this);
        }
      } else if (event === "scene-delete-all" && isSceneUidParamAvailable) {
        if (_ExtensionWindow._subscriptions.indexOf("OnSceneDeleteAll") < 0) {
          _ExtensionWindow._subscriptions.push("OnSceneDeleteAll");
          EventManager.subscribe("OnSceneDeleteAll", function(settingsObj) {
            if (Environment.isExtension()) {
              _ExtensionWindow.emit(settingsObj["id"] ? settingsObj["id"] : event, settingsObj["args"][0]);
            }
            resolve2(this);
          }, id);
        } else {
          resolve2(this);
        }
      } else if (event === "bscn-load") {
        if (_ExtensionWindow._subscriptions.indexOf("OnPropertyChange") < 0) {
          _ExtensionWindow._subscriptions.push("OnPropertyChange");
          EventManager.subscribe("OnPropertyChange", function(settingsObj) {
            if (Environment.isExtension()) {
              let property = settingsObj["args"][0];
              let newValue = settingsObj["args"][1];
              if (property.startsWith("sceneconfign:") || property.startsWith("sceneconfig:")) {
                let changedIndex = property.split(":")[1];
                Scene.getActiveScene().then((scene) => {
                  return scene.getSceneNumber();
                }).then((sceneNumber) => {
                  if (typeof sceneNumber === "number") {
                    sceneNumber = sceneNumber - 1;
                  }
                  if (changedIndex === String(sceneNumber)) {
                    var placementJXON = JSON$1.parse(newValue);
                    _ExtensionWindow.emit(settingsObj["id"] ? settingsObj["id"] : event, sceneNumber, placementJXON["id"]);
                  }
                });
              }
            }
            resolve2(this);
          }, id);
        } else {
          resolve2(this);
        }
      } else if (event === "push-to-live") {
        if (_ExtensionWindow._subscriptions.indexOf("scenedlg:1") < 0 && Environment.isExtension()) {
          _ExtensionWindow._subscriptions.push("scenedlg:1");
          EventManager.subscribe("scenedlg:1", function() {
            _ExtensionWindow._encounteredFirstSceneChange = false;
          }, id);
          if (_ExtensionWindow._subscriptions.indexOf("SceneChange") < 0) {
            _ExtensionWindow._subscriptions.push("SceneChange");
            EventManager.subscribe("SceneChange", function(settingsObj) {
              let isSplitMode = false;
              const viewId = parseInt(settingsObj["args"][0]);
              const sceneIndex = parseInt(settingsObj["args"][1]);
              App$1.getGlobalProperty("splitmode").then((split) => {
                isSplitMode = split === "1" ? true : false;
                if (isSplitMode) {
                  if (!_ExtensionWindow._encounteredFirstSceneChange) {
                    if (viewId === 1) {
                      _ExtensionWindow._encounteredFirstSceneChange = true;
                      _ExtensionWindow.emit(settingsObj["id"] ? settingsObj["id"] : event, sceneIndex);
                    }
                  }
                } else {
                  if (viewId === 0) _ExtensionWindow.emit(settingsObj["id"] ? settingsObj["id"] : event, sceneIndex);
                }
              });
            }, id);
          }
          resolve2(this);
        } else {
          resolve2(this);
        }
      } else if ([
        "sources-list-highlight",
        "sources-list-select",
        "sources-list-update",
        "scene-load"
      ].indexOf(event) >= 0) {
        if ([
          "sources-list-highlight",
          "sources-list-select",
          "sources-list-update"
        ].indexOf(event) >= 0) {
          try {
            exec("SourcesListSubscribeEvents", ViewTypes.MAIN.toString()).then((res) => {
              return exec("SourcesListSubscribeEvents", ViewTypes.PREVIEW.toString());
            }).then((res) => {
              resolve2(this);
            }).catch((err) => {
              resolve2(this);
            });
          } catch (ex) {
          }
        } else {
          resolve2(this);
        }
      } else {
        reject2(Error('Warning! The event "' + event + '" is not yet supported.'));
      }
    });
  }
  static off(event, handler) {
    _ExtensionWindow.getInstance().off(event, handler);
  }
  /** param: (width: number, height: number)
   *
   *  Resizes this extension's window.
   */
  static resize(width, height) {
    App$1.postMessage(_RESIZE, String(width), String(height));
  }
  /**
   * `** For deprecation, please use the static method instead`
   */
  resize(width, height) {
    App$1.postMessage(_RESIZE, String(width), String(height));
  }
  /**
   * param: (value: string)
   *
   * Renames the extension window.
   */
  static setTitle(value2) {
    return new Promise((resolve2) => {
      let ext = Extension.getInstance();
      ext.getId().then((id) => {
        exec("CallHost", "setExtensionWindowTitle:" + id, value2).then((res) => {
          resolve2(res);
        });
      });
    });
  }
  /**
   * `** For deprecation, please use the static method instead`
   */
  setTitle(value2) {
    return new Promise((resolve2) => {
      let ext = Extension.getInstance();
      ext.getId().then((id) => {
        exec("CallHost", "setExtensionWindowTitle:" + id, value2).then((res) => {
          resolve2(res);
        });
      });
    });
  }
  /**
   * param (flag: number)
   *
   * Modifies this extension's window border.
   *
   * '4' is th e base command on setting border flags.
   *
   * Flags can be:
   *     (bit 0 - enable border)
   *     (bit 1 - enable caption)
   *     (bit 2 - enable sizing)
   *     (bit 3 - enable minimize btn)
   *     (bit 4 - enable maximize btn)
   */
  static setBorder(flag) {
    App$1.postMessage("4", String(flag));
  }
  /**
   * `** For deprecation, please use the static method instead`
   * */
  setBorder(flag) {
    App$1.postMessage("4", String(flag));
  }
  /**
   * Closes this extension window
   */
  static close() {
    App$1.postMessage("1");
  }
  /**
   * `** For deprecation, please use the static method instead`
   * */
  close() {
    App$1.postMessage("1");
  }
  /**
   * Disable Close Button on this extension's window
   */
  static disableClose() {
    App$1.postMessage("5", "0");
  }
  /**
   * `** For deprecation, please use the static method instead`
   * */
  disableClose() {
    App$1.postMessage("5", "0");
  }
  /**
   * Enable Close Button on this extension's window
   */
  static enableClose() {
    App$1.postMessage("5", "1");
  }
  /**
   * `** For deprecation, please use the static method instead`
   * */
  enableClose() {
    App$1.postMessage("5", "1");
  }
};
_ExtensionWindow._subscriptions = [];
_ExtensionWindow._encounteredFirstSceneChange = false;
let ExtensionWindow = _ExtensionWindow;
const oldSourcesListUpdate = window$1.SourcesListUpdate;
window$1.SourcesListUpdate = (view, sources) => {
  App$1.getGlobalProperty("splitmode").then((res) => {
    const checkSplit = res === "1" ? 1 : 0;
    if (Number(view) === checkSplit) {
      let propsJSON = JSON$1.parse(decodeURIComponent(sources)), propsArr = [], ids = [];
      if (propsJSON.children && propsJSON.children.length > 0) {
        propsArr = propsJSON.children;
        for (var i = 0; i < propsArr.length; i++) {
          ids.push(propsArr[i]["id"]);
        }
      }
      ExtensionWindow.emit("sources-list-update", ids.join(","));
    }
    if (typeof oldSourcesListUpdate === "function") {
      oldSourcesListUpdate(view, sources);
    }
  });
};
const oldSourcesListHighlight = window$1.SourcesListHighlight;
window$1.SourcesListHighlight = (view, id) => {
  splitMode().then((checkSplit) => {
    if (Number(view) === checkSplit) {
      ExtensionWindow.emit("sources-list-highlight", id === "" ? null : id);
    }
    if (typeof oldSourcesListHighlight === "function") {
      oldSourcesListHighlight(view, id);
    }
  });
};
const oldSourcesListSelect = window$1.SourcesListSelect;
window$1.SourcesListSelect = (view, id) => {
  splitMode().then((checkSplit) => {
    if (Number(view) === checkSplit) {
      ExtensionWindow.emit("sources-list-select", id === "" ? null : id);
    }
    if (typeof oldSourcesListSelect === "function") {
      oldSourcesListSelect(view, id);
    }
  });
};
const oldOnSceneLoad = window$1.OnSceneLoad;
window$1.OnSceneLoad = function(...args) {
  splitMode().then((checkSplit) => {
    if (Environment.isExtension()) {
      let view = args[0];
      let scene = args[1];
      if (Number(view) === checkSplit && scene !== "i12") {
        ExtensionWindow.emit("scene-load", Number(scene));
      }
    }
    if (typeof oldOnSceneLoad === "function") {
      oldOnSceneLoad(...args);
    }
  });
};
let dialogProxy;
class Dialog {
  constructor() {
    if (Environment.isSourcePlugin()) {
      throw new Error("Dialogs are not available for source plugins.");
    } else {
      if (Remote.remoteType === "remote") {
        throw new Error("Unable to listen to Dialog window events through Remote");
      }
      this._result = null;
      let eventListener = (e) => {
        e.target.removeEventListener(e.type, eventListener);
        if (typeof dialogProxy !== "undefined" && typeof Proxy !== "undefined") {
          dialogProxy._result = e.detail;
        } else {
          this._result = e.detail;
        }
        this._resultListener = null;
      };
      document.addEventListener("xsplit-dialog-result", eventListener);
      this._resultListener = eventListener;
      return this;
    }
  }
  /**
   *  param: (url: string)
   *
   *  return: Dialog
   *
   *  Creates a Dialog object pointing to a URL. Call the other methods to
   *  modify the dialog's properties, and `show()` to spawn the dialog.
   *
   * *Chainable.*
   */
  static createDialog(url) {
    let dialog = new Dialog();
    dialog._url = url;
    return dialog;
  }
  /**
   *  param: (url: string)
   *
   *  return: Dialog
   *
   *  Creates a Dialog object pointing to a URL, that autocloses on an outside
   *  click. AutoDialogs only have access to the `setSize` and `show` methods.
   *
   * *Chainable.*
   */
  static createAutoDialog(url) {
    if (Environment.isSourceProps()) {
      throw new Error("Auto dialogs are not available for config windows.");
    } else {
      let dialog = new Dialog();
      dialog._url = url;
      dialog._autoclose = true;
      return dialog;
    }
  }
  /**
   *  param: (result ?: string)
   *
   *  Closes this dialog with an optional string result. For more complex
   *  return values, try JSON.stringify. (Call this method from the dialog.)
   *
   *  As an alternative, lightweight dialogs that do not want to include xjs.js
   *  may simply call native XBC methods to return a value.
   *  ```javascript
   *  external.SetDialogResult(stringResult);
   *  external.Close();
   *  ```
   */
  static return(result) {
    return new Promise((resolve2) => {
      if (result !== void 0) {
        exec("SetDialogResult", result).then((res) => {
          resolve2(res);
          exec("Close");
        });
      } else {
        resolve2(exec("Close"));
      }
    });
  }
  /**
   *  param: (width: number, height: number)
   *
   *  return: Dialog
   *
   *  Sets the size in pixels of the dialog to be displayed.
   *
   * *Chainable.*
   */
  setSize(width = 300, height = 300) {
    this._size = Rectangle.fromDimensions(width, height);
    return this;
  }
  /**
   *  param: (title: string)
   *
   *  return: Dialog
   *
   *  Sets the title of the dialog to be displayed.
   *
   * *Chainable.*
   */
  setTitle(title) {
    if (this._autoclose) {
      throw new Error("Autoclosing dialogs cannot use this method.");
    }
    this._title = title;
    return this;
  }
  /**
   *  param: (showBorder: boolean, resizable: boolean)
   *
   *  return: Dialog
   *
   *  Specifies the border and resizable flags for the dialog to be displayed.
   *
   * *Chainable.*
   */
  setBorderOptions(showBorder = false, resizable = false) {
    if (this._autoclose) {
      throw new Error("Autoclosing dialogs cannot use this method.");
    }
    this._showBorder = showBorder;
    this._resizable = resizable;
    return this;
  }
  /**
   *  param: (isMinimizeActive: boolean, isMaximizeActive: boolean)
   *
   *  return: Dialog
   *
   *  Specifies if the window buttons (minimize and maximize) should be active.
   *
   * *Chainable.*
   */
  setButtons(isMinimizeActive = false, isMaximizeActive = false) {
    if (this._autoclose) {
      throw new Error("Autoclosing dialogs cannot use this method.");
    }
    this._minimize = isMinimizeActive;
    this._maximize = isMaximizeActive;
    return this;
  }
  /**
   *  param: (cookiePath: string)
   *
   *  return: Dialog
   *
   *  Sets the cookie Path of the dialog.
   *
   * *Chainable.*
   */
  setCookiePath(cookiePath) {
    if (this._autoclose) {
      throw new Error("Autoclosing dialogs cannot use this method.");
    }
    this._cookiePath = cookiePath;
    return this;
  }
  /**
   *  return: Promise<Dialog>
   *
   *  After configuring the dialog, call this function to spawn it.
   *
   * *Chainable.*
   */
  show() {
    return new Promise((resolve2) => {
      this._result = null;
      if (this._autoclose) {
        exec("NewAutoDialog", this._url, "", this._size === void 0 ? void 0 : this._size.getWidth() + "," + this._size.getHeight()).then((result) => {
          resolve2(this);
        });
      } else {
        exec(
          "NewDialog",
          this._url,
          "",
          this._size === void 0 ? void 0 : this._size.toDimensionString(),
          this._calculateFlags(),
          this._title,
          this._cookiePath === void 0 ? void 0 : `<configuration cookiepath="${this._cookiePath}" />`
        ).then((result) => {
          resolve2(this);
        });
      }
    });
  }
  /**
     *  param: (script: string)
  
     *  return: Promise<Dialog>
     *
     *  After configuring the dialog, call this function to spawn it.
     *  A javascript string parameter can be passed to have more control over the dialog
     *
     * *Chainable.*
     */
  showWithJS(script) {
    return new Promise((resolve2) => {
      this._result = null;
      let windowParams = this._size ? `cx:${this._size.getWidth()}&cy:${this._size.getHeight()}` : "";
      windowParams = this._calculateFlags() !== "0" ? `${windowParams}&flags:${this._calculateFlags()}` : windowParams;
      exec(
        "NewDialog2",
        this._url,
        "",
        windowParams,
        this._title ? this._title : "",
        this._cookiePath ? `<configuration cookiepath="${this._cookiePath}" />` : "",
        script ? script : "",
        (result) => {
          this._result = result;
          resolve2(this);
        }
      );
    });
  }
  /**
   *  return: Promise<string>
   *
   *  Gets the string result returned from the spawned dialog.
   */
  getResult() {
    return new Promise((resolve2) => {
      if (this._result !== null) {
        resolve2(this._result);
      } else if (this._resultListener === null) {
        let eventListener = (e) => {
          e.target.removeEventListener(e.type, eventListener);
          this._result = e.detail;
          this._resultListener = null;
          resolve2(this._result);
        };
        document.addEventListener("xsplit-dialog-result", eventListener);
        this._resultListener = eventListener;
      } else if (typeof Proxy === "undefined") {
        Object.observe(this, (changes) => {
          let change = changes.filter((elem) => {
            return elem.name === "_result";
          });
          if (change !== void 0 && change.length > 0) {
            resolve2(change[0].object._result);
          }
        });
      } else {
        dialogProxy = new Proxy(this, {
          set: (target, property, value2, receiver) => {
            if (property === "_result") {
              this._result = value2;
              resolve2(value2);
            }
            return true;
          }
        });
      }
    });
  }
  /**
   *  Closes the dialog that this window spawned.
   */
  close() {
    return new Promise((resolve2) => {
      resolve2(exec("CloseDialog"));
    });
  }
  _calculateFlags() {
    let flags = 0;
    if (this._showBorder) {
      flags += 1;
    }
    if (this._resizable) {
      flags += 4;
    }
    if (this._minimize) {
      flags += 8;
    }
    if (this._maximize) {
      flags += 16;
    }
    if (this._title || this._minimize || this._maximize) {
      flags += 2;
    }
    return String(flags);
  }
}
const oldOnDialogResult = window$1.OnDialogResult;
window$1.OnDialogResult = function(result) {
  if (Environment.isSourceProps() || Environment.isExtension()) {
    document.dispatchEvent(new CustomEvent("xsplit-dialog-result", {
      detail: result
    }));
  }
  if (typeof oldOnDialogResult === "function") {
    oldOnDialogResult(result);
  }
};
exports.ActionAfterPlayback = ActionAfterPlayback;
exports.App = App;
exports.AudioDevice = AudioDevice;
exports.AudioDeviceDataflow = AudioDeviceDataflow;
exports.AudioDeviceState = AudioDeviceState;
exports.AudioItem = AudioItem;
exports.AudioSource = AudioSource;
exports.CameraDevice = CameraDevice;
exports.CameraItem = CameraItem;
exports.CameraSource = CameraSource;
exports.ChannelManager = ChannelManager;
exports.ChromaAntiAliasLevel = ChromaAntiAliasLevel;
exports.ChromaPrimaryColors = ChromaPrimaryColors;
exports.Color = Color;
exports.CuePoint = CuePoint;
exports.Dialog = Dialog;
exports.Dll = Dll;
exports.Environment = Environment;
exports.Extension = Extension;
exports.ExtensionWindow = ExtensionWindow;
exports.File = File;
exports.Filter = Filter;
exports.FlashItem = FlashItem;
exports.FlashSource = FlashSource;
exports.Game = Game;
exports.GameItem = GameItem;
exports.GameSource = GameSource;
exports.Group = Group;
exports.GroupItem = GroupItem;
exports.HtmlItem = HtmlItem;
exports.HtmlSource = HtmlSource;
exports.IO = IO;
exports.ImageItem = ImageItem;
exports.ImageSource = ImageSource;
exports.Item = Item;
exports.ItemTypes = ItemTypes;
exports.KeyingType = KeyingType;
exports.LanguageInfo = LanguageInfo;
exports.MaskEffect = MaskEffect;
exports.MediaItem = MediaItem;
exports.MediaSource = MediaSource;
exports.MediaTypes = MediaTypes;
exports.MicrophoneDevice = MicrophoneDevice;
exports.Output = Output;
exports.Rectangle = Rectangle;
exports.Remote = Remote;
exports.Replay = Replay;
exports.ReplayItem = ReplayItem;
exports.ReplaySource = ReplaySource;
exports.Scene = Scene;
exports.SceneItem = SceneItem;
exports.SceneSource = SceneSource;
exports.Screen = Screen;
exports.ScreenItem = ScreenItem;
exports.ScreenSource = ScreenSource;
exports.Source = Source;
exports.SourcePluginWindow = SourcePluginWindow;
exports.SourcePropsWindow = SourcePropsWindow;
exports.StreamInfo = StreamInfo;
exports.System = System;
exports.Thumbnail = Thumbnail;
exports.Transition = Transition;
exports.Url = Url;
exports.VideoPlaylist = VideoPlaylist;
exports.VideoPlaylistItem = VideoPlaylistItem;
exports.VideoPlaylistSource = VideoPlaylistSource;
exports.ViewTypes = ViewTypes;
exports._subscribeEventManager = _subscribeEventManager;
exports.exec = exec;
exports.ready = ready;
