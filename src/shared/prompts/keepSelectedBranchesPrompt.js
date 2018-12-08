const inquirer = require('inquirer');
const { createUserOptionSelector } = require('../../../src/shared/prompt-functions/createUserOptionSelector');
const { createSelectedBranchFilter } = require('../../../src/shared/prompt-functions/createSelectedBranchFilter');
const { createBranchAvailabilityValidator } = require('../../../src/shared/prompt-functions/createBranchAvailabilityValidator');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

/**
 * @description A prompt that resolves to a list of branches to remove. It filter the user selection from the
 * branches available for removal and returns the result.
 * @param {array} branchesAvailableForRemoval
 * @returns {Promise}
 */
exports.keepSelectedBranchesPrompt = async (branchesAvailableForRemoval) => {
    const source = createUserOptionSelector(branchesAvailableForRemoval);
    const filter = createSelectedBranchFilter(branchesAvailableForRemoval);
    const validate = createBranchAvailabilityValidator(branchesAvailableForRemoval);

    return inquirer.prompt([
        {
            type: 'checkbox-plus',
            name: 'keepSelectedBranchesPrompt',
            message: 'Select only the branches you want to keep. (use spacebar to select/deselect options)',
            highlight: true,
            searchable: true,
            filter,
            validate,
            source,
        }
    ]).then(answer => answer.keepSelectedBranchesPrompt);
}
