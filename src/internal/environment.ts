export class Environment {
  private static _isHtml: Boolean;
  private static _isConfig: Boolean;
  private static _isScript: Boolean;
  private static _initialized: Boolean;

  static initialize(): void {
    if (Environment._initialized) {
      return;
    }

    Environment._isHtml = (window.external &&
      window.external['GetConfiguration'] !== undefined);
    Environment._isConfig = (window.external &&
      window.external['GetConfiguration'] === undefined &&
      window.external['GetViewId'] !== undefined &&
      window.external['GetViewId']() !== undefined);
    Environment._isScript = (window.external &&
      window.external['GetConfiguration'] === undefined &&
      window.external['GetViewId'] !== undefined &&
      window.external['GetViewId']() === undefined);
    Environment._initialized = true;
  }

  static isSourceHtml(): Boolean {
    return Environment._isHtml;
  }

  static isSourceConfig(): Boolean {
    return Environment._isConfig;
  }

  static isScriptPlugin(): Boolean {
    return Environment._isScript;
  }
}

Environment.initialize();
