import assert from 'node:assert/strict';

const hostCalls = [];
let callbackId = 0;

Object.defineProperty(globalThis, 'navigator', {
  configurable: true,
  value: {
    appVersion: 'XSplit Broadcaster 3.8.1905.2118 ',
  },
});

globalThis.external = {
  LoadDll(paths) {
    hostCalls.push(['LoadDll', paths]);
    return '0';
  },
  CallDll(funcName, ...params) {
    hostCalls.push(['CallDll', funcName, ...params]);
    if (funcName === 'xsplit.EnumParentWindows') {
      return '65750,131452,132324';
    }
    return undefined;
  },
  CallDllEx(funcName, ...params) {
    hostCalls.push(['CallDllEx', funcName, ...params]);
    if (funcName === 'xsplit.Exists') {
      return '1';
    }
    return undefined;
  },
  CheckDllGrant() {
    hostCalls.push(['CheckDllGrant']);
    return '1';
  },
  CallHostFunc(funcName, ...params) {
    hostCalls.push(['CallHostFunc', funcName, ...params]);
    if (funcName === 'getProperty' && params[0] === 'html:language') {
      callbackId += 1;
      const asyncId = `language_info_${callbackId}`;
      queueMicrotask(() => {
        globalThis.OnAsyncCallback(asyncId, 'es');
      });
      return asyncId;
    }
    return undefined;
  },
};

const xjs = await import(new URL('../../dist/xjs.mjs', import.meta.url));

assert.equal(await xjs.Dll.load(['Scriptdlls\\SplitMediaLabs\\XjsEx.dll']), '0');
assert.equal(await xjs.Dll.call('xsplit.EnumParentWindows'), '65750,131452,132324');
await assert.rejects(() => xjs.Dll.call('missing.SafeFunction'), /DLL call not accessible/);
assert.equal(await xjs.Dll.callEx('xsplit.Exists', 'C:\\test.txt'), '1');
await assert.rejects(() => xjs.Dll.callEx('missing.UnsafeFunction'), /DLL call not accessible/);
assert.equal(await xjs.Dll.isAccessGranted(), true);

const dllEvents = [];
xjs.Dll.on('access-granted', () => dllEvents.push('granted'));
xjs.Dll.on('access-revoked', () => dllEvents.push('revoked'));
globalThis.Setdlldogrant('1');
globalThis.UpdateLocalProperty('prop:dlldogrant', '0');
assert.deepEqual(dllEvents, ['granted', 'revoked']);

const languageEvents = [];
xjs.LanguageInfo.on('language-change', (event) => languageEvents.push(event));
globalThis.SetEvent('event=LanguageChanged&lang=es');
assert.deepEqual(languageEvents, [{ lang: 'es' }]);
assert.equal(await xjs.LanguageInfo.getCode(), 'es');

assert.deepEqual(hostCalls, [
  ['LoadDll', 'Scriptdlls\\SplitMediaLabs\\XjsEx.dll'],
  ['CallDll', 'xsplit.EnumParentWindows'],
  ['CallDll', 'missing.SafeFunction'],
  ['CallDllEx', 'xsplit.Exists', 'C:\\test.txt'],
  ['CallDllEx', 'missing.UnsafeFunction'],
  ['CheckDllGrant'],
  ['CallHostFunc', 'getProperty', 'html:language'],
]);
