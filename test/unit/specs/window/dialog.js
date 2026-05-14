/* globals describe, it, spyOn, require, beforeEach, expect, jasmine */

describe('Dialog ===', () => {
  var XJS = require('xjs');
  var Dialog = XJS.Dialog;
  var Rectangle = XJS.Rectangle;
  var env = new window.Environment(XJS);
  var environments = ['props', 'extension', 'plugin'];
  var isSubscribed = false;
  var DialogObj = {};

  describe('should call a new dialog', () => {
    var normalDialog, autoDialog, closeOk;

    beforeEach(() => {
      env.set(environments[1]);
      normalDialog = Dialog.createDialog('https://www.someWebsite.com/');
      autoDialog = Dialog.createAutoDialog('https://www.someWebsite.com/');

      spyOn(external, 'SetDialogResult').and.callFake((result) => {
        DialogObj['result'] = result;
      });

      spyOn(external, 'Close').and.callFake((result) => {
        DialogObj['closed'] = true;
      });

      spyOn(external, 'CloseDialog').and.callFake(() => {
        closeOk = true;
      });

      spyOn(external, 'NewDialog').and.callFake(function () {
        DialogObj['url'] = arguments[0];
        DialogObj['size'] = arguments[2];
        DialogObj['title'] = arguments[4];

        var flags = Number(arguments[3]);
        if (flags >= 16) {
          DialogObj['maximize'] = true;
          flags = flags - 16;
        } else {
          DialogObj['maximize'] = false;
        }

        if (flags >= 8) {
          DialogObj['minimize'] = true;
          flags = flags - 8;
        } else {
          DialogObj['minimize'] = false;
        }

        if (flags >= 4) {
          DialogObj['resizable'] = true;
          flags = flags - 4;
        } else {
          DialogObj['resizable'] = false;
        }

        if (flags >= 2) {
          flags = flags - 2;
        }

        if (flags >= 1) {
          DialogObj['showBorder'] = true;
          flags = flags - 1;
        } else {
          DialogObj['showBorder'] = false;
        }
      });
    });

    afterEach(() => {
      env.set(environments[1]);
    });

    it('from a URL', () => {
      expect(normalDialog).toBeInstanceOf(Dialog);
      // not from source
      expect(() => {
        env.set(environments[2]);
        var testDialog = Dialog.createDialog('https://www.someWebsite.com/');
      }).toThrow();
    });

    it('with an option to make it auto-closing', () => {
      expect(normalDialog).toBeInstanceOf(Dialog);
      // not from source
      expect(() => {
        env.set(environments[2]);
        var testDialog = Dialog.createAutoDialog('https://www.someWebsite.com/');
      }).toThrow();
      // not from source props
      expect(() => {
        env.set(environments[0]);
        var testDialog = Dialog.createAutoDialog('https://www.someWebsite.com/');
      }).toThrow();
    });

    it('which can return a value to its parent dialog', () => {
      DialogObj['result'] = '';
      DialogObj['closed'] = false;
      var newReturn = randomWord(10);
      Dialog.return(newReturn).then(() => {
        expect(DialogObj['result']).toEqual(newReturn);
        expect(DialogObj['closed']).toBe(true);
      });
    });

    it('which can be pre-sized', () => {
      var newWidth = randomInt(1, 9999);
      var newHeight = randomInt(1, 9999);
      normalDialog.setSize(newWidth, newHeight);
      expect(normalDialog._size).toBeInstanceOf(Rectangle);
      expect(normalDialog._size.getWidth()).toEqual(newWidth);
      expect(normalDialog._size.getHeight()).toEqual(newHeight);
    });

    it('which can be pre-titled', () => {
      var newTitle = randomWord(15);
      normalDialog.setTitle(newTitle);
      expect(normalDialog._title).toBeTypeOf('string');
      expect(normalDialog._title).toEqual(newTitle);
      // not for auto-closing
      expect(() => {
        var testDialog = Dialog.createAutoDialog('https://www.someWebsite.com/');
        testDialog.setTitle(newTitle);
      }).toThrow();
    });

    it('which can be preconfigured with borders', () => {
      var showBorder = randomBoolean();
      var resizable = randomBoolean();
      normalDialog.setBorderOptions(showBorder, resizable);
      expect(normalDialog._showBorder).toEqual(showBorder);
      expect(normalDialog._resizable).toEqual(resizable);
      // not for auto-closing
      expect(() => {
        var testDialog = Dialog.createAutoDialog('https://www.someWebsite.com/');
        testDialog.setBorderOptions(showBorder, resizable);
      }).toThrow();
    });

    it('which can be preconfigured with buttons', () => {
      var minimize = randomBoolean();
      var maximize = randomBoolean();
      normalDialog.setButtons(minimize, maximize);
      expect(normalDialog._minimize).toEqual(minimize);
      expect(normalDialog._maximize).toEqual(maximize);
      // not for auto-closing
      expect(() => {
        var testDialog = Dialog.createAutoDialog('https://www.someWebsite.com/');
        testDialog.setButtons(minimize, maximize);
      }).toThrow();
    });

    it('which will only be shown once ready', () => {
      var someWebsite = randomWord(15);
      var newWidth = randomInt(1, 9999);
      var newHeight = randomInt(1, 9999);
      var newTitle = randomWord(15);
      var showBorder = randomBoolean();
      var resizable = randomBoolean();
      var minimize = randomBoolean();
      var maximize = randomBoolean();

      var testDialog = Dialog.createDialog('https://www.' + someWebsite + '.com/');
      testDialog.setSize(newWidth, newHeight);
      testDialog.setTitle(newTitle);
      testDialog.setBorderOptions(showBorder, resizable);
      testDialog.setButtons(minimize, maximize);
      testDialog.show();

      expect(DialogObj['url']).toEqual('https://www.' + someWebsite + '.com/');
      expect(DialogObj['size']).toEqual(newWidth + ',' + newHeight);
      expect(DialogObj['title']).toEqual(newTitle);
      expect(DialogObj['maximize']).toBe(maximize);
      expect(DialogObj['minimize']).toBe(minimize);
      expect(DialogObj['resizable']).toBe(resizable);
      expect(DialogObj['showBorder']).toBe(showBorder);
    });

    it('whose result can be checked by the parent dialog', (done) => {
      var newResult = randomWord(20);
      normalDialog.show();
      normalDialog.getResult().then((result) => {
        expect(result).toEqual(newResult);
        done();
      });
      window.OnDialogResult(newResult);
    });

    it('which can be closed by its parent', () => {
      closeOk = false;
      normalDialog.close();
      expect(closeOk).toBe(true);
    });
  });
});
