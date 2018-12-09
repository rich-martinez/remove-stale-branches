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
});
