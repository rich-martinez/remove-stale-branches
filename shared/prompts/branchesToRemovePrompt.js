const fuzzy = require('fuzzy');
const inquirer = require('inquirer');
const { branchRemovalOptionsContent } = require('../branchRemovalOptionsContent');
const { fuzzyUserOptionSearch } = require('../fuzzyUserOptionSearch');


inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

exports.branchesToRemovePrompt = async (branchesAvailableForRemoval, branchRemovalOptions) => {
    if (branchesAvailableForRemoval.length === 0) {
        console.log(`\n\nThere are no local branches available for removal.\n\n`);
        process.exit(1);
    }

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