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

global.console = {error: jest.fn()};
const processExit = jest
  .spyOn(process, 'exit')
  .mockImplementation(number => number);

const previouslyRemovedBranches = {};

test('Is not a git safe repository.', async () => {
  isGitSafeRepository.mockReturnValue(false);

  await runLocalBranchRemoval(previouslyRemovedBranches);

  expect(isGitSafeRepository).toBeCalledTimes(1);
  expect(console.error).toBeCalledTimes(1);
  expect(console.error).toBeCalledWith('\n\nThis command only works if it is run from a git repository.\n\n');
  expect(processExit).toBeCalledTimes(1);
  expect(processExit).toBeCalledWith(1);
});
