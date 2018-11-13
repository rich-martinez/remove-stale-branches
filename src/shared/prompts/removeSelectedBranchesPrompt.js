const fuzzy = require('fuzzy');
const inquirer = require('inquirer');
const { fuzzyUserOptionSearch } = require('../fuzzyUserOptionSearch');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

/**
 * @param {array} branchesAvailableForRemoval
 * @returns {Promise}
 */
exports.removeSelectedBranchesPrompt = async (branchesAvailableForRemoval) => {
    return inquirer.prompt([
        {
            type: 'checkbox-plus',
            name: 'removeSelectedBranchesPrompt',
            message: 'Select the branches to remove. (use spacebar to select/deselect options)',
            highlight: true,
            searchable: true,
            async source(answers, input) {
                const branchesSelectedForRemoval = await fuzzyUserOptionSearch(input, branchesAvailableForRemoval);

                return branchesSelectedForRemoval;
            },
        }
    ]).then(answer => answer.removeSelectedBranchesPrompt);
}
