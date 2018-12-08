const { createSelectedBranchFilter } = require('../../../src/shared/prompt-functions/createSelectedBranchFilter');

test(
  'Creating a branch filter should return a function that can filter branches not specified by user input.',
  async () => {
    const branches = ['branch1', 'branch2', 'branch3'];
    const expectedFilteredBranches = ['branch2', 'branch3'];

    const branchFilter = createSelectedBranchFilter(branches);

    expect(typeof branchFilter).toBe('function');
    expect(branchFilter(['branch1'])).toEqual(expectedFilteredBranches);
    expect(branchFilter(['branch4', 'branch5'])).toEqual(branches);
});