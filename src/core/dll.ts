import {exec} from '../internal/internal';

/**
 *  The Dll class allows access to functions in DLL files that are placed within
 *  the Scriptdlls folder.
 */
export class Dll {

  /**
   *  param: (funcName: string, ...params: string[])
   *  return: string (see DLL documentation)
   *
   *  Calls a function from a DLL. Note that function name collisions are
   *  possible. The first DLL to be found containing the function name will be
   *  called.
   *
   *  Some DLLs have callbacks. Assign a handler function to that callback in
   *  the global namespace, and the DLL will call that function accordingly.
   *
   *  See the documentation of your specific DLL for more details.
   */
  static callFunction(func: string, ...params: string[]): string {
      params.unshift(func);
      params.unshift('CallDll');
      return exec.apply(this, params);
  }
}
