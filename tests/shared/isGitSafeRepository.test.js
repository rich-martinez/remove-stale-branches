const simpleGit = require('simple-git/promise');
const { sync: commandExists } = require('command-exists');
const { isGitSafeRepository } = require('../../src/shared/isGitSafeRepository');

jest.mock('simple-git/promise');
jest.mock('command-exists');
jest.mock('simple-git/promise');

test('Git command does not exists returns false', async () => {
  commandExists.mockReturnValue(false);
  const result = await isGitSafeRepository();

  expect(result).toBe(false);
});

test('Remove stale branch tool was not run from a repository', async () => {
  commandExists.mockReturnValue(true);
  simpleGit.mockReturnValue({checkIsRepo: () => false});
  const result = await isGitSafeRepository();

  expect(result).toBe(false);
});

test('This is a git safe repo.', async () => {
  commandExists.mockReturnValue(true);
  simpleGit.mockReturnValue({checkIsRepo: () => true});
  const result = await isGitSafeRepository();

  expect(result).toBe(true);
});
