import {exec} from '../internal/internal';

/**
 *  The Dll class allows access to functions in DLL files that are placed within
 *  the Scriptdlls folder.
 */
export class Dll {

  /**
   *  param: (funcName: string, ...params: any[])
   *  return: _any_ (see DLL documentation)
   *
   *  Calls a function from a DLL. Note that function name collisions may be
   *  possible so ideally your DLLs should have namespaced function names;
   *  otherwise, the first DLL to be found containing the function name will be
   *  called.
   *
   *  The return value will depend on the DLL call. Most synchronous calls will
   *  return a string value immediately, while those with callbacks may simply
   *  return an integer identifier for the callback. See the documentation of
   *  your specific DLL for more details.
   */
  static callFunction(func: string, ...params: any[]): any {
    let funcName: string = params.shift();
    return exec('CallDll', funcName, params);
  }
}
