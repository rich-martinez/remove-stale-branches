const { removeStaleBranches } = require('../../src/core/removeStaleBranches')
const { removeLocalBranches, removeRemoteBranches } = require('../../src/core/prompts/staleness-removal-options/stalenessRemovalOptionsContent')
const { stalenessRemovalOptionsPrompt } = require('../../src/core/prompts/staleness-removal-options/stalenessRemovalOptionsPrompt')
const { removeStalenessContinuationPrompt } = require('../../src/core/prompts/staleness-removal-continuation/removeStalenessContinuationPrompt')
const { runLocalBranchRemoval } = require('../../src/local-branches/localBranchRemoval')
const { runRemoteBranchRemoval } = require('../../src/remote-branches/remoteBranchRemoval')

jest.mock('../../src/core/prompts/staleness-removal-options/stalenessRemovalOptionsPrompt')
jest.mock('../../src/local-branches/localBranchRemoval')
jest.mock('../../src/remote-branches/remoteBranchRemoval')
jest.mock('../../src/core/prompts/staleness-removal-continuation/removeStalenessContinuationPrompt')

global.console = {
  log: jest.fn(),
  error: jest.fn(),
};

test('User runs local branch removal and then runs remote branch removal.', async () => {
  const removedLocalBranches = ['local-branch-one', 'local-branch-two']
  const removedRemoteBranches = []

  stalenessRemovalOptionsPrompt
    .mockReturnValueOnce(removeLocalBranches)
    .mockReturnValueOnce(removeRemoteBranches)

  runLocalBranchRemoval
    .mockReturnValue(removedLocalBranches)

  runRemoteBranchRemoval
    .mockReturnValue(removedRemoteBranches)

  removeStalenessContinuationPrompt
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(false)

  await removeStaleBranches()

  expect(stalenessRemovalOptionsPrompt).nthReturnedWith(1, removeLocalBranches)
  expect(stalenessRemovalOptionsPrompt).nthReturnedWith(2, removeRemoteBranches)
  expect(stalenessRemovalOptionsPrompt).toBeCalledTimes(2)

  // TODO: Figure out why this is being called with a value that should be set later.
  // expect(runLocalBranchRemoval).toBeCalledWith({ localBranches: [], remoteBranches: [] });
  expect(runLocalBranchRemoval).toReturnWith(removedLocalBranches)
  expect(runLocalBranchRemoval).toBeCalledTimes(1)

  expect(runRemoteBranchRemoval).toBeCalledWith({
    localBranches: removedLocalBranches,
    remoteBranches: []
  })
  expect(runRemoteBranchRemoval).toReturnWith(removedRemoteBranches)
  expect(runRemoteBranchRemoval).toBeCalledTimes(1)

  expect(removeStalenessContinuationPrompt).nthReturnedWith(1, true)
  expect(removeStalenessContinuationPrompt).nthReturnedWith(2, false)
  expect(removeStalenessContinuationPrompt).toBeCalledTimes(2)

  expect(console.log).toBeCalledWith(`\n\nThat's a wrap.\n\n`)

  expect.assertions(12)
})

test('User tries to runs an unavailable branch removal option.', async () => {
  const unavailableRemovalOption = 'blah blah blah blah';

  stalenessRemovalOptionsPrompt
    .mockReturnValueOnce(unavailableRemovalOption);
  removeStalenessContinuationPrompt
    .mockReturnValueOnce(false);

  await removeStaleBranches()

  expect(stalenessRemovalOptionsPrompt).nthReturnedWith(1, unavailableRemovalOption);
  expect(removeStalenessContinuationPrompt).toBeCalledTimes(1)
  expect(removeStalenessContinuationPrompt).nthReturnedWith(1, false)
  expect(console.error).toBeCalledTimes(1);
  expect(console.error).toBeCalledWith(`'${unavailableRemovalOption}' is not an available branch removal option. Please try again.`);
  expect(console.log).toBeCalledWith(`\n\nThat's a wrap.\n\n`);

  expect.assertions(6);
})
