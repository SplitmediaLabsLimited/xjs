export class Logger {

    static onceWarningsShown = {};
    static onceMessage = " (This warning will only be shown once.)";
    static sourceMessage = " is a Source specific method. Use this through Source to avoid this warning."

    static log(message: string) {
        console.log(message);
    }

    static warn(warnCaller: any, once: boolean = false) {
        if (!once) {
            console.warn('Warning! ' + warnCaller + Logger.sourceMessage);
        } else if (!Logger.onceWarningsShown[warnCaller]) {
            console.warn('Warning! ' + warnCaller + Logger.sourceMessage +Logger.onceMessage);
            Logger.onceWarningsShown[warnCaller] = true;
        }
    }
}