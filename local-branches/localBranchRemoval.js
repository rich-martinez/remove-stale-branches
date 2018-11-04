const isGitSafeRepository = require('../shared/isGitSafeRepository').isGitSafeRepository;
const shouldRemoveLocalBranches = require('./shouldRemoveLocalBranches').shouldRemoveLocalBranches;
const allBranches = require('../shared/allBranches').allBranches;
const mainBranchPrompt = require('./prompts/mainBranchPrompt').mainBranchPrompt;
const branchesToRemovePrompt = require('./prompts/branchesToRemovePrompt').branchesToRemovePrompt;
const removeAllBranchesExceptMainBranchContent = require('./prompts/branchesToRemovePrompt').removeAllBranchesExceptMainBranchContent;
const removeSelectedBranchesContent = require('./prompts/branchesToRemovePrompt').removeSelectedBranchesContent;
const keepSelectedBranchesContent = require('./prompts/branchesToRemovePrompt').keepSelectedBranchesContent;
const removeSelectedBranchesPrompt = require('./prompts/removeSelectedBranchesPrompt').removeSelectedBranchesPrompt;

exports.runLocalBranchRemoval = async () => {
    if (isGitSafeRepository() && await shouldRemoveLocalBranches() === true) {
        const branches = await allBranches();
        const mainBranchAnswer = await mainBranchPrompt(branches);
        const branchesAvailableForRemoval = branches.filter(branch => branch !== mainBranchAnswer);
        const branchesToRemoveAnswer = await branchesToRemovePrompt(branchesAvailableForRemoval);
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
