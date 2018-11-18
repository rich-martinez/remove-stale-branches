const { fuzzyUserOptionSearch } = require('../fuzzyUserOptionSearch');

/**
 * @description The function is used to create a callback for providing a searchable user option source.
 * The callback intended to be used as a source function for an inquirer prompt.
 * @param {array} branches
 * @returns {function}
 */
exports.createBranchNameSelector = (branches) => {
  return async (answers, input) => {
    const branchSearch = await fuzzyUserOptionSearch(input, branches);

    return branchSearch;
  }
}
