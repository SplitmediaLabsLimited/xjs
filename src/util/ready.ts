/// <reference path="../../defs/es6-promise.d.ts" />

let isReady: boolean = false;
let readyPromise: Promise<any> = new Promise(resolve => {
  document.addEventListener('xsplit-js-ready', () => {
    resolve();
  });

  if (isReady) {
    resolve();
  }
});

export function ready(): Promise<any> {
  return readyPromise;
}

export function setReady() {
  isReady = true;
}
