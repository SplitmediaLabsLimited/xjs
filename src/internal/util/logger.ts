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
        Logger.warnMessage = 'Info: ' + warnCaller +' accesses a source property,' +
        ' which is shared by all items linked to the source. Setting this property' +
        ' will affect all linked items.'
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