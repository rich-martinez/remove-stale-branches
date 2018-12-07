const inquirer = require('inquirer');
const { branchRemovalOptionsContent } = require('../branchRemovalOptionsContent');
const { createUserOptionsSelector } = require('../prompt-functions/createUserOptionSelector');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

/**
 * @param {array} branchesAvailableForRemoval
 */
exports.branchesToRemovePrompt = async (branchesAvailableForRemoval, branchRemovalOptions) => {
    const source = createUserOptionsSelector(branchRemovalOptions);

    return inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'branchesToRemovePrompt',
            message: branchRemovalOptionsContent(branchesAvailableForRemoval),
            suggestOnly: false,
            source,
        }
    ]).then(answer => answer.branchesToRemovePrompt);
}