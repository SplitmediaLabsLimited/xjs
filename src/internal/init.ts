/// <reference path="../../defs/es6-promise.d.ts" />

import {Environment} from '../core/environment';
import {Item} from './item';
import {exec} from './internal';
import {Global} from './global';
import {SourcePropsWindow} from '../window/config';
import {minVersion, versionCompare, getVersion} from './util/version';

function resolveRelativePath(path: string, base: string) {
  // ABSOLUTE PATHS
  if (path.substring(0, 7) === 'http://' ||
      path.substring(0, 8) === 'https://') {
      return path;
  } else if (path.substring(0, 2) === '//') {
    // get current protocol
      return base.split('://')[0] + ':' + path;
  } else if (path.substring(0, 3) === '../') {
      // RELATIVE PATHS
      let upDirectoryCount = 0;
      // count ../ segments
      while (path.substring(0, 3) === '../') {
          path = path.substring(3);
          ++upDirectoryCount;
      }
      let baseDirectories = base.split('/');
      baseDirectories = baseDirectories.slice(0, length - 1 - upDirectoryCount);
      baseDirectories.push(path);
      return baseDirectories.join('/');
  } else { // captures ./ and URLS without protocols
    if (path.substring(0, 2) === './') {
        path = path.substring(2);
    }
    let baseSegments = base.split('/');
    baseSegments[baseSegments.length - 1] = path;
    return baseSegments.join('/');
  }
}

function readMetaConfigUrl(): Promise<any> {
  return new Promise(resolve => {
    if (Environment.isSourcePlugin()) {
      var configObj = {};
      // initialize config URL if necessary
      var promise = new Promise(resolveInner => {
        exec('GetLocalPropertyAsync', 'prop:BrowserConfiguration', result => {
          resolveInner(result);
        });
      });

      promise.then(browserConfig => {
        try {
          if (browserConfig === '' || browserConfig === 'null') {
            browserConfig = exec('GetConfiguration');
          }
          configObj = JSON.parse(<string>browserConfig);
        }
        catch(e) {

        }
        finally {
          var metas = document.getElementsByTagName('meta');
          for (var i = metas.length - 1; i >= 0; i--) {
            if (metas[i].name === 'xsplit:config-url') {
              let url = resolveRelativePath(
                metas[i].content, window.location.href);
              configObj['configUrl'] = url;
              var persist = {
                configUrl: url
              };
              Global.setPersistentConfig(persist);
              break;
            }
          }
          exec('SetBrowserProperty', 'Configuration', JSON.stringify(configObj));
          resolve();
        }
      });

    } else {
      resolve();
    }
  });
}

function getCurrentSourceId(): Promise<any> {
  return new Promise(resolve => {
    if (
      Environment.isSourceProps() ||
      (
        Environment.isSourcePlugin() &&
        versionCompare(getVersion())
          .is
          .lessThan(minVersion)
      )
    ) {
      // initialize Item.getSource() functions
      exec('GetLocalPropertyAsync', 'prop:id',
        result => {
          let id = result;
          Item.setBaseId(id);
          if (Environment.isSourcePlugin() || Environment.isSourceProps()) {
            Item.lockSourceSlot(id);
          }
          resolve();
        });
    } else {
      resolve();
    }
  });
}

function informWhenConfigLoaded(): Promise<any> {
  return new Promise(resolve => {
    if (Environment.isSourceProps()) {
      window.addEventListener('load', () => {
        try {
          SourcePropsWindow.getInstance().emit('config-load');
        } catch(e) {

        }
        resolve();
      });
    } else {
      resolve(); // other environments don't care if config iframe has loaded
    }
  });
}

export default function init(config: Object): void {
  Global.addInitializationPromise(readMetaConfigUrl());
  Global.addInitializationPromise(getCurrentSourceId());

  if (!(config && config['deferLoad'] !== undefined)) {
    Global.addInitializationPromise(informWhenConfigLoaded());
  }

  if (config && config['listenToItemAdd'] !== undefined) {    
    Global.setListenToItemAdd();
  }

  Promise.all(Global.getInitializationPromises()).then(() => {
    document.dispatchEvent(new CustomEvent('xsplit-js-ready', {
      bubbles: true
    }));
  });
}
