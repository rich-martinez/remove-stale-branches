const { branchRemovalStrategyPrompt } = require('../../src/shared/prompts/branchRemovalStrategyPrompt')
const { removeSelectedBranchesPrompt } = require('../../src/shared/prompts/removeSelectedBranchesPrompt')
const { keepSelectedBranchesPrompt } = require('../../src/shared/prompts/keepSelectedBranchesPrompt')
const {
  removeAllAvailableBranchesContent,
  removeSelectedBranchesContent,
  keepSelectedBranchesContent
} = require('../../src/shared/branchRemovalOptionsContent')
const { branchesToRemove } = require('../../src/shared/branchesToRemove');

jest.mock('../../src/shared/prompts/branchRemovalStrategyPrompt');
jest.mock('../../src/shared/prompts/removeSelectedBranchesPrompt');
jest.mock('../../src/shared/prompts/keepSelectedBranchesPrompt');

global.console = {log: jest.fn()};

test('All branches available for removal will be removed', async () => {
  const branchesAvailableForRemoval = ['branch1', 'branch2', 'branch3', 'branch4'];
  branchRemovalStrategyPrompt.mockReturnValue(removeAllAvailableBranchesContent);

  const theBranchesToRemove = await branchesToRemove(branchesAvailableForRemoval);

  expect(branchRemovalStrategyPrompt).toBeCalledTimes(1);
  expect(branchRemovalStrategyPrompt)
    .toBeCalledWith(
      branchesAvailableForRemoval,
      [
        removeAllAvailableBranchesContent,
        removeSelectedBranchesContent,
        keepSelectedBranchesContent,
      ],
    )
  expect(theBranchesToRemove).toBe(branchesAvailableForRemoval);
  expect(removeSelectedBranchesPrompt).toBeCalledTimes(0);
  expect(keepSelectedBranchesPrompt).toBeCalledTimes(0);
  });

test('Only user selected branches will be removed.', async () => {
  const branchesAvailableForRemoval = ['branch1', 'branch2', 'branch3', 'branch4'];
  const userSelectedBranches = ['branch1', 'branch4'];
  branchRemovalStrategyPrompt.mockReturnValue(removeSelectedBranchesContent);
  removeSelectedBranchesPrompt.mockReturnValue(userSelectedBranches);

  const theBranchesToRemove = await branchesToRemove(branchesAvailableForRemoval);

  expect(branchRemovalStrategyPrompt).toBeCalledTimes(1);
  expect(branchRemovalStrategyPrompt)
    .toBeCalledWith(
      branchesAvailableForRemoval,
      [
        removeAllAvailableBranchesContent,
        removeSelectedBranchesContent,
        keepSelectedBranchesContent,
      ],
    )
  expect(theBranchesToRemove).toBe(userSelectedBranches);
  expect(keepSelectedBranchesPrompt).toBeCalledTimes(0);
  expect(removeSelectedBranchesPrompt).toBeCalledTimes(1);
  expect(removeSelectedBranchesPrompt).toBeCalledWith(branchesAvailableForRemoval);
});

test('User selected branches will not be removed but all other branches will be removed.', async () => {
  const branchesAvailableForRemoval = ['branch1', 'branch2', 'branch3', 'branch4'];
  const branchesToBeRemoved = ['branch1', 'branch4'];
  branchRemovalStrategyPrompt.mockReturnValue(keepSelectedBranchesContent);
  keepSelectedBranchesPrompt.mockReturnValue(branchesToBeRemoved);

  const theBranchesToRemove = await branchesToRemove(branchesAvailableForRemoval);

  expect(branchRemovalStrategyPrompt).toBeCalledTimes(1);
  expect(branchRemovalStrategyPrompt)
    .toBeCalledWith(
      branchesAvailableForRemoval,
      [
        removeAllAvailableBranchesContent,
        removeSelectedBranchesContent,
        keepSelectedBranchesContent,
      ],
    )
  expect(theBranchesToRemove).toEqual(branchesToBeRemoved);
  expect(removeSelectedBranchesPrompt).toBeCalledTimes(0);
  expect(keepSelectedBranchesPrompt).toBeCalledTimes(1);
  expect(keepSelectedBranchesPrompt).toBeCalledWith(branchesAvailableForRemoval);
});

test('Unexpected branch removal strategy value leads to an empy array being returned.', async () => {
  const branchesAvailableForRemoval = ['branch1', 'branch2', 'branch3', 'branch4'];
  const branchesToBeRemoved = ['branch1', 'branch4'];
  const unexpectedValue = 'some unexpected value';
  branchRemovalStrategyPrompt.mockReturnValue(unexpectedValue);

  const theBranchesToRemove = await branchesToRemove(branchesAvailableForRemoval);


  expect(branchRemovalStrategyPrompt).toBeCalledTimes(1);
  expect(branchRemovalStrategyPrompt)
    .toBeCalledWith(
      branchesAvailableForRemoval,
      [
        removeAllAvailableBranchesContent,
        removeSelectedBranchesContent,
        keepSelectedBranchesContent,
      ],
    )
    expect(theBranchesToRemove).toEqual([]);
    expect(removeSelectedBranchesPrompt).toBeCalledTimes(0);
    expect(keepSelectedBranchesPrompt).toBeCalledTimes(0);
    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toBeCalledWith('No branches will be removed');
});