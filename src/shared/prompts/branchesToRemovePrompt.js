const inquirer = require('inquirer');
const { branchRemovalOptionsContent } = require('../branchRemovalOptionsContent');
const { fuzzyUserOptionSearch } = require('../fuzzyUserOptionSearch');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

/**
 * @param {array} branchesAvailableForRemoval
 */
exports.branchesToRemovePrompt = async (branchesAvailableForRemoval, branchRemovalOptions) => {
    return inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'branchesToRemovePrompt',
            message: branchRemovalOptionsContent(branchesAvailableForRemoval),
            suggestOnly: false,
            async source(answers, input) {
                const branchRemovalOptionSearch = await fuzzyUserOptionSearch(input, branchRemovalOptions);

                return branchRemovalOptionSearch;
            },
        }
    ]).then(answer => answer.branchesToRemovePrompt);
}