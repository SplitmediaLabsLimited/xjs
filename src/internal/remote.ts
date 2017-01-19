/// <reference path="../../defs/es6-promise.d.ts" />

export class Remote {

  static receive(funcName, id, ...args) {
    console.log(arguments)
  }
}