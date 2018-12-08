const inquirer = require('inquirer');
const { createUserOptionSelector } = require('../prompt-functions/createUserOptionSelector');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

/**
 * A prompt that resolves to a list of branches that will be removed.
 *
 * @param {array} branchesAvailableForRemoval
 * @returns {Promise}
 */
exports.removeSelectedBranchesPrompt = async (branchesAvailableForRemoval) => {
    const source = createUserOptionSelector(branchesAvailableForRemoval);

    return inquirer.prompt([
        {
            type: 'checkbox-plus',
            name: 'removeSelectedBranchesPrompt',
            message: 'Select the branches to remove. (use spacebar to select/deselect options)',
            highlight: true,
            searchable: true,
            source,
        }
    ]).then(answer => answer.removeSelectedBranchesPrompt);
}
