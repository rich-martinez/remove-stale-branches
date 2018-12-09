/**
 * @description This is intended to be an async alternative to Array.prototype.forEach().
 * @param {array} array
 * @param {function} callback
 */
exports.asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
