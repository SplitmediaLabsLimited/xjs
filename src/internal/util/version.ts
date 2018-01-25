/*
* List here the versions where we would limit a functionality.
*/

export const minVersion = '2.8.1603.0401';
export const deleteSceneEventFixVersion = '2.8.1606.1601';
export const addSceneEventFixVersion = '2.8.1606.1701';
export const handlePreStreamDialogFixVersion = '3.1.1707.3101';
export const globalsrcMinVersion = '2.9'
export const itemSubscribeEventVersion = '2.9.1608.2301';
export const sceneUidMinVersion = '3.0.1704.2101';

export let mockVersion = '';

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
      },
      greaterThanOrEqualTo: (compare: string) => {
        let cParts = compare.split('.');
        return cParts.reduce(comp, parts[0]) === -1 || cParts.reduce(comp, parts[0]) === 0;
      }
    }
  };
}

export function setMockVersion(version: string) {
  mockVersion = version;
}

export function getVersion(): string {
  let xbcPattern = /XSplit Broadcaster\s(.*?)\s/;
  let xbcMatch = navigator.appVersion.match(xbcPattern);
  xbcMatch = xbcMatch || mockVersion.match(xbcPattern);

  if (xbcMatch !== null) {
    return xbcMatch[1];
  } else {
    throw new Error('not loaded in XSplit Broadcaster');
  }
}
