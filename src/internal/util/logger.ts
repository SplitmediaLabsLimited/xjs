export class Logger {

  static onceWarningsShown = {};
  static onceMessage = " (This warning will only be shown once.)";
  static warnMessage: string;

  static log(message: string) {
    console.log(message);
  }

  static warn(type:string, warnCaller: string, once: boolean = false) {
    switch(type){
      case 'sourceWarning':
        Logger.warnMessage = 'Warning! ' + warnCaller +' is a Source specific method. Use this through Source to avoid this warning.'
        break;
      case 'other':
        //Other conditions that we can add for other warning instances
        break;
      default:
        break;
    }
    if (!once) {
      console.warn(Logger.warnMessage);
    } else if (!Logger.onceWarningsShown[warnCaller]) {
      console.warn(Logger.warnMessage + Logger.onceMessage);
      Logger.onceWarningsShown[warnCaller] = true;
    }
  }
}