const simpleGit = require('simple-git/promise');
const { localBranchDeletionCallback } = require('../../src/local-branches/localBranchDeletionCallback');

jest.mock('simple-git/promise');

global.console= {
  log: jest.fn(),
};

const branchName = 'test';

test('The branch was successfully removed', async () => {
  // const consoleError = 'Something went wrong with deleting the branch';
  const simpleGitDeleteLocalBranch = jest.fn((branch) => {
    return Promise.resolve({branch, success: true});
  });
  simpleGit.mockReturnValue({deleteLocalBranch: simpleGitDeleteLocalBranch});

  const removedBranch = await localBranchDeletionCallback(branchName);

  expect(simpleGit).toBeCalledTimes(1);
  expect(simpleGitDeleteLocalBranch).toBeCalledTimes(1);
  expect(simpleGitDeleteLocalBranch).toBeCalledWith(branchName);
  expect(removedBranch).toEqual(branchName);
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith(`\n"test" was successfully removed.\n`);
});