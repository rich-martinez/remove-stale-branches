const { fuzzyUserOptionSearch } = require('../../../shared/fuzzyUserOptionSearch');

/**
 * @description This creates the source function to be used by the stalenessRemovalOptionsPrompt.
 * The function is used to provide a searchable user option source
 * @param {array} stalenessRemovalOption
 * @returns {function}
 */
exports.createSourceFunction = (stalenessRemovalOptions) => {
  return async (answers, input) => {
    const stalenessRemovalOption = await fuzzyUserOptionSearch(input, stalenessRemovalOptions);

    return stalenessRemovalOption;
  }
}