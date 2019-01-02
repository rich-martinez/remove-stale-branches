/**
 * @description This is intended to be an async alternative to Array.prototype.forEach(). In addition to that
 * It will also return an array of any defined values that were returned by the callback(s).
 * @param {array} array
 * @param {function} callback
 * @param {array} callbackReturnValues - This will be populated if any of the callbacks return a defined value.
 * @returns {array}
 */
exports.asyncForEach = async (array, callback, callbackReturnValues = []) => {
  for (let index = 0; index < array.length; index++) {
    const callbackReturnValue = await callback(array[index], index, array)
    if (callbackReturnValue !== undefined) {
      callbackReturnValues.push(callbackReturnValue)
    }
  }

  return callbackReturnValues
}
