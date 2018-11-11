const inquirer = require('inquirer');

exports.removeStalenessContinuationPrompt = async () => {
    return inquirer
    .prompt([
        {
            type: 'confirm',
            message: 'Do you want to continue to remove stale branches?',
            name: 'removeStalenessContinuationPrompt',
        },
    ])
    .then(answer  => answer.removeStalenessContinuationPrompt);
}