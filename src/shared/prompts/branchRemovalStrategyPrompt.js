const inquirer = require('inquirer');
const { branchRemovalOptionsContent } = require('../branchRemovalOptionsContent');
const { createUserOptionSelector } = require('../prompt-functions/createUserOptionSelector');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

/**
 * Prompt the user to choose a branch removal strategy and resolve to that value.
 *
 * @param {array} branchesAvailableForRemoval
 * @param {array} branchRemovalOptions
 * @returns {Promise}
 */
exports.branchRemovalStrategyPrompt = async (branchesAvailableForRemoval, branchRemovalOptions) => {
    const source = createUserOptionSelector(branchRemovalOptions);

    return inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'branchRemovalStrategyPrompt',
            message: branchRemovalOptionsContent(branchesAvailableForRemoval),
            suggestOnly: false,
            source,
        }
    ]).then(answer => answer.branchRemovalStrategyPrompt);
}