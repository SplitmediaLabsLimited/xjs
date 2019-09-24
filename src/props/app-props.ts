class AppProps {
  static scenes = {
    key: 'sceneconfig',
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value.value,
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
  };

  static scenePreset = {
    key: 'scenepreset',
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value.value,
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
  };

  static scenePresetList = {
    key: 'scenepresetlist',
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value.value,
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
  };

  static microphoneDev2 = {
    key: 'microphonedev2',
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value.value,
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
  };

  static wasapiEnum = {
    key: 'wasapienum',
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value.value,
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
  };

  static sceneItems = {
    key: 'sceneconfig:{scene}',
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value.value,
    getValidator: (param: any) => typeof param.scene !== 'undefined',
    // We opted to just return the exact string based on our discussion regarding the tradeoffs
    // on return an object that would represent the "processed" xml config.
    getTransformer: (xml: string) => xml,
  };

  static sceneName = {
    key: 'scenename:{scene}',
    setValidator: (param: any) =>
      typeof param.scene !== 'undefined' && param.name !== 'undefined',
    setTransformer: (value: any) => value.value,
    getValidator: (param: any) => typeof param.scene !== 'undefined',
    getTransformer: (name: string) => name,
  };

  static audioDevices = AppProps.microphoneDev2;

  static audioDevicesWASAPI = AppProps.wasapiEnum;
}

export default AppProps;
