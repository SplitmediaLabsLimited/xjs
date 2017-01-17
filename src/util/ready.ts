/// <reference path="../../defs/es6-promise.d.ts" />

import {setMockVersion} from '../internal/util/version';
import init from '../internal/init';
import {remoteExec} from '../internal/internal'

let isReady: boolean = false;
let isInit: boolean = false;
let xjsRemoteVersion: string;

let readyPromise: Promise<any> = new Promise(resolve => {
  document.addEventListener('xsplit-js-ready', () => {
    resolve();
  });

  if (isReady) {
    resolve();
  }
});

export function ready(config: Object): Promise<any> {
  if (config && config['version'] !== undefined) {
    setMockVersion(config['version']);
  }
  if (config && config['remote'] !== undefined) {
    setMockVersion(xjsRemoteVersion);
  }

  setReady();
  if (isReady && !isInit) {
    setOnce();
    init();
  }

  return readyPromise;
}

export function setReady() {
  isReady = true;
}

export function setOnce() {
  isInit = true;
}

// Remote Receiver and Sender
  var connection = new WebSocket('ws://localhost:1337');

  // resolve object and send
  connection.onmessage = function(message: string, ...args: any[]) {
    var json = JSON.parse(message.data);

    if (json.type === 'message') {
      remoteExec(message, args)
      .then(res => {
        console.log('From Exec::', res)
        // connection.send(res)
      })
    }
  }
/**
 * 1. Once connection is established, let xjs get remote version by sending
 * navigator.userAgent and set the version on Remote.
 * 2. After this, xjs.ready() can be called
 */

// Get client version before ready
export function remoteVersion(version: string): Promise<string> {
  return new Promise(resolve => {
    let verArray = version.split(' ');
      for (var i = 0; i< verArray.length; i++) {
        if (verArray[i] === 'Broadcaster'){
          xjsRemoteVersion = verArray[i+1]
        }
      }
    resolve();
  })
}


