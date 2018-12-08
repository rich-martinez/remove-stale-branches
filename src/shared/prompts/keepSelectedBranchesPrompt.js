const inquirer = require('inquirer');
const { createUserOptionSelector } = require('../../../src/shared/prompt-functions/createUserOptionSelector');
const { createSelectedBranchFilter } = require('../../../src/shared/prompt-functions/createSelectedBranchFilter');
const { createBranchAvailabilityValidator } = require('../../../src/shared/prompt-functions/createBranchAvailabilityValidator');

inquirer.registerPrompt('checkbox-plus', require('inquirer-checkbox-plus-prompt'));

/**
 * @description A prompt that resolves to a list of branches that will be saved while all the other branches
 * available for removal will be deleted.
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
            name: 'removeSelectedBranchesPrompt',
            message: 'Select only the branches you want to keep. (use spacebar to select/deselect options)',
            highlight: true,
            searchable: true,
            filter,
            validate,
            source,
        }
    ]).then(answer => answer.removeSelectedBranchesPrompt);
}
