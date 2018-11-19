const { removeStaleBranches } = require('../src/core/removeStaleBranches');
const { removeLocalBranches, removeRemoteBranches } = require('../src/core/prompts/staleness-removal-options/stalenessRemovalOptionsContent');
const { stalenessRemovalOptionsPrompt } = require('../src/core/prompts/staleness-removal-options/stalenessRemovalOptionsPrompt');
const { removeStalenessContinuationPrompt } = require('../src/core/prompts/staleness-removal-continuation/removeStalenessContinuationPrompt');
const { runLocalBranchRemoval } = require('../src/local-branches/localBranchRemoval');
const { runRemoteBranchRemoval } = require('../src/remote-branches/remoteBranchRemoval');

jest.mock('../src/core/prompts/staleness-removal-options/stalenessRemovalOptionsPrompt');
jest.mock('../src/local-branches/localBranchRemoval');
jest.mock('../src/remote-branches/remoteBranchRemoval');
jest.mock('../src/core/prompts/staleness-removal-continuation/removeStalenessContinuationPrompt');

 test('User runs local branch removal and then runs remote branch removal.', async () => {
  const removedLocalBranches = ['local-branch-one', 'local-branch-two'];
  const removedRemoteBranches = [];

  stalenessRemovalOptionsPrompt
    .mockReturnValueOnce(removeLocalBranches)
    .mockReturnValueOnce(removeRemoteBranches);

    runLocalBranchRemoval
      .mockReturnValue(removedLocalBranches);

  runRemoteBranchRemoval
    .mockReturnValue(removedRemoteBranches);

  removeStalenessContinuationPrompt
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(false);

  await removeStaleBranches();

  expect(stalenessRemovalOptionsPrompt).nthReturnedWith(1, removeLocalBranches);
  expect(stalenessRemovalOptionsPrompt).nthReturnedWith(2, removeRemoteBranches);
  expect(stalenessRemovalOptionsPrompt).toBeCalledTimes(2);

  // TODO: Figure out why this is being called with a value that should be set later.
  // expect(runLocalBranchRemoval).toBeCalledWith({ localBranches: [], remoteBranches: [] });
  expect(runLocalBranchRemoval).toReturnWith(removedLocalBranches);
  expect(runLocalBranchRemoval).toBeCalledTimes(1);

  expect(runRemoteBranchRemoval).toBeCalledWith({
    localBranches: removedLocalBranches,
    remoteBranches: [],
  });
  expect(runRemoteBranchRemoval).toReturnWith(removedRemoteBranches);
  expect(runRemoteBranchRemoval).toBeCalledTimes(1);

  expect(removeStalenessContinuationPrompt).nthReturnedWith(1, true);
  expect(removeStalenessContinuationPrompt).nthReturnedWith(2, false);
  expect(removeStalenessContinuationPrompt).toBeCalledTimes(2);

  expect.assertions(11);
});
