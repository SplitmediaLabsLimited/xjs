/// <reference path="../../defs/es6-promise.d.ts" />
import {exec} from './internal'

export class Remote {
  static connection;

  static receiveMessage(funcName: string, asyncId: number, ...args:any[]) {
    console.log('Got::', arguments)
  }

  static sendMessage(funcName: string, asyncId?: number, ...args:any[]) {
    console.log('Send::', funcName)
     if (asyncId === undefined) {
      asyncId = Math.round(Math.random() * 1000)
    }
    let message = {
                  funcName,
                  asyncId
    }
    // Remote.connection.send(message)
  }

  static returnResult(result: any, asyncId?: number) {
    let xbcPattern = /XSplit Broadcaster\s(.*?)\s/;
    let xbcMatch = result.match(xbcPattern);
    console.log('Return::', xbcMatch[1])
    Remote.connection.send(xbcMatch[1])
  }

  static setConnection(con) {
    Remote.connection = con;
  }
}