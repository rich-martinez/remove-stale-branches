const commandExists = require('command-exists').sync;

exports.checkGitExists = () => {
    if (!commandExists('git')) {
        console.log('Please make sure git is installed and available to use on the command line before running this script.\n')
    }
};
