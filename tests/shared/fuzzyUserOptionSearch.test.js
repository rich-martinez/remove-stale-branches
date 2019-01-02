const { fuzzyUserOptionSearch } = require('../../src/shared/fuzzyUserOptionSearch')

test('User input is falsey and original searchable items are returned.', async () => {
  const searchableItems = ['item1', 'item2', 'item3']

  const result = await fuzzyUserOptionSearch(false, searchableItems)

  expect(result.sort()).toEqual(searchableItems.sort())
})

test('User input is not available in searchable items and no items are returned.', async () => {
  const searchableItems = ['item1', 'item2', 'item3']

  const result = await fuzzyUserOptionSearch('I do not exist', searchableItems)

  expect(result).toEqual([])
})

test('User input is available in searchable items and the filtered searchable items are returned.', async () => {
  const searchableItems = ['fire', 'fired', 'ice']
  const expected = ['fire', 'fired']

  const result = await fuzzyUserOptionSearch('fire', searchableItems)

  expect(result.sort()).toEqual(expected.sort())
})
