const fuzzy = require('fuzzy');
const inquirer = require('inquirer');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

exports.removeSelectedBranchesPrompt = async (branchesAvailableForRemoval) => {
    return inquirer.prompt([
        {
            type: 'checkbox-plus',
            name: 'removeSelectedBranchesPrompt',
            message: 'Select the branches to remove. (use spacebar to select/deselect options)',
            highlight: true,
            searchable: true,
            filter(answers) {
                // filter any branch name that was not selected
                return branchesAvailableForRemoval.filter(branch => answers.includes(branch));
            },
            validate(answers) {
                if (answers.length === 0) {
                    return `\n\nPlease select an option.\n\n`;
                }

                if (!answers.some(answer => branchesAvailableForRemoval.includes(answer))) {
                    return `\n\n${answers} is not one of the available branches:\n${JSON.stringify(branchesAvailableForRemoval, null, 2)}\n\n`;
                }

                return true;
            },
            async source(answersSoFar, input) {
                input = input || '';

                return await new Promise(resolve => {
                    const fuzzyResult = fuzzy.filter(input, branchesAvailableForRemoval);

                    return resolve(fuzzyResult.map(branchName => branchName.original));
                });
            },
        }
    ]).then(answer => answer.removeSelectedBranchesPrompt);
}
