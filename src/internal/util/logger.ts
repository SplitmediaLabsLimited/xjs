export class Logger {

    static onceWarningsShown = {};
    static onceMessage = " (This warning will only be shown once.)";

    static log(message: string) {
        console.log(message);
    }

    static warn(warning: string, once: boolean = false) {
        if (!once) {
            console.warn(warning);
        } else if (!Logger.onceWarningsShown[warning]) {
            console.warn(warning + Logger.onceMessage);
            Logger.onceWarningsShown[warning] = true;
        }
    }
}