const { prompt } = require('inquirer');
const { createStringTrimFilter } = require('../../../src/shared/prompt-functions/createStringTrimFilter');
const { createBranchNameValidator } = require('../../../src/shared/prompt-functions/createBranchNameValidator');
const { createUserOptionSelector } = require('../../../src/shared/prompt-functions/createUserOptionSelector');
const { remoteNamePrompt } = require('../../../src/remote-branches/prompts/remoteNamePrompt');

jest.mock('inquirer');
jest.mock('../../../src/shared/prompt-functions/createStringTrimFilter');
jest.mock('../../../src/shared/prompt-functions/createBranchNameValidator');
jest.mock('../../../src/shared/prompt-functions/createUserOptionSelector');

test('User selection resolves to a remote name.', async () => {
  const remotes = ['remote1', 'remote2', 'remote3'];
  const remoteName = 'remote2';
  const source = jest.fn();
  const filter = jest.fn();
  const validate = jest.fn();

  prompt.mockReturnValue(Promise.resolve({remoteNamePrompt: remoteName}));
  createStringTrimFilter.mockReturnValue(filter);
  createBranchNameValidator.mockReturnValue(validate);
  createUserOptionSelector.mockReturnValue(source);

  const userResponse = await remoteNamePrompt(remotes);

  expect(userResponse).toBe(remoteName);
  expect(createStringTrimFilter).toBeCalledTimes(1);
  expect(createUserOptionSelector).toBeCalledTimes(1);
  expect(createUserOptionSelector).toBeCalledWith(remotes);
  expect(createBranchNameValidator).toBeCalledTimes(1);
  expect(createBranchNameValidator).toBeCalledWith(remotes);
  expect(prompt).toBeCalledWith([
    {
      type: 'autocomplete',
      name: 'remoteNamePrompt',
      message: 'Please choose the remote that will be used to remove remote branches:',
      suggestOnly: false,
      filter,
      validate,
      source,
    }
  ]);
});
