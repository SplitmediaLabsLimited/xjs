/// <reference path="../defs/cssjson.d.ts" />
/**
 * Rose Test
 * Crude functional testing helper for XJS Framework.
 * Version 0.1.0
 *
 * Released under the MIT license.
 */
var Rose = (function () {
    function Rose(elem) {
        this._contents = [];
        elem = (elem instanceof HTMLElement) ? elem : document.body;
        // Create the container
        this._container = document.createElement('div');
        this._container.id = 'rose-container';
        // Create the tab group
        this._tabGroup = document.createElement('ul');
        this._tabGroup.classList.add('rose-tab-group');
        // Create the contents container
        this._tabContents = document.createElement('div');
        this._tabContents.classList.add('rose-tab-contents');
        // Create the output container
        this._buttons = document.createElement('div');
        this._buttons.id = 'rose-buttons';
        // Create the output container
        this._output = document.createElement('div');
        this._output.id = 'rose-output';
        this._tabContents.appendChild(this._buttons);
        this._tabContents.appendChild(this._output);
        this._container.appendChild(this._tabGroup);
        this._container.appendChild(this._tabContents);
        elem.appendChild(this._container);
        this.initEvents();
        this.initStyle();
    }
    /**
     * Display contents to the UI.
     *
     * @param obj
     *        The object that contains the tabname, id, and button list
     */
    Rose.prototype.setContent = function (obj) {
        if (obj === undefined)
            return;
        var _button;
        this._buttons.innerHTML = '';
        for (var _i = 0, _a = obj.buttons; _i < _a.length; _i++) {
            var button = _a[_i];
            _button = document.createElement('button');
            _button.textContent = button['name'] || 'Button';
            _button.addEventListener('click', button['onClick']);
            this._buttons.appendChild(_button);
        }
    };
    /**
     * Creates a Tab.
     *
     * @param tab
     *        The object that contains the tabname and button list. This
     *        will also save those details for later use.
     */
    Rose.prototype.createTab = function (tab) {
        // Generate an ID
        var _id = this.generateID();
        var _tab = document.createElement('li');
        _tab.textContent = tab.name;
        _tab.setAttribute('tab-id', _id);
        this._tabGroup.appendChild(_tab);
        this._contents.push({
            id: _id,
            name: tab.name,
            buttons: tab.buttons,
            refresh: function () { _tab.click(); }
        });
        if (this._tabGroup.children.length === 1) {
            _tab.click();
        }
        return this._contents[this._contents.length - 1];
    };
    /**
     * Prints some text on the output element
     *
     * @param text
     *        Any text to print to the output element
     */
    Rose.prototype.output = function (text) {
        var _output = this._tabContents.querySelector('#rose-output');
        if (String(text).trim() !== '') {
            _output.classList.add('show');
        } else {
            _output.classList.remove('show');
        }
        _output.textContent = text;
    };
    /**
     * Initialize event handler of tab click
     */
    Rose.prototype.initEvents = function () {
        var _this = this;
        // Tab Group onClick event
        this._tabGroup.addEventListener('click', function (event) {
            var element = event.target;
            if (element.tagName === 'LI') {
                var target = element.getAttribute('tab-id');
                var curActive = _this._tabGroup.querySelector('.active');
                if (curActive && curActive.getAttribute('tab-id') !== target) {
                    _this._tabGroup.querySelector('.active').classList.remove('active');
                    element.classList.add('active');
                }
                element.classList.add('active');
                _this.setContent(_this._contents['find'](function (elem) {
                    return elem['id'] === target;
                }));
            }
        });
    };
    /**
     * Use JavaScript to append some CSS for rose tabs
     */
    Rose.prototype.initStyle = function () {
        var _styleNode = document.createElement('style');
        var _styleObj = {
            'children': {
                '#rose-container .rose-tab-group': {
                    'children': {},
                    'attributes': {
                        'background': '#000',
                        'padding': 0,
                        'margin': 0
                    }
                },
                '#rose-container .rose-tab-group li': {
                    'children': {},
                    'attributes': {
                        'background': '#000',
                        'color': '#FFF',
                        'cursor': 'pointer',
                        'display': 'inline-block',
                        'margin': '0',
                        'padding': '1em'
                    }
                },
                '#rose-container .rose-tab-group li.active': {
                    'children': {},
                    'attributes': {
                        'background': '#222'
                    }
                },
                '#rose-container .rose-tab-group li:hover': {
                    'children': {},
                    'attributes': {
                        'background': '#333'
                    }
                },
                '#rose-container .rose-tab-contents': {
                    'children': {},
                    'attributes': {
                        'background': '#222',
                        'padding': '10px'
                    }
                },
                '#rose-container .rose-tab-contents > div button': {
                    'children': {},
                    'attributes': {
                        'margin': '5px'
                    }
                },
                '#rose-container .rose-tab-contents > #rose-output': {
                    'children': {},
                    'attributes': {
                        'background': '#FFF',
                        'overflow': 'auto'
                    }
                },
                '#rose-container .rose-tab-contents > #rose-output.show': {
                    'children': {},
                    'attributes': {
                        'padding': '5px'
                    }
                }
            }
        };
        _styleNode.textContent = CSSJSON.toCSS(_styleObj);
        document.body.appendChild(_styleNode);
    };
    /**
     * Generate a random ID
     *
     * @return {string} Alphanumeric ID
     */
    Rose.prototype.generateID = function () {
        var _id = '';
        // generate random letters (max 4 letters)
        var _charCnt = Math.floor(Math.random() * 4);
        for (var i = 0; i < _charCnt; i++) {
            var str = String.fromCharCode(Math.floor(Math.random() * 25) + 65);
            if (Math.floor(Math.random()) % 2) {
                str = str.toLowerCase();
            }
            _id += str;
        }
        // And add up some random number...
        _id += String(Math.floor(Math.random() * 100000));
        if (this._contents['find'](function (elem) {
            return elem['id'] === _id;
        }) === undefined) {
            return _id;
        } else {
            return this.generateID();
        }
    };
    return Rose;
})();
// Include a Array.prototype.find polyfill for older CEF
if (!Array.prototype['find']) {
    Array.prototype['find'] = function (predicate) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (this === null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = args[0];
        var value;
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}
