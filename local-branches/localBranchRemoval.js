const { isGitSafeRepository } = require('../shared/isGitSafeRepository');
const { allBranches } = require('../shared/allBranches');
const { mainBranchPrompt } = require('./prompts/mainBranch/mainBranchPrompt');
const { branchesToRemovePrompt } = require('../shared/prompts/branchesToRemovePrompt');
const { removeSelectedBranchesPrompt } = require('../shared/prompts/removeSelectedBranchesPrompt');
const { keepSelectedBranchesPrompt } = require('../shared/prompts/keepSelectedBranchesPrompt');
const { removeSelectedBranches } = require('./removeSelectedBranches');
const {
    removeAllBranchesExceptMainBranchContent,
    removeSelectedBranchesContent,
    keepSelectedBranchesContent
} = require('../shared/branchRemovalOptionsContent');

/**
 * @param {object} previouslyRemovedBranches - This is intended to be used to provide an additional option
 *  for the branches to remove prompt. For instance, removing branches remotely that have already been
 * removed locally.
 * @returns {array}
 */
exports.runLocalBranchRemoval = async (previouslyRemovedBranches) => {
    if (isGitSafeRepository()) {
        const branches = await allBranches();
        const mainBranchAnswer = await mainBranchPrompt(branches);
        const branchesAvailableForRemoval = branches.filter(branch => branch !== mainBranchAnswer);
        const branchesToRemoveAnswer = await branchesToRemovePrompt(
            branchesAvailableForRemoval,
            [
                removeAllBranchesExceptMainBranchContent,
                removeSelectedBranchesContent,
                keepSelectedBranchesContent
            ]
        );
        let selectedBranchesToRemove = [];

        if (branchesToRemoveAnswer === removeAllBranchesExceptMainBranchContent) {
            selectedBranchesToRemove = branchesAvailableForRemoval;
        } else if (branchesToRemoveAnswer === removeSelectedBranchesContent) {
            selectedBranchesToRemove = await removeSelectedBranchesPrompt(branchesAvailableForRemoval);
        } else if (branchesToRemoveAnswer === keepSelectedBranchesContent) {
            selectedBranchesToRemove = await keepSelectedBranchesPrompt(branchesAvailableForRemoval);
        } else {
            console.log('Oops! Something went wrong.');
            process.exit(1);
        }

        //run method to remove branches
        const successfullyRemovedBranches = await removeSelectedBranches(selectedBranchesToRemove);

        return successfullyRemovedBranches;
    }

    console.log('\nMoving on...\n');
}
