const { isGitSafeRepository } = require('../../src/shared/isGitSafeRepository');
const { allLocalBranches } = require('../../src/local-branches/allLocalBranches');
const { mainBranchPrompt } = require('../../src/local-branches/prompts/mainBranchPrompt');
const { removeSelectedBranches } = require('../../src/local-branches/removeSelectedBranches');
const { branchesToRemove } = require('../../src/shared/branchesToRemove');
const { runLocalBranchRemoval } = require('../../src/local-branches/localBranchRemoval');

jest.mock('../../src/shared/isGitSafeRepository');
jest.mock('../../src/local-branches/allLocalBranches');
jest.mock('../../src/local-branches/prompts/mainBranchPrompt');
jest.mock('../../src/local-branches/removeSelectedBranches');
jest.mock('../../src/shared/branchesToRemove');

global.console = {
  error: jest.fn(),
  log: jest.fn(),
};
const processExit = jest
  .spyOn(process, 'exit')
  .mockImplementation(number => number);

const previouslyRemovedBranches = {};

test('Is not a git safe repository.', async () => {
  isGitSafeRepository.mockResolvedValueOnce(false);

  await runLocalBranchRemoval(previouslyRemovedBranches);

  expect(isGitSafeRepository).toBeCalledTimes(1);
  expect(console.error).toBeCalledTimes(1);
  expect(console.error).toBeCalledWith('\n\nThis command only works if it is run from a git repository.\n\n');
  expect(processExit).toBeCalledTimes(1);
  expect(processExit).toBeCalledWith(1);
});

test('There are no local branches available for removal.', async () => {
  isGitSafeRepository.mockResolvedValueOnce(true);
  allLocalBranches.mockResolvedValueOnce([]);

  const removedBranches = await runLocalBranchRemoval(previouslyRemovedBranches);

  expect(isGitSafeRepository).toBeCalledTimes(1);
  expect(allLocalBranches).toBeCalledTimes(1);
  expect(console.log).toBeCalledTimes(1);
  expect(console.log).toBeCalledWith('\nThere are no local branches available for removal.\n');
  expect(removedBranches).toEqual([]);
});

test('Selected branches are removed.', async () => {
  const mainBranch = 'main';
  const allTheLocalBranches = [mainBranch, 'branch2', 'branch3'];
  const branchesAvailableForRemoval = ['branch2', 'branch3'];
  const selectedBranchesToRemove = ['branch2'];
  isGitSafeRepository.mockResolvedValueOnce(true);
  mainBranchPrompt.mockResolvedValueOnce(mainBranch);
  allLocalBranches.mockResolvedValueOnce(allTheLocalBranches);
  branchesToRemove.mockResolvedValueOnce(selectedBranchesToRemove);
  removeSelectedBranches.mockResolvedValueOnce(selectedBranchesToRemove);

  const removedBranches = await runLocalBranchRemoval(previouslyRemovedBranches);

  expect(isGitSafeRepository).toBeCalledTimes(1);
  expect(allLocalBranches).toBeCalledTimes(1);
  expect(mainBranchPrompt).toBeCalledTimes(1);
  expect(mainBranchPrompt).toBeCalledWith(allTheLocalBranches);
  expect(branchesToRemove).toBeCalledTimes(1);
  expect(branchesToRemove).toBeCalledWith(branchesAvailableForRemoval);
  expect(removeSelectedBranches).toBeCalledTimes(1);
  expect(removeSelectedBranches).toBeCalledWith(mainBranch, selectedBranchesToRemove);
  expect(removedBranches).toEqual(selectedBranchesToRemove);
});
