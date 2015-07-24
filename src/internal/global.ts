/// <reference path="../../defs/es6-promise.d.ts" />

export class Global {
  private static persistedConfig: {} = {};
  private static initialPromises: Promise<any>[] = [];

  static addInitializationPromise(promise: Promise<any>): void {
    Global.initialPromises.push(promise);
  }

  static getInitializationPromises(): Promise<any>[] {
    return Global.initialPromises;
  }

  static setPersistentConfig(config: {}): void {
    console.log('setting persistent config: ' + JSON.stringify(config));
    Global.persistedConfig = config;
  }

  static getPersistentConfig(): {} {
    return Global.persistedConfig;
  }
}
