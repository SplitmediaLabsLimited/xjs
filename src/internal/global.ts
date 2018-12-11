/// <reference path="../../defs/es6-promise.d.ts" />

export class Global {
  private static persistedConfig: {} = {};
  private static initialPromises: Promise<any>[] = [];
  private static listenToItemAdd: boolean = false;

  static addInitializationPromise(promise: Promise<any>): void {
    Global.initialPromises.push(promise);
  }

  static getInitializationPromises(): Promise<any>[] {
    return Global.initialPromises;
  }

  static setPersistentConfig(config: {}): void {
    Global.persistedConfig = config;
  }

  static getPersistentConfig(): {} {
    return Global.persistedConfig;
  }

  static isListenToItemAdd(): boolean {    
    return Global.listenToItemAdd;
  }

   static setListenToItemAdd(): void {    
    Global.listenToItemAdd = true;    
  }
}
