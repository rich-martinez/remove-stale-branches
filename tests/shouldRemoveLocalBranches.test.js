jest.mock('inquirer')

const { prompt } = require('inquirer')

const { shouldRemoveLocalBranches } = require('../local-branches/shouldRemoveLocalBranches')

test('User selects should remove local branches and it returns true.', async () => {
  prompt.mockReturnValue(Promise.resolve({ shouldRemoveLocalBranchesPrompt: true }))
  const data = await shouldRemoveLocalBranches()

  expect(prompt).toBeCalledWith([
    {
      type: 'confirm',
      message: 'Do you want to remove local branches?',
      name: 'shouldRemoveLocalBranchesPrompt'
    }
  ])
  expect(prompt).toBeCalledTimes(1)
  expect(data).toBe(true)
})

test('User selects should remove local branches and it returns true.', async () => {
  prompt.mockReturnValue(Promise.resolve({ shouldRemoveLocalBranchesPrompt: false }))
  const data = await shouldRemoveLocalBranches()

  expect(prompt).toBeCalledWith([
    {
      type: 'confirm',
      message: 'Do you want to remove local branches?',
      name: 'shouldRemoveLocalBranchesPrompt'
    }
  ])
  expect(prompt).toBeCalledTimes(1)
  expect(data).toBe(false)
})
