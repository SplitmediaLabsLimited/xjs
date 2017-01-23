/// <reference path="../../defs/es6-promise.d.ts" />
import {exec} from './internal'

export class Remote {
  static connection;

  static receiveMessage(funcName: string, asyncId?: number, ...args:any[]) {
    console.log('Got::', funcName)
    if (funcName === 'getVersion') {
    let version = window.navigator.appVersion
    let xbcPattern = /XSplit Broadcaster\s(.*?)\s/;
    let xbcMatch = version.match(xbcPattern);
      if(xbcMatch !== null) {
        Remote.returnResult(xbcMatch[1])
      }
    } else {
      exec(funcName, asyncId, ...args)
    }
  }

  static sendMessage(funcName: string, asyncId?: number, ...args:any[]) {
    console.log('Send::', funcName)
     if (asyncId === undefined) {
      asyncId = Math.round(Math.random() * 1000)
    }
    let message = ({
                  result: funcName,
                  asyncId
    })
    Remote.connection.send(funcName)
  }

  static returnResult(result: any, asyncId?: number) {
    console.log('Return::', result)
    Remote.connection.send(result)
  }

  static setConnection(con) {
    Remote.connection = con;
  }
}