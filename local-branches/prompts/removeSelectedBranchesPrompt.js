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
            filter(answer) {
                // filter any branch name that was not selected
                return branchesAvailableForRemoval.filter(branch => answer.includes(branch));
            },
            validate(answer) {
                console.log(typeof answer);
                console.log(answer);
                if (answer.length === 0) {
                    return `\n\nPlease select an option.\n\n`;
                }

                if (!branchesAvailableForRemoval.includes(answer)) {
                    return `\n\n${answer} is not one of the available branches:\n${JSON.stringify(branchesAvailableForRemoval, null, 2)}\n\n`;
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
