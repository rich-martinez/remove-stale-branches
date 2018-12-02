const simpleGit = require('simple-git/promise');
const { sync: commandExists } = require('command-exists');
const { isGitSafeRepository } = require('../../src/shared/isGitSafeRepository');

jest.mock('simple-git/promise');
jest.mock('command-exists');

global.console = {log: jest.fn()};

test('Git command does not exists returns false', async () => {
  commandExists.mockReturnValue(false);
  const result = await isGitSafeRepository();

  expect(result).toBe(false);
  expect(console.log).toBeCalledWith('\nPlease make sure git is installed and available to use on the command line before running this script.\n');
});

test('Remove stale branch tool was not run from a repository', async () => {
  commandExists.mockReturnValue(true);
  simpleGit.mockReturnValue({checkIsRepo: () => false});
  const result = await isGitSafeRepository();

  expect(result).toBe(false);
  expect(console.log).toBeCalledWith('\nPlease run this command from a git repository.\n');
});

test('This is a git safe repo.', async () => {
  commandExists.mockReturnValue(true);
  simpleGit.mockReturnValue({checkIsRepo: () => true});
  const result = await isGitSafeRepository();

  expect(result).toBe(true);
});
