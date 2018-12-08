const { prompt } = require('inquirer');
const { createUserOptionSelector } = require('../../../src/shared/prompt-functions/createUserOptionSelector');
const { removeSelectedBranchesPrompt } = require('../../../src/shared/prompts/removeSelectedBranchesPrompt');

jest.mock('inquirer');
jest.mock('../../../src/shared/prompt-functions/createUserOptionSelector');

test('User selection resolves to a branch removal strategy option.', async () => {
  const branchesAvailableForRemoval = ['branch1', 'branch2', 'branch2'];
  const expectedBranchesToRemove = ['branch1', 'branch2'];
  const source = jest.fn();

  prompt.mockReturnValue(Promise.resolve({removeSelectedBranchesPrompt: expectedBranchesToRemove,}));
  createUserOptionSelector.mockReturnValue(source);

  const userAnswer = await removeSelectedBranchesPrompt(branchesAvailableForRemoval);

  expect(prompt).toBeCalledWith([
    {
      type: 'checkbox-plus',
      name: 'removeSelectedBranchesPrompt',
      message: 'Select the branches to remove. (use spacebar to select/deselect options)',
      highlight: true,
      searchable: true,
      source,
    }
  ]);
  expect(prompt).toBeCalledTimes(1);
  expect(createUserOptionSelector).toBeCalledTimes(1);
  expect(userAnswer).toBe(expectedBranchesToRemove);
});