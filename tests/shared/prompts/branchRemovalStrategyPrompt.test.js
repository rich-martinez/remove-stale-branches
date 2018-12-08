const { prompt } = require('inquirer');
const { branchRemovalOptionsContent } = require('../../../src/shared/branchRemovalOptionsContent');
const { createUserOptionSelector } = require('../../../src/shared/prompt-functions/createUserOptionSelector');
const { branchRemovalStrategyPrompt } = require('../../../src/shared/prompts/branchRemovalStrategyPrompt');

jest.mock('inquirer');
jest.mock('../../../src/shared/prompt-functions/createUserOptionSelector');
jest.mock('../../../src/shared/branchRemovalOptionsContent');

test('User selection resolves to a branch removal strategy option.', async () => {
  const branchesAvailableForRemoval = ['branch1', 'branch2', 'branch2'];
  const expectedRemovalOption = 'branchRemovalOption1';
  const branchRemovalOptions = [expectedRemovalOption, 'branchRemovalOption2'];
  const expectedMessage = 'This is a message for the user';
  const source = jest.fn();

  prompt.mockReturnValue(Promise.resolve({branchRemovalStrategyPrompt: expectedRemovalOption,}));
  createUserOptionSelector.mockReturnValue(source);
  branchRemovalOptionsContent.mockReturnValue(expectedMessage);

  const userAnswer = await branchRemovalStrategyPrompt(branchesAvailableForRemoval, branchRemovalOptions);

  expect(prompt).toBeCalledWith([
    {
      type: 'autocomplete',
      name: 'branchRemovalStrategyPrompt',
      message: expectedMessage,
      suggestOnly: false,
      source,
    }
  ]);
  expect(prompt).toBeCalledTimes(1);
  expect(createUserOptionSelector).toBeCalledTimes(1);
  expect(branchRemovalOptionsContent).toBeCalledTimes(1);
  expect(userAnswer).toBe(expectedRemovalOption);
});
