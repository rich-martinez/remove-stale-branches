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
            filter(answer) {
                // filter any branch name that was selected
                return branchesAvailableForRemoval.filter(branch => !answer.includes(branch));
            },
            validate(answer) {
                if (answer.length === 0) {
                    return `\n\nPlease leave at least one branch to remove.\n\n`;
                }

                if (!answer.some(branch => branchesAvailableForRemoval.includes(branch))) {
                    return `\n\n${answers} is not one of the available branches:\n${JSON.stringify(branchesAvailableForRemoval, null, 2)}\n\n`;
                }

                return true;
            },
            async source(answer, input) {
                const branchesSelectedForRemoval = await fuzzyUserOptionSearch(input, branchesAvailableForRemoval);

                return branchesSelectedForRemoval;
            },
        }
    ]).then(answer => answer.removeSelectedBranchesPrompt);
}
