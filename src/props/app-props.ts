class AppProps {
  static scenes = {
    key: 'sceneconfig',
    getTransformer: (xml: string) => xml,
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value,
  };

  static scenePreset = {
    key: 'scenepreset',
    getTransformer: (xml: string) => xml,
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value,
  };

  static scenePresetList = {
    key: 'scenepresetlist',
    getTransformer: (xml: string) => xml,
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value,
  };

  static microphoneDev2 = {
    key: 'microphonedev2',
    getTransformer: (xml: string) => xml,
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value,
  };

  static wasapiEnum = {
    key: 'wasapienum',
    getTransformer: (xml: string) => xml,
    setValidator: (param: any) => true,
    setTransformer: (value: any) => value,
  };

  static audioDevices = AppProps.microphoneDev2;

  static audioDevicesWASAPI = AppProps.wasapiEnum;
}
