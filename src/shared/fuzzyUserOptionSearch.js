const { filter } = require('fuzzy')

/**
 * @param {string} userInput
 * @param {array} searchableItems
 * @returns {Promise}
 */
exports.fuzzyUserOptionSearch = async (userInput, searchableItems) => {
  userInput = userInput || ''
  let fuzzyResult = await filter(userInput, searchableItems)

  return fuzzyResult.map(item => item.original)
}
