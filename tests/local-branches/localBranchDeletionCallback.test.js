const simpleGit = require('simple-git/promise')
const { localBranchDeletionCallback } = require('../../src/local-branches/localBranchDeletionCallback')

jest.mock('simple-git/promise')

global.console = {
  log: jest.fn(),
  error: jest.fn()
}

const branchName = 'test'
const simpleGitBranchOptions = ['-D', branchName]

test('The branch was successfully removed', async () => {
  // const consoleError = 'Something went wrong with deleting the branch';
  const simpleGitBranch = jest.fn((options) => {
    return Promise.resolve({ branch: branchName })
  })
  simpleGit.mockReturnValue({ branch: simpleGitBranch })

  const removedBranch = await localBranchDeletionCallback(branchName)

  expect(simpleGit).toBeCalledTimes(1)
  expect(simpleGitBranch).toBeCalledTimes(1)
  expect(simpleGitBranch).toBeCalledWith(simpleGitBranchOptions)
  expect(removedBranch).toEqual(branchName)
  expect(console.log).toBeCalledTimes(1)
  expect(console.log).toBeCalledWith(`\n"test" was successfully removed.\n`)
})

test('Deleting a local branch promise is rejected.', async () => {
  const consoleError = 'Something went wrong with deleting the branch'
  const simpleGitBranch = jest.fn((options) => {
    return Promise.reject(consoleError)
  })
  simpleGit.mockReturnValue({ branch: simpleGitBranch })

  const removedBranch = await localBranchDeletionCallback(branchName)

  expect(simpleGit).toBeCalledTimes(1)
  expect(simpleGitBranch).toBeCalledTimes(1)
  expect(simpleGitBranch).toBeCalledWith(simpleGitBranchOptions)
  expect(removedBranch).toEqual(undefined)
  expect(console.error).toBeCalledTimes(1)
  expect(console.error).toBeCalledWith(consoleError)
})
