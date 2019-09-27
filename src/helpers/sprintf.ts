/**
 * String pattern replace thingy, something like the built-in ${}
 */
export default function(str, param, shouldPopParam = false) {
  const regex = new RegExp('\\${(\\w+)}', 'g');

  let match = regex.exec(str);
  let retStr = str;

  while (match) {
    const [matchedStr, key] = match;

    if (typeof param[key] !== 'undefined') {
      retStr = retStr.replace(matchedStr, param[key]);

      if (shouldPopParam) {
        delete param[key];
      }
    }

    match = regex.exec(str);
  }

  return retStr;
}
