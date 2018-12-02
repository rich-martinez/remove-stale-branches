const simpleGit = require('simple-git/promise')
const { sync: commandExists } = require('command-exists')

/**
 * @description This function determines if git is available and if this command is being run from a git repository.
 * @returns {bool}
 */
exports.isGitSafeRepository = async () => {
  if (commandExists('git') === false) {
    console.log('\nPlease make sure git is installed and available to use on the command line before running this script.\n')
    return false
  }

  if (await simpleGit().checkIsRepo() === false) {
    console.log('\nPlease run this command from a git repository.\n')
    return false
  }

  return true
}
