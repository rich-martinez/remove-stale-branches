const isGitSafeRepository = require('../shared/isGitSafeRepository').isGitSafeRepository;
const shouldRemoveLocalBranches = require('./shouldRemoveLocalBranches').shouldRemoveLocalBranches;
const allBranches = require('../shared/allBranches').allBranches;
const mainBranchPrompt = require('./prompts/mainBranchPrompt').mainBranchPrompt;
const branchesToRemovePrompt = require('./prompts/branchesToRemovePrompt').branchesToRemovePrompt;

exports.runLocalBranchRemoval = async () => {
    if (isGitSafeRepository() && await shouldRemoveLocalBranches() === true) {
        const branches = await allBranches();
        const mainBranchAnswer = await mainBranchPrompt(branches);
        const branchesAvailableForRemoval = branches.filter(branch => branch !== mainBranchAnswer);

        const branchesToRemoveAnswer = branchesToRemovePrompt(branchesAvailableForRemoval);

        // showOptions(branchesAvailableForRemoval);

    } else {
        // If 'n' was selected then move on.
        console.log('\nMoving on...\n');
    }
}
