const { createStringTrimFilter } = require('../../../src/shared/prompt-functions/createStringTrimFilter');

test('Creating a string trimming filter should return a function that can trim a string.', async () => {
  const stringFilter = createStringTrimFilter();

  expect(typeof stringFilter).toBe('function');
  expect(stringFilter(' some value ')).toBe('some value');
});
