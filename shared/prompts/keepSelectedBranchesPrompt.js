const fuzzy = require('fuzzy');
const inquirer = require('inquirer');
const { fuzzyUserOptionSearch } = require('../fuzzyUserOptionSearch');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

/**
 * @param {array} branchesAvailableForRemoval
 * @returns {Promise}
 */
exports.keepSelectedBranchesPrompt = async (branchesAvailableForRemoval) => {
    return inquirer.prompt([
        {
            type: 'checkbox-plus',
            name: 'removeSelectedBranchesPrompt',
            message: 'Select only the branches you want to keep. (use spacebar to select/deselect options)',
            highlight: true,
            searchable: true,
            filter(answers) {
                // filter any branch name that was selected
                return branchesAvailableForRemoval.filter(branch => !answers.includes(branch));
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
            async source(answers, input) {
                const branchesAvailableForRemoval = await fuzzyUserOptionSearch(input, branchesAvailableForRemoval);

                return branchesAvailableForRemoval;
            },
        }
    ]).then(answer => answer.removeSelectedBranchesPrompt);
}
