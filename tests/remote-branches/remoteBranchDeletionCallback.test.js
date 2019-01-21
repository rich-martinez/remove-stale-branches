const simpleGit = require('simple-git/promise')
const { remoteBranchDeletionCallback } = require('../../src/remote-branches/remoteBranchDeletionCallback')

jest.mock('simple-git/promise')

global.console = {
  log: jest.fn(),
  error: jest.fn()
}

test('Remote branch was successfully removed.', async () => {
  const branch = 'master'
  const remote = 'origin'
  const branchAndRemote = { branch, remote }
  const expectedPushOptions = { '--delete': null }

  const simpleGitPush = jest.fn((remote, branch, options) => {
    return Promise.resolve(undefined)
  })
  simpleGit.mockReturnValue({ push: simpleGitPush })

  const removedBranch = await remoteBranchDeletionCallback(branchAndRemote)

  expect(simpleGit).toBeCalledTimes(1)
  expect(simpleGitPush).toBeCalledTimes(1)
  expect(simpleGitPush).toBeCalledWith(remote, branch, expectedPushOptions)
  expect(removedBranch).toEqual(branch)
  expect(console.log).toBeCalledTimes(1)
  expect(console.log).toBeCalledWith(`\n"${branch}" was successfully removed.\n`)
})

test('Deleting a remote branch promise is rejected.', async () => {
  const branch = 'master'
  const remote = 'origin'
  const branchAndRemote = { branch, remote }
  const expectedPushOptions = { '--delete': null }
  const consoleError = 'Something went wrong with deleting the branch'
  const simpleGitPush = jest.fn((remote, branch, options) => {
    return Promise.reject(consoleError)
  })
  simpleGit.mockReturnValue({ push: simpleGitPush })

  const removedBranch = await remoteBranchDeletionCallback(branchAndRemote)

  expect(simpleGit).toBeCalledTimes(1)
  expect(simpleGitPush).toBeCalledTimes(1)
  expect(simpleGitPush).toBeCalledWith(remote, branch, expectedPushOptions)
  expect(removedBranch).toEqual(undefined)
  expect(console.error).toBeCalledTimes(1)
  expect(console.error).toBeCalledWith(consoleError)
})
