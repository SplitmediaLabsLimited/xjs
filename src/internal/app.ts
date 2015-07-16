/// <reference path="../../defs/_references.ts" />

export class App {
  /** Get the value of the given property */
  static get(name: string): Promise<string> {
    return Promise.resolve(""); 
  }

  /** Sets the value of a property */
  static set(name: string, value: string): Promise<Boolean> {
    return Promise.resolve(true);
  }
}
