/**
 * ItemProps testing the documentation tool
 * @type {Object}
 */
class ItemProps {
  static customName = {
    key: 'prop:cname',
    setValidator: (name: any) => {
      if (typeof name !== 'string') {
        throw new Error(`${name} is not a string`);
      }

      return true;
    },
    setTransformer: (name: any) => name,
    getValidator: () => true,
    getTransformer: (name: any) => name,
  };

  static position = {
    key: 'prop:pos',
    setValidator: (pos: any) => {
      if (typeof pos !== 'object') {
        throw new Error(`${pos} is not an object`);
      }

      const requiredKeys = ['left', 'top', 'right', 'bottom'];

      for (let idx = 0; idx < requiredKeys.length; idx += 1) {
        if (!pos.hasOwnProperty(requiredKeys[idx])) {
          throw new Error(`${requiredKeys[idx]} is required!`);
        }
      }

      return true;
    },
    setTransformer: (pos: any) => {
      const parsed = Object.keys(pos).reduce((stack: any, key: string) => {
        const decimal = Number(pos[key]) / 100;

        return {
          ...stack,
          [key]: Math.min(Math.max(0, decimal), 1).toFixed(1),
        };
      }, {});

      return `${parsed.left},${parsed.top},${parsed.right},${parsed.bottom}`;
    },
    getValidator: () => {
      return true;
    },
    getTransformer: (value: any) => {
      const posArray = String(value).split(',');
      const order = ['left', 'top', 'right', 'bottom'];

      // Convert them to percents??
      return posArray.reduce((stack: any, pos: string, index: number) => {
        return {
          ...stack,
          [order[index]]: Number(pos) * 100,
        };
      }, {});
    },
  };

  static visibility = {
    key: 'prop:visible',
    setValidator: (isVisible: any) => {
      if (typeof isVisible !== 'boolean') {
        throw new Error(`${isVisible} should be a boolean`);
      }

      return true;
    },
    setTransformer: (isVisible: any) => (isVisible ? '1' : '0'),
    getValidator: () => true,
    getTransformer: (isVisible: any) => isVisible === '1',
  };

  static item = {
    key: 'prop:item',
    setValidator: (value: any) => true,
    setTransformer: (value: any) => value,
    getValidator: () => true,
    getTransformer: (value: any) => value,
  };

  static type = {
    key: 'prop:type',
    // @TODO: Verify with @mikey if we would want to prevent users from setting item type...
    setValidator: (invalid: any) => {
      throw new Error('I believe we cannot set the item type...');
    },
    setTransformer: () => {
      throw new Error('I believe we cannot set the item type...');
    },
    getValidator: () => true,
    getTransformer: (type: any) => {
      // @TODO: Should we just return strings???
      const types = {
        0x0: 'undefined',
        0x1: 'file',
        0x2: 'live',
        0x3: 'text',
        0x4: 'bitmap',
        0x5: 'screen',
        0x6: 'flash',
        0x7: 'games',
        0x8: 'html',
        0x9: '3ds',
        0xa: 'ppt',
        0xb: 'scene',
        0xc: 'group',
        0xd: 'replay',
      };

      return types[type];
    },
  };
}

export default ItemProps;
