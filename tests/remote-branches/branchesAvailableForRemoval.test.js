const simpleGit = require('simple-git/promise')
const { branchesAvailableForRemoval } = require('../../src/remote-branches/branchesAvailableForRemoval')

jest.mock('simple-git/promise')

test('The current remote identifier returns all available branches associated with that remote', async () => {
  const remoteIdentifier = 'origin/'
  const allRemoteBranches = {
    all: [
      `${remoteIdentifier}origin1`,
      `${remoteIdentifier}origin2`,
      `${remoteIdentifier}origin3`,
      'upstream/master',
      'upstream/branch1',
      'upstream/branch2'
    ]
  }
  const branchFunction = jest.fn(() => Promise.resolve(allRemoteBranches))
  simpleGit.mockReturnValue({ branch: branchFunction })

  const availableRemoteBranches = await branchesAvailableForRemoval(remoteIdentifier)

  expect(simpleGit).toBeCalledTimes(1)
  expect(branchFunction).toBeCalledTimes(1)
  expect(branchFunction).toBeCalledWith(['--remote'])
  expect(availableRemoteBranches).toEqual(['origin1', 'origin2', 'origin3'])
})
