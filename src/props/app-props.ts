class AppProps {
  static scenes = {
    key: 'sceneconfig',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
    setTransformer: (xml: string) => xml,
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
  };

  static sceneIndex = {
    key: 'scene:${view}',
    setValidator: (param: any) => {
      if (
        typeof param !== 'object' ||
        typeof param.value === 'undefined' ||
        typeof param.view === 'undefined'
      ) {
        throw new Error(
          'Parameter should be an object with properties `value` and `view`'
        );
      }

      return true;
    },
    setTransformer: (value: any) => value.value,
    getValidator: param => {
      if (typeof param !== 'object' || typeof param.view === 'undefined') {
        throw new Error(
          'Parameter should be an object with a `value` property'
        );
      }

      return true;
    },
    getTransformer: (sceneIndex: string) => sceneIndex,
  };

  static scenePreset = {
    key: 'scenepreset',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
    setTransformer: (xml: string) => xml,
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
  };

  static scenePresetList = {
    key: 'scenepresetlist',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
    setTransformer: (xml: string) => xml,
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
  };

  static microphoneDev2 = {
    key: 'microphonedev2',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
    setTransformer: (xml: string) => xml,
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
  };

  static wasapiEnum = {
    key: 'wasapienum',
    setValidator: (xml: string) => {
      if (typeof xml !== 'string') {
        throw new Error('Parameter should be a string');
      }

      return true;
    },
    setTransformer: (xml: string) => xml,
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
  };

  static sceneItems = {
    key: 'sceneconfig:${scene}',
    setValidator: (param: any) => {
      if (
        typeof param !== 'object' ||
        typeof param.value === 'undefined' ||
        typeof param.scene === 'undefined'
      ) {
        throw new Error(
          'Parameter should be an object with properties `value` and `scene`'
        );
      }

      return true;
    },
    setTransformer: (value: any) => value.value,
    getValidator: (param: any) => {
      if (typeof param !== 'object' || typeof param.scene === 'undefined') {
        throw new Error(
          'Parameter should be an object with a `scene` property'
        );
      }

      return true;
    },
    // We opted to just return the exact string based on our discussion regarding the tradeoffs
    // on return an object that would represent the "processed" xml config.
    getTransformer: (xml: string) => xml,
  };

  static sceneName = {
    key: 'scenename:${scene}',
    setValidator: (param: any) => {
      if (
        typeof param !== 'object' ||
        typeof param.value === 'undefined' ||
        typeof param.scene === 'undefined'
      ) {
        throw new Error(
          'Parameter should be an object with properties `value` and `scene`'
        );
      }

      return true;
    },
    setTransformer: (value: any) => value.value,
    getValidator: (param: any) => {
      if (typeof param !== 'object' || typeof param.scene === 'undefined') {
        throw new Error(
          'Parameter should be an object with a `scene` property'
        );
      }

      return true;
    },
    getTransformer: (name: string) => name,
  };

  static audioDevices = AppProps.microphoneDev2;

  static audioDevicesWASAPI = AppProps.wasapiEnum;
}

export default AppProps;
