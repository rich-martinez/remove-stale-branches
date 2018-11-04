const isGitSafeRepository = require('../shared/isGitSafeRepository').isGitSafeRepository;
const shouldRemoveLocalBranches = require('./shouldRemoveLocalBranches').shouldRemoveLocalBranches;
const allBranches = require('../shared/allBranches').allBranches;
const mainBranchPrompt = require('./prompts/mainBranchPrompt').mainBranchPrompt;
const branchesToRemovePrompt = require('./prompts/branchesToRemovePrompt').branchesToRemovePrompt;
const removeAllBranchesExceptMainBranchContent = require('./prompts/branchesToRemovePrompt').removeAllBranchesExceptMainBranchContent;
const removeSelectedBranchesContent = require('./prompts/branchesToRemovePrompt').removeSelectedBranchesContent;
const keepSelectedBranchesContent = require('./prompts/branchesToRemovePrompt').keepSelectedBranchesContent;

exports.runLocalBranchRemoval = async () => {
    if (isGitSafeRepository() && await shouldRemoveLocalBranches() === true) {
        const branches = await allBranches();
        const mainBranchAnswer = await mainBranchPrompt(branches);
        const branchesAvailableForRemoval = branches.filter(branch => branch !== mainBranchAnswer);
        const branchesToRemoveAnswer = await branchesToRemovePrompt(branchesAvailableForRemoval);

        if (branchesToRemoveAnswer === removeAllBranchesExceptMainBranchContent) {

        } else if (branchesToRemoveAnswer === removeSelectedBranchesContent) {

        } else if (branchesToRemoveAnswer === keepSelectedBranchesContent) {

        }

        console.log('Oops! Something went wrong.');
        process.exit(1);
    } else {
        // If 'n' was selected then move on.
        console.log('\nMoving on...\n');
    }
}
