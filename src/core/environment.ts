/**
 * This class allows detection of the context in which the HTML is located.
 */
export class Environment {
  private static _isSourcePlugin: Boolean;
  private static _isSourceConfig: Boolean;
  private static _isExtension: Boolean;
  private static _initialized: Boolean;

  /**
   * This method is only used internally.
   */
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

  /**
   * return: boolean
   *
   * Determines if this HTML is running as a source.
   */
  static isSourcePlugin(): Boolean {
    return Environment._isSourcePlugin;
  }

  /**
   * return: boolean
   * Determines if this HTML is running within the source configuration window.
   */
  static isSourceConfig(): Boolean {
    return Environment._isSourceConfig;
  }

  /**
   * return: boolean
   *
   * Determines if this HTML is running as an extension plugin.
   */
  static isExtension(): Boolean {
    return Environment._isExtension;
  }
}

Environment.initialize();
