const { branchRemovalOptionsContent } = require('../../src/shared/branchRemovalOptionsContent')

global.console = { error: jest.fn() }
const processExit = jest
  .spyOn(process, 'exit')
  .mockImplementation(number => number)

test('No argument given will console.error and exit the process.', () => {
  branchRemovalOptionsContent()
  expect(console.error).toBeCalledWith('The first argument must be an array with at least one item.')
  expect(processExit).toBeCalledWith(1)
})

test('Branches argument is provided and the content message is returned', () => {
  const branches = ['master', 'branch1', 'branch2']
  const expectedMessage = `\
    \nA list of the branches available for removal:\
    \n${JSON.stringify(branches, null, 2)}\n\
    \nPlease choose an option to remove branches.\n\
  `
  const message = branchRemovalOptionsContent(branches)

  expect(message).toBe(expectedMessage)
})
