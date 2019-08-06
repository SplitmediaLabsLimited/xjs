const props = {
  customName: {
    key: 'prop:cname',
    setValidator: (param: any) => {
      if (typeof param !== 'string') {
        throw new Error(`${param} is not a string`);
      }

      return typeof param === 'string';
    },
    setTransformer: (param: any) => {
      return param;
    },
  },
};
