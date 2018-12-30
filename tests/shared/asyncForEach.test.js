const { asyncForEach } = require('../../src/shared/asyncForEach');

test('Empty array will not invoke callback', async () => {
  const branches = [];
  const callback = jest.fn();
  const result = await asyncForEach(branches, callback);

  expect(callback).toBeCalledTimes(0);
  expect(result).toEqual([]);
});

test('Array with multiple items will invoke callback with expected arguments', async () => {
  const branches = ['branch1', 'branch2', 'branch3'];
  const intialResult = ['initialValue'];
  const expectedResult = intialResult.concat(branches)
  const callback = jest.fn(branch => branch);
  const result = await asyncForEach(branches, callback, intialResult);

  expect(callback).toBeCalledTimes(3);
  expect(callback).nthCalledWith(1, 'branch1', 0, branches);
  expect(callback).nthCalledWith(2, 'branch2', 1, branches);
  expect(callback).nthCalledWith(3, 'branch3', 2, branches);
  expect(result).toEqual(expectedResult);
});
