const simpleGit = require('simple-git/promise')();
const commandExists = require('command-exists').sync;

exports.isGitSafeRepository = async () => {
    if (!commandExists('git')) {
        console.log('\nPlease make sure git is installed and available to use on the command line before running this script.\n');
        process.exit(1);
    }

    if (await simpleGit.checkIsRepo() !== true) {
        console.log('\nPlease run this command from a git repository.\n');
        process.exit(1);
    }

    return true;
}