const { prompt } = require('inquirer');
const { removeStalenessContinuationPrompt } = require('../../../../src/core/prompts/staleness-removal-continuation/removeStalenessContinuationPrompt');

jest.mock('inquirer');

test.each`
  userResponse | expected
  ${'yes'} | ${'yes'}
  ${'y'} | ${'y'}
  ${'no'} | ${'no'}
  ${'n'} | ${'n'}
`(
  'The expected user response matches the prompt resolve value for continuing to remove branches',
  async ({userResponse, expected}) => {
    prompt.mockResolvedValueOnce({ removeStalenessContinuationPrompt: userResponse });

    const theUserResponse = await removeStalenessContinuationPrompt();

    expect(prompt).toBeCalledTimes(1);
    expect(prompt).toBeCalledWith([
      {
          type: 'confirm',
          message: 'Do you want to continue to remove stale branches?',
          name: 'removeStalenessContinuationPrompt',
      },
    ]);
    expect(theUserResponse).toBe(expected);
  }
);