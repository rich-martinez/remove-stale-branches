const fuzzy = require('fuzzy');
const inquirer = require('inquirer');
const branchRemovalOptionsContent = require('../branchRemovalOptionsContent').branchRemovalOptionsContent;

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
                const branchRemovalOptionSearch = await new Promise((resolve) => {
                    input = input || '';
                    // TODO: Can I filter with an array full of objects?
                    let fuzzyResult = fuzzy.filter(input, branchRemovalOptions);
                    return resolve(fuzzyResult.map(removalOption => removalOption.original));
                });

                return branchRemovalOptionSearch;
            },
        }
    ]).then(answer => answer.branchesToRemovePrompt);
}