const simpleGit = require('simple-git/promise')
const { allRemotes } = require('../../src/remote-branches/allRemotes')

jest.mock('simple-git/promise')

test('No remotes exist and it is resolved to an empty array', async () => {
  const expectedResult = []
  simpleGit.mockReturnValue({ getRemotes: () => Promise.resolve(expectedResult) })

  const remotes = await allRemotes()

  expect(simpleGit).toBeCalledTimes(1)
  expect(remotes).toEqual(expectedResult)
})

test('Available remotes exist and they resolve to an array', async () => {
  const expectedResult = ['remote1', 'remote2']
  simpleGit.mockReturnValue({ getRemotes: () => Promise.resolve([{ name: 'remote1' }, { name: 'remote2' }]) })

  const remotes = await allRemotes()

  expect(simpleGit).toBeCalledTimes(1)
  expect(remotes).toEqual(expectedResult)
})
