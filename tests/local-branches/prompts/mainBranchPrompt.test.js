const { prompt } = require('inquirer');
const { createStringTrimFilter } = require('../../../src/shared/prompt-functions/createStringTrimFilter');
const { createBranchNameValidator } = require('../../../src/shared/prompt-functions/createBranchNameValidator');
const { createUserOptionSelector } = require('../../../src/shared/prompt-functions/createUserOptionSelector');
const {  mainBranchPrompt } = require('../../../src/local-branches/prompts/mainBranchPrompt');

jest.mock('inquirer');
jest.mock('../../../src/shared/prompt-functions/createStringTrimFilter');
jest.mock('../../../src/shared/prompt-functions/createBranchNameValidator');
jest.mock('../../../src/shared/prompt-functions/createUserOptionSelector');

test('User selection resolves to a branch removal strategy option.', async () => {
  const mainBranch = 'main';
  const branchesAvailableForRemoval = [mainBranch, 'branch2', 'branch2'];
  const filter = jest.fn();
  const validate = jest.fn();
  const source = jest.fn();

  prompt.mockResolvedValueOnce({mainBranchPrompt: mainBranch,});
  createStringTrimFilter.mockReturnValue(filter);
  createBranchNameValidator.mockReturnValue(validate);
  createUserOptionSelector.mockReturnValue(source);

  const userAnswer = await mainBranchPrompt(branchesAvailableForRemoval);

  expect(createBranchNameValidator).toBeCalledTimes(1);
  expect(createBranchNameValidator).toBeCalledWith(branchesAvailableForRemoval);
  expect(createUserOptionSelector).toBeCalledTimes(1);
  expect(createUserOptionSelector).toBeCalledWith(branchesAvailableForRemoval);
  expect(createStringTrimFilter).toBeCalledTimes(1);
  expect(prompt).toBeCalledTimes(1);
  expect(prompt).toBeCalledWith([
    {
      type: 'autocomplete',
      name: 'mainBranchPrompt',
      message: 'Please choose the main branch which will not be removed:',
      suggestOnly: false,
      filter,
      validate,
      source,
    }
  ]);
  expect(userAnswer).toBe(mainBranch);
});
