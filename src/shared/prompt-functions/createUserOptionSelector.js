const { fuzzyUserOptionSearch } = require('../fuzzyUserOptionSearch');

/**
 * @description The function is used to create a callback for providing a searchable user option source.
 * The callback intended to be used as a source function for an inquirer prompt.
 * @param {array} options
 * @returns {function}
 */
exports.createUserOptionSelector = (options) => {
  return async (answers, input) => {
    const optionSearch = await fuzzyUserOptionSearch(input, options);

    return optionSearch;
  }
}
