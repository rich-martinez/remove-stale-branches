const { prompt } = require('inquirer');
const { createUserOptionSelector } = require('../../../src/shared/prompt-functions/createUserOptionSelector');
const { createSelectedBranchFilter } = require('../../../src/shared/prompt-functions/createSelectedBranchFilter');
const { createBranchAvailabilityValidator } = require('../../../src/shared/prompt-functions/createBranchAvailabilityValidator');
const { keepSelectedBranchesPrompt } = require('../../../src/shared/prompts/keepSelectedBranchesPrompt');

jest.mock('inquirer');
jest.mock('../../../src/shared/prompt-functions/createUserOptionSelector');
jest.mock('../../../src/shared/prompt-functions/createSelectedBranchFilter');
jest.mock('../../../src/shared/prompt-functions/createBranchAvailabilityValidator');

test('User selection resolves to a list a branches to remove based on branches to filter.', async () => {
  const branchesAvailableForRemoval = ['branch1', 'branch2', 'branch2'];
  const expectedBranchesToRemove = ['branch1', 'branch2'];
  const source = jest.fn();
  const filter = jest.fn();
  const validate = jest.fn();

  prompt.mockReturnValue(Promise.resolve({keepSelectedBranchesPrompt: expectedBranchesToRemove,}));
  createUserOptionSelector.mockReturnValue(source);
  createSelectedBranchFilter.mockReturnValue(filter);
  createBranchAvailabilityValidator.mockReturnValue(validate);

  const userAnswer = await keepSelectedBranchesPrompt(branchesAvailableForRemoval);

  expect(prompt).toBeCalledWith([
    {
      type: 'checkbox-plus',
      name: 'keepSelectedBranchesPrompt',
      message: 'Select only the branches you want to keep. (use spacebar to select/deselect options)',
      highlight: true,
      searchable: true,
      filter,
      validate,
      source,
    }
  ]);
  expect(prompt).toBeCalledTimes(1);
  expect(createUserOptionSelector).toBeCalledTimes(1);
  expect(createSelectedBranchFilter).toBeCalledTimes(1);
  expect(createBranchAvailabilityValidator).toBeCalledTimes(1);
  expect(userAnswer).toBe(expectedBranchesToRemove);
});