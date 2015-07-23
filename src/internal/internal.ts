interface Window {
    OnAsyncCallback: Function;
    OnSceneLoad: Function;
    SetConfiguration: Function;
    SetBackGroundColor: Function;
    SetVolume: Function;
    OnDialogResult: Function;
}

export var DEBUG: boolean = false;

let _callbacks = {};

/**
* Executes an external function
*/
export function exec(funcName: string, ...args: any[]) {
  let callback: Function = null,
  ret: any = false;

  if (args.length > 0) {
    callback = args[args.length - 1];
    if (callback instanceof Function) {
      args.pop();
    } else {
      callback = null;
    }
  }

  if (DEBUG) {
    console.log([
      'internal.exec("', funcName, '") ', JSON.stringify(args)
      ].join(' '));
  }

  if (
    window.external &&
    window.external[funcName] &&
    window.external[funcName] instanceof Function
    ) {
    ret = window.external[funcName].apply(this, args);
  }

  // register callback if present
  if (callback !== null) {
    _callbacks[ret] = callback;
  }

  return ret;
}

window.OnAsyncCallback = function(asyncID: number, result: string) {
  let callback = _callbacks[asyncID];

  if (callback instanceof Function) {
    callback.call(this, decodeURIComponent(result));
  }
};

window.OnSceneLoad = function(view: number, scene: number) {
  document.dispatchEvent(new CustomEvent(
    'scene-load', { detail: { view: view, scene: scene } }
    ));
};


window.SetConfiguration = function(config: string) {
  document.dispatchEvent(new CustomEvent(
    'set-configuration', { config: config }
    ));
};

window.SetBackGroundColor = function(color: string) {
  document.dispatchEvent(new CustomEvent(
    'set-background-color', { color: color }
    ));
};

window.SetVolume = function(volume: string) {
  document.dispatchEvent(new CustomEvent(
    'set-volume', { volume: volume }
    ));
};

window.OnDialogResult = function(result: string) {
  document.dispatchEvent(new CustomEvent(
    'dialog-result', { detail: { result: result } }
    ));
};
