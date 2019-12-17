export enum XjsTypes {
  Local = 'local',
  Remote = 'remote',
  Proxy = 'proxy',
}

export enum XjsEnvironments {
  Extension = 'extension',
  Source = 'source',
  Shell = 'shell,',
}

export enum LogVerbosity {
  None = 'none',
  Warning = 'warning',
  Debug = 'debug',
}

export interface Config {
  type?: XjsTypes;
  environment?: XjsEnvironments;
  logVerbosity?: LogVerbosity;
  version?: string;
  sendMessage?: (arg: any) => void; // @TODO: Maybe it makes sense to define a "sendMessage" arguments structure?
  onMessageReceive?: any;
  logger?: any;
}
