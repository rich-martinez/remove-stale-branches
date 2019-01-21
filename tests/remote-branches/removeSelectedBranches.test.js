const { asyncForEach } = require('../../src/shared/asyncForEach')
const { remoteBranchDeletionCallback } = require('../../src/remote-branches/remoteBranchDeletionCallback');
const { removeSelectedBranches }  = require('../../src/remote-branches/removeSelectedBranches');

jest.mock('../../src/shared/asyncForEach');
jest.mock('../../src/remote-branches/remoteBranchDeletionCallback');

test('Selected branch were removed.', async () => {
  const branchesToRemove = ['branch1', 'branch2'];
  const remote = 'origin';

  asyncForEach.mockResolvedValueOnce(branchesToRemove);

  const successfullyRemovedBranches = await removeSelectedBranches(branchesToRemove, remote);

  expect(asyncForEach).toBeCalledTimes(1);
  expect(asyncForEach).toBeCalledWith([
    {branch: 'branch1', remote: 'origin'},
    {branch: 'branch2', remote: 'origin'},
  ], remoteBranchDeletionCallback);
  expect(successfullyRemovedBranches).toEqual(branchesToRemove);
});
