const { createBranchNameValidator } = require('../../../src/shared/prompt-functions/createBranchNameValidator');

test(
  'Creating a branch name validator should return a function that checks user input is an valid branch.',
  async () => {
    const branches = ['branch1', 'branch2', 'branch3'];

    const branchValidator = createBranchNameValidator(branches);
    const isValidBranch = await branchValidator('branch1');

    expect(typeof branchValidator).toBe('function');
    expect(isValidBranch).toBe(true);
  });

test(
'Creating a branch name validator should return a function that checks user input is an invalid branch.',
async () => {
  global.console = {log: jest.fn()};
  const branches = ['branch1', 'branch2', 'branch3'];

  const branchValidator = createBranchNameValidator(branches);

  expect(typeof branchValidator).toBe('function');
  const branchName = 'branch4';
  await branchValidator(branchName);
  expect(console.log).toBeCalledWith(`\n\n${branchName} is not one of the available branches:\n${JSON.stringify(branches, null, 2)}\n\n`);
});
