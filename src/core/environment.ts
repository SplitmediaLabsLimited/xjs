import { Remote } from '../internal/remote';
import window from '../util/window';

/**
 * This class allows detection of the context in which the HTML is located.
 */
export class Environment {
  private static _isSourcePlugin: boolean;
  private static _isSourceProps: boolean;
  private static _isExtension: boolean;
  private static _initialized: boolean;

  /**
   * This method is only used internally.
   */
  static initialize(): void {
    if (Environment._initialized) {
      return;
    }

    Environment._isSourcePlugin =
      window.external && window.external['GetConfiguration'] !== undefined;
    Environment._isSourceProps =
      window.external &&
      window.external['GetConfiguration'] === undefined &&
      window.external['GetViewId'] !== undefined &&
      window.external['GetViewId']() !== undefined;
    Environment._isExtension =
      window.external &&
      window.external['GetConfiguration'] === undefined &&
      window.external['GetViewId'] !== undefined &&
      window.external['GetViewId']() === undefined;
    Environment._initialized = true;
  }

  /**
   * return: boolean
   *
   * Determines if this HTML is running as a source.
   */
  static isSourcePlugin(): boolean {
    return Environment._isSourcePlugin;
  }

  /**
   * return: boolean
   *
   * Determines if this HTML is running within the source properties window.
   */
  static isSourceProps(): boolean {
    return Environment._isSourceProps;
  }

  /**
   * return: boolean
   *
   * Determines if this HTML is running as an extension plugin.
   */
  static isExtension(): boolean {
    if (Remote.remoteType === 'remote') {
      return true;
    } else {
      return Environment._isExtension;
    }
  }
}
