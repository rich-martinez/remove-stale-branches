const { fuzzyUserOptionSearch } = require('../../../shared/fuzzyUserOptionSearch');

/**
 * @description This creates the source function to be used by the mainBranchPrompt.
 * The function is used to provide a searchable user option source
 * @param {array} branches
 */
exports.createSourceFunction = (branches) => {
  return async (answers, input) => {
    const branchSearch = await fuzzyUserOptionSearch(input, branches);

    return branchSearch;
  }
}
