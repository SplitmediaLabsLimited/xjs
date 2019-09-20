class AppProps {
  static scenes = {
    key: 'sceneconfig',
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value,
  };

  static scenePreset = {
    key: 'scenepreset',
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value,
  };

  static scenePresetList = {
    key: 'scenepresetlist',
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value,
  };

  static microphoneDev2 = {
    key: 'microphonedev2',
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value,
  };

  static wasapiEnum = {
    key: 'wasapienum',
    getValidator: () => true,
    getTransformer: (xml: string) => xml,
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value,
  };

  static sceneItems = {
    key: 'sceneconfig:{scene}',
    getValidator: (param: any) => typeof param.scene !== 'undefined',
    // We opted to just return the exact string based on our discussion regarding the tradeoffs
    // on return an object that would represent the "processed" xml config.
    getTransformer: (xml: string) => xml,
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value,
  };

  static audioDevices = AppProps.microphoneDev2;

  static audioDevicesWASAPI = AppProps.wasapiEnum;
}

export default AppProps;
