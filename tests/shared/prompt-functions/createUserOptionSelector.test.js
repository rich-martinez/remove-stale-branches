const { createUserOptionSelector } = require('../../../src/shared/prompt-functions/createUserOptionSelector');

test('Calling createUserOptionSelector creates expected async function', async () => {
  const options = ['user option 1', 'user option 2'];
  const expectedReturnValue = `async (answers, input) => {
    const optionSearch = await fuzzyUserOptionSearch(input, options);

    return optionSearch;
  }`;
  const userOptionSelector = createUserOptionSelector(options);

  expect(typeof userOptionSelector).toBe('function');
  expect(userOptionSelector.toString()).toBe(expectedReturnValue);
});