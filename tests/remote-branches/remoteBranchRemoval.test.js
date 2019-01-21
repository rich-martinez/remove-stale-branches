const { isGitSafeRepository } = require('../../src/shared/isGitSafeRepository')
const { allRemotes } = require('../../src/remote-branches/allRemotes')
const { removeSelectedBranches } = require('../../src/remote-branches/removeSelectedBranches')
const { remoteNamePrompt } = require('../../src/remote-branches/prompts/remoteNamePrompt')
const { branchesAvailableForRemoval } = require('../../src/remote-branches/branchesAvailableForRemoval')
const { branchesToRemove } = require('../../src/shared/branchesToRemove')
const { runRemoteBranchRemoval } = require('../../src/remote-branches/remoteBranchRemoval')

jest.mock('../../src/shared/isGitSafeRepository')
jest.mock('../../src/remote-branches/allRemotes')
jest.mock('../../src/remote-branches/removeSelectedBranches')
jest.mock('../../src/remote-branches/prompts/remoteNamePrompt')
jest.mock('../../src/remote-branches/branchesAvailableForRemoval')
jest.mock('../../src/shared/branchesToRemove')

global.console = {
  error: jest.fn(),
  log: jest.fn()
}
const processExit = jest
  .spyOn(process, 'exit')
  .mockImplementation(number => number)

const previouslyRemovedBranches = {}

test('Is a Git safe repository', async () => {
  isGitSafeRepository.mockResolvedValueOnce(false)

  await runRemoteBranchRemoval(previouslyRemovedBranches)

  expect(isGitSafeRepository).toBeCalledTimes(1)
  expect(console.error).toBeCalledTimes(1)
  expect(console.error).toBeCalledWith('\n\nThis command only works if it is run from a git repository.\n\n')
  expect(processExit).toBeCalledTimes(1)
  expect(processExit).toBeCalledWith(1)
})

test('There are no remote available for branch removal.', async () => {
  isGitSafeRepository.mockResolvedValueOnce(true)
  allRemotes.mockResolvedValueOnce([])

  const removedBranches = await runRemoteBranchRemoval(previouslyRemovedBranches)

  expect(isGitSafeRepository).toBeCalledTimes(1)
  expect(allRemotes).toBeCalledTimes(1)
  expect(console.log).toBeCalledTimes(1)
  expect(console.log).toBeCalledWith('\nThere are no remotes available for branch removal.\n')
  expect(removedBranches).toEqual([])
})

test('There are no remote branches available for removal.', async () => {
  const availableRemotes = ['remote1', 'remote2', 'remote3']
  const userSelectedRemote = 'remote3'
  const expectedResult = []

  isGitSafeRepository.mockResolvedValueOnce(true)
  allRemotes.mockResolvedValueOnce(availableRemotes)
  remoteNamePrompt.mockResolvedValueOnce(userSelectedRemote)
  branchesAvailableForRemoval.mockResolvedValueOnce(expectedResult)

  const removedBranches = await runRemoteBranchRemoval(previouslyRemovedBranches)

  expect(isGitSafeRepository).toBeCalledTimes(1)
  expect(allRemotes).toBeCalledTimes(1)
  expect(remoteNamePrompt).toBeCalledTimes(1)
  expect(remoteNamePrompt).toBeCalledWith(availableRemotes)
  expect(branchesAvailableForRemoval).toBeCalledTimes(1)
  expect(branchesAvailableForRemoval).toBeCalledWith(`${userSelectedRemote}/`)
  expect(console.log).toBeCalledTimes(1)
  expect(console.log).toBeCalledWith('\nThere are no branches in that remote that are available for removal.\n')
  expect(removedBranches).toEqual(expectedResult)
})

test('Branches were removed from the remote selected.', async () => {
  const availableRemotes = ['remote1', 'remote2', 'remote3']
  const userSelectedRemote = 'remote3'
  const availableRemoteBranches = ['branch1', 'branch2', 'branch3', 'branch4']
  const expectedResult = ['branch2', 'branch3']

  isGitSafeRepository.mockResolvedValueOnce(true)
  allRemotes.mockResolvedValueOnce(availableRemotes)
  remoteNamePrompt.mockResolvedValueOnce(userSelectedRemote)
  branchesAvailableForRemoval.mockResolvedValueOnce(availableRemoteBranches)
  branchesToRemove.mockResolvedValueOnce(expectedResult)
  removeSelectedBranches.mockResolvedValueOnce(expectedResult)

  const removedBranches = await runRemoteBranchRemoval(previouslyRemovedBranches)

  expect(isGitSafeRepository).toBeCalledTimes(1)
  expect(allRemotes).toBeCalledTimes(1)
  expect(remoteNamePrompt).toBeCalledTimes(1)
  expect(remoteNamePrompt).toBeCalledWith(availableRemotes)
  expect(branchesAvailableForRemoval).toBeCalledTimes(1)
  expect(branchesAvailableForRemoval).toBeCalledWith(`${userSelectedRemote}/`)
  expect(branchesToRemove).toBeCalledTimes(1)
  expect(branchesToRemove).toBeCalledWith(availableRemoteBranches)
  expect(removeSelectedBranches).toBeCalledTimes(1)
  expect(removeSelectedBranches).toBeCalledWith(expectedResult, userSelectedRemote)
  expect(removedBranches).toEqual(expectedResult)
})
