const { createBranchAvailabilityValidator } = require('../../../src/shared/prompt-functions/createBranchAvailabilityValidator');

test('Creating a branch availability validator should return a function that checks user input for an empty array.', async () => {
    const branches = ['branch1', 'branch2', 'branch3'];
    const branchValidator = createBranchAvailabilityValidator(branches);
    const errorMessage = await branchValidator([]);

    expect(typeof branchValidator).toBe('function');
    expect(errorMessage).toBe(`\n\nPlease leave at least one branch to remove.\n\n`);
  });

test('Creating a branch availability validator should return a function that checks user input for a invalid branch.', async () => {
  const branches = ['branch1', 'branch2', 'branch3'];
  const branchValidator = createBranchAvailabilityValidator(branches);
  const branchName = 'branch4';
  const errorMessage = await branchValidator([branchName]);

  expect(typeof branchValidator).toBe('function');
  expect(errorMessage).toBe(`\n\n${branchName} must contain one of the available branches:\n${JSON.stringify(branches, null, 2)}\n\n`);
});


test('Creating a branch availability validator should return a function that checks user input for a valid branch.', async () => {
  const branches = ['branch1', 'branch2', 'branch3'];
  const branchValidator = createBranchAvailabilityValidator(branches);
  const isValidBranch = await branchValidator(['branch3']);

  expect(typeof branchValidator).toBe('function');
  expect(isValidBranch).toBe(true);
});