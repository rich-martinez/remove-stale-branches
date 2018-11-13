const fuzzy = require('fuzzy')

/**
 * @param {string} userInput
 * @param {array} searchableItems
 * @returns {Promise}
 */
exports.fuzzyUserOptionSearch = async (userInput, searchableItems) => {
  userInput = userInput || ''
  let fuzzyResult = await fuzzy.filter(userInput, searchableItems)

  return fuzzyResult.map(item => item.original)
}
