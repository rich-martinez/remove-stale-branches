const { createUserOptionSelector } = require('../../../src/shared/prompt-functions/createUserOptionSelector');
const { fuzzyUserOptionSearch } = require('../../../src/shared/fuzzyUserOptionSearch');

jest.mock('../../../src/shared/fuzzyUserOptionSearch');

test('Calling createUserOptionSelector creates expected async function', async () => {
  const options = ['user option 1', 'user option 2'];
  const expectedFuzzySearchResult = 'fuzzy filtered value';
  fuzzyUserOptionSearch.mockReturnValue(Promise.resolve(expectedFuzzySearchResult));

  const userOptionSelector = createUserOptionSelector(options);
  const fuzzySearch = await userOptionSelector(undefined, 'some value');

  expect(typeof userOptionSelector).toBe('function');
  expect(fuzzySearch).toBe(expectedFuzzySearchResult);
});
