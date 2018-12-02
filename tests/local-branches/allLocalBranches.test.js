const simpleGit = require('simple-git/promise');
const { allLocalBranches } = require('../../src/local-branches/allLocalBranches');

jest.mock('simple-git/promise');

test('Get all local branches returns an array of branches.', async () => {
  const branches = ['master', 'branch1', 'branch2'];
  const branchLocalPromise = Promise.resolve({all: branches});

  simpleGit.mockReturnValue({branchLocal: () => branchLocalPromise});
  const result = await allLocalBranches();

  expect(result.sort()).toEqual(branches.sort());
});
