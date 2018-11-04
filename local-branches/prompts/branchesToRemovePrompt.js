const fuzzy = require('fuzzy');
const inquirer = require('inquirer');
const branchRemovalOptionsContent = require('../../shared/branchRemovalOptionsContent').branchRemovalOptionsContent;

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const removeAllBranchesExceptMainBranchContent = 'Remove all branches except the main branch.';
const removeSelectedBranchesContent = 'Select branch(es) to be removed.';
const keepSelectedBranchesContent = 'Select branch(es) to keep, and remove all other branches.';

exports.removeAllBranchesExceptMainBranchContent = removeAllBranchesExceptMainBranchContent;
exports.removeSelectedBranchesContent = removeSelectedBranchesContent;
exports.keepSelectedBranchesContent = keepSelectedBranchesContent;

exports.branchesToRemovePrompt = async (branchesAvailableForRemoval = []) => {
    // Can this be an array full of objects with a common key and a specific identifier
    // e.g. {title: 'remove etc. etc.', name: 'removeAllBranches'}
    // This will make it easier to do a comparision to handle these with conditionall logic
    // Alternatively we could create a constant for each of these strings.
    const branchRemovalOptions = [
        removeAllBranchesExceptMainBranchContent,
        removeSelectedBranchesContent,
        keepSelectedBranchesContent
    ];

    return await inquirer.prompt([
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
    ]);
}