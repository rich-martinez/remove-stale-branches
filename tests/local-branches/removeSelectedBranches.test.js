const simpleGit = require('simple-git/promise');
const { asyncForEach } = require('../../src/shared/asyncForEach');
const { localBranchDeletionCallback } = require('../../src/local-branches/localBranchDeletionCallback');
const { removeSelectedBranches } = require('../../src/local-branches/removeSelectedBranches');

jest.mock('simple-git/promise');
jest.mock('../../src/shared/asyncForEach')
jest.mock('../../src/local-branches/localBranchDeletionCallback')

const mainBranch = 'master';
const branchesToRemove = ['branch1', 'branch3', 'branch4', 'branch9'];

global.console= {
  log: jest.fn(),
  error: jest.fn(),
};
test('Will not remove selected branches with uncommitted changes.', async () => {
  const simpleGitStatus = jest.fn(() => Promise.resolve({modified: ['some modified changes']}));
  simpleGit.mockReturnValue({status: simpleGitStatus});

  const successfullyRemovedBranches = await removeSelectedBranches(mainBranch, branchesToRemove);

  expect(successfullyRemovedBranches).toEqual([]);
  expect(simpleGitStatus).toBeCalledTimes(1);
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith(`\nTo avoid losing uncommited changes please commit, stash, or reset your changes and then try again.\n`);
});

test('All local branches were successfully removed.', async () => {
  asyncForEach.mockResolvedValue(branchesToRemove);
  const simpleGitStatus = jest.fn(() => Promise.resolve({modified: []}));
  const simpleGitCheckout = jest.fn();

  simpleGit.mockReturnValue({
    status: simpleGitStatus,
    checkout: simpleGitCheckout,
  });

  const successfullyRemovedBranches = await removeSelectedBranches(mainBranch, branchesToRemove);
  expect(simpleGit).toBeCalledTimes(2);
  expect(simpleGitStatus).toBeCalledTimes(1);
  expect(simpleGitCheckout).toBeCalledTimes(1);
  expect(simpleGitCheckout).toBeCalledWith(mainBranch);
  expect(asyncForEach).toBeCalledTimes(1);
  expect(asyncForEach).toBeCalledWith(branchesToRemove, localBranchDeletionCallback);
  expect(successfullyRemovedBranches).toEqual(branchesToRemove);
});
