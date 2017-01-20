/// <reference path="../../defs/es6-promise.d.ts" />

import {setMockVersion} from '../internal/util/version';
import init from '../internal/init';
import {Remote} from '../internal/remote'

let isReady: boolean = false;
let isInit: boolean = false;
let remoteType: string = 'proxy';
let sendMessage: string;
const connection = new WebSocket('ws://localhost:1337');
Remote.setConnection(connection);

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
    if(config['remote']['type'] !== undefined) {
      remoteType = config['remote']['type'];
      sendMessage = config['remote']['sendMessage'];
    }
  }

  setReady();
  if (isReady && !isInit) {
    setOnce();
    init();
    if(remoteType === 'proxy') {
      connection.onopen = function () {
        connection.send('EXT')
      };
      getRemoteVersion()
    } else {
      connection.send('WEB')
    }
  }

  return readyPromise;
}

export function setReady() {
  isReady = true;
}

export function setOnce() {
  isInit = true;
}

export function getRemoteVersion() {
  console.log('Get Remote')
  let xbcPattern = /XSplit Broadcaster\s(.*?)\s/;
  let xbcMatch = navigator.appVersion.match(xbcPattern);

  Remote.sendMessage('navigator')
}

connection.onmessage = function (message) {
  //decode message first then
  // Remote.receiveMessage(message)
  console.log(message)
}