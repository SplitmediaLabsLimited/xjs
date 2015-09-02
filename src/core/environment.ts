export class Environment {
  private static _isSourcePlugin: Boolean;
  private static _isSourceConfig: Boolean;
  private static _isExtension: Boolean;
  private static _initialized: Boolean;

  static initialize(): void {
    if (Environment._initialized) {
      return;
    }

    Environment._isSourcePlugin = (window.external &&
      window.external['GetConfiguration'] !== undefined);
    Environment._isSourceConfig = (window.external &&
      window.external['GetConfiguration'] === undefined &&
      window.external['GetViewId'] !== undefined &&
      window.external['GetViewId']() !== undefined);
    Environment._isExtension = (window.external &&
      window.external['GetConfiguration'] === undefined &&
      window.external['GetViewId'] !== undefined &&
      window.external['GetViewId']() === undefined);
    Environment._initialized = true;
  }

  static isSourcePlugin(): Boolean {
    return Environment._isSourcePlugin;
  }

  static isSourceConfig(): Boolean {
    return Environment._isSourceConfig;
  }

  static isExtension(): Boolean {
    return Environment._isExtension;
  }
}

Environment.initialize();
