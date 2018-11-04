const inquirer = require('inquirer');

exports.shouldRemoveLocalBranches = async () => {
    return  await inquirer
    .prompt([
        {
            type: 'confirm',
            message: 'Do you want to remove local branches?',
            name: 'shouldRemoveLocalBranchesPrompt',
        },
    ])
    .then(answer  => answer.shouldRemoveLocalBranchesPrompt);
}
