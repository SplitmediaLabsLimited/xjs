export const minVersion = '2.8.1603.0401';

export function versionCompare(version: string): any {
  const parts = version.split('.');
  const comp = (prev, curr, idx) => {
    if ((parts[idx] < curr && prev !== -1) || prev === 1) {
      return 1;
    } else if (parts[idx] > curr || prev === -1) {
      return -1;
    } else {
      return 0;
    }
  }

  return {
    is: {
      lessThan: (compare: string) => {
        let cParts = compare.split('.');
        return cParts.reduce(comp, parts[0]) === 1;
      },
      greaterThan: (compare: string) => {
        let cParts = compare.split('.');
        return cParts.reduce(comp, parts[0]) === -1;
      },
      equalsTo: (compare: string) => {
        let cParts = compare.split('.');
        return cParts.reduce(comp, parts[0]) === 0;
      }
    }
  };
}

export function getVersion(): string {
  let xbcPattern = /XSplit Broadcaster\s(.*?)\s?/;
  let xbcMatch = navigator.appVersion.match(xbcPattern);
  if (xbcMatch !== null) {
    return xbcMatch[1];
  } else {
    throw new Error('not loaded in XSplit Broadcaster');
  }
}
