/**
 * This class allows detection of the context in which the HTML is located.
 */
export class Environment {
  private static _isSourcePlugin: Boolean;
  private static _isSourceProps: Boolean;
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
    Environment._isSourceProps = (window.external &&
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
   *
   * > #### For Deprecation
   * This method is deprecated and will be removed soon. Please use
   * {@link #core/Environment#isSourceProps isSourceProps} instead.
   *
   * Determines if this HTML is running within the source properties window.
   */
  static isSourceConfig(): Boolean {
    return Environment._isSourceProps;
  }

  /**
   * return: boolean
   *
   * Determines if this HTML is running within the source properties window.
   */
  static isSourceProps(): Boolean {
    return Environment._isSourceProps;
  }

  /**
   * return: boolean
   *
   * Determines if this HTML is running as an extension plugin.
   */
  static isExtension(): Boolean {
    return Environment._isExtension;
  }

  static getVersion(): string {
    let xbcPattern = /XSplit Broadcaster\s(.*?)\s/;
    let xbcMatch = navigator.appVersion.match(xbcPattern);
    if (xbcMatch !== null) {
      return xbcMatch[1];
    } else {
      throw new Error('not loaded in XSplit Broadcaster');
    }
  }
}

Environment.initialize();
