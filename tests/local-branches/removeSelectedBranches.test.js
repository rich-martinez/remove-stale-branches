const simpleGit = require('simple-git/promise');
const { asyncForEach } = require('../../src/shared/asyncForEach');
const { removeSelectedBranches } = require('../../src/local-branches/removeSelectedBranches');

jest.mock('simple-git/promise');
jest.mock('../../src/shared/asyncForEach')

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

test('An error occurred while deleting local branches and not all the branches were successfully removed.', async () => {
  const simpleGitStatus = jest.fn(() => Promise.resolve({modified: []}));
  const simpleGitCheckout = jest.fn();
  const consoleError = 'Something went wrong with deleting the branch';
  const simpleGitDeleteLocalBranch = jest.fn((branch) => {
    if (branch === 'branch4' || branch === 'branch9') {
      return Promise.reject(consoleError);
    }

    return Promise.resolve({branch, success: true});
  });

  simpleGit.mockReturnValue({
    status: simpleGitStatus,
    checkout: simpleGitCheckout,
    deleteLocalBranch: simpleGitDeleteLocalBranch
  });

  const successfullyRemovedBranches = await removeSelectedBranches(mainBranch, branchesToRemove);

  expect(simpleGitStatus).toBeCalledTimes(1);
  expect(simpleGitCheckout).toBeCalledTimes(1);
  expect(simpleGitCheckout).toBeCalledWith(mainBranch);

  expect(asyncForEach).toBeCalledTimes(1);
  expect(asyncForEach).toBeCalledWith(branchesToRemove, expect.any(Function));

  expect(simpleGitDeleteLocalBranch).nthCalledWith(1, 'branch1');
  expect(simpleGitDeleteLocalBranch).nthCalledWith(2, 'branch3');
  expect(simpleGitDeleteLocalBranch).nthCalledWith(3, 'branch4');
  expect(simpleGitDeleteLocalBranch).nthCalledWith(4, 'branch9');

  expect(console.log).toBeCalledTimes(2);
  expect(console.log).nthCalledWith(1, `\n"branch1" was successfully removed.\n`);
  expect(console.log).nthCalledWith(2, `\n"branch3" was successfully removed.\n`);
  expect(console.error).toBeCalledTimes(1);
  expect(console.error).toBeCalledWith(consoleError);

  expect(successfullyRemovedBranches).toEqual(['branch1', 'branch3']);
});
