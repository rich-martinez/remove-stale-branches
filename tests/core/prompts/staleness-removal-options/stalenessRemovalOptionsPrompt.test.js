const { prompt } = require('inquirer');
const { createUserOptionSelector } = require('../../../../src/shared/prompt-functions/createUserOptionSelector');
const { removeLocalBranches, removeRemoteBranches } = require('../../../../src/core/prompts/staleness-removal-options/stalenessRemovalOptionsContent');
const { stalenessRemovalOptionsPrompt } = require('../../../../src/core/prompts/staleness-removal-options/stalenessRemovalOptionsPrompt');

jest.mock('inquirer');
jest.mock('../../../../src/shared/prompt-functions/createUserOptionSelector');
test('A user selects remove local branches and the expected value is returned.', async () => {
  const source = async () => {};
  createUserOptionSelector.mockReturnValue(source);
  prompt.mockReturnValue(Promise.resolve({stalenessRemovalOptionsPrompt: removeLocalBranches,}));

  const userAnswer = await stalenessRemovalOptionsPrompt();

  expect(prompt).toBeCalledWith([
    {
        type: 'autocomplete',
        name: 'stalenessRemovalOptionsPrompt',
        message: 'Please choose a removal option:',
        suggestOnly: false,
        source,
    }
  ]);
  expect(prompt).toBeCalledTimes(1);

  expect(userAnswer).toBe(removeLocalBranches);
});

test('A user selects remove remote branches and the expected value is returned.', async () => {
  const source = async () => {};
  createUserOptionSelector.mockReturnValue(source);
  prompt.mockReturnValue(Promise.resolve({stalenessRemovalOptionsPrompt: removeRemoteBranches,}));

  const userAnswer = await stalenessRemovalOptionsPrompt();

  expect(prompt).toBeCalledWith([
    {
        type: 'autocomplete',
        name: 'stalenessRemovalOptionsPrompt',
        message: 'Please choose a removal option:',
        suggestOnly: false,
        source,
    }
  ]);
  expect(prompt).toBeCalledTimes(1);

  expect(userAnswer).toBe(removeRemoteBranches);
});