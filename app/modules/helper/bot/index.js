const isObject = obj =>
  Object.prototype.toString.call(obj) === '[object Object]';

export const generateAllRoute = (obj, pre) => {
  const keys = Object.keys(obj);
  const prefix = pre ? `${pre}.` : '';
  return keys.reduce((result, key) => {
    if (isObject(obj[key])) {
      result = result.concat(generateAllRoute(obj[key], prefix + key));
    } else {
      result.push(prefix + key);
    }
    return result;
  }, []);
};
