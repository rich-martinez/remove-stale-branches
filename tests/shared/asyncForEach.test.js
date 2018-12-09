const { asyncForEach } = require('../../src/shared/asyncForEach');

test('Empty array will not invoke callback', async () => {
  const branches = [];
  const callback = jest.fn();
  await asyncForEach(branches, callback);

  expect(callback).toBeCalledTimes(0);
});

test('Array with multiple items will not invoke callback with expected arguments', async () => {
  const branches = ['branch1', 'branch2'];
  const callback = jest.fn();
  await asyncForEach(branches, callback);

  expect(callback).toBeCalledTimes(2);
  expect(callback).nthCalledWith(1, 'branch1', 0, branches);
  expect(callback).nthCalledWith(2, 'branch2', 1, branches);
});
