const { isGitSafeRepository } = require('../shared/isGitSafeRepository');
const { shouldRemoveLocalBranches } = require('./shouldRemoveLocalBranches');
const { allBranches } = require('../shared/allBranches');
const { mainBranchPrompt } = require('./prompts/mainBranchPrompt');
const { branchesToRemovePrompt } = require('../shared/prompts/branchesToRemovePrompt');
const { removeSelectedBranchesPrompt } = require('../shared/prompts/removeSelectedBranchesPrompt');
const {
    removeAllBranchesExceptMainBranchContent,
    removeSelectedBranchesContent,
    keepSelectedBranchesContent
} = require('../shared/branchRemovalOptionsContent');


exports.runLocalBranchRemoval = async () => {
    if (isGitSafeRepository() && await shouldRemoveLocalBranches() === true) {
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
            //selectedBranchesToRemove = keepSelectedBranchesPrompt();
        } else {
            console.log('Oops! Something went wrong.');
            process.exit(1);
        }
        console.log(JSON.stringify(selectedBranchesToRemove, null , 2));
        //run method to remove branches
        // removeSelectedBranches(selectedBranchesToRemove)
    }

    console.log('\nMoving on...\n');
}
