const { stalenessRemovalOptionsPrompt } = require('./prompts/staleness-removal-options/stalenessRemovalOptionsPrompt');
const { removeStalenessContinuationPrompt } = require('./prompts/staleness-removal-continuation/removeStalenessContinuationPrompt');
const { runLocalBranchRemoval } = require('../local-branches/localBranchRemoval');
const { runRemoteBranchRemoval } = require('../remote-branches/remoteBranchRemoval');
const { removeLocalBranches, removeRemoteBranches } = require('./prompts/staleness-removal-options/stalenessRemovalOptionsContent');

/**
 * @description This function is intended to run user prompts to determine what, if any, stale branches
 * should be removed.
 */
exports.removeStaleBranches = async () => {
    let removeStalenessContinuationAnswer = true;
    let previouslyRemovedBranches = {
        localBranches: [],
        remoteBranches: [],
    };

    // make this a loop and make the responses to each removal option available to every other removal option
    while (removeStalenessContinuationAnswer === true) {
        const stalenessRemovalOptionsAnswer =  await stalenessRemovalOptionsPrompt();
        console.log(stalenessRemovalOptionsAnswer);
        if (stalenessRemovalOptionsAnswer === removeLocalBranches) {
            const removedLocalBranches = await runLocalBranchRemoval(previouslyRemovedBranches);
            previouslyRemovedBranches.localBranches.concat(removedLocalBranches);
            console.log(removedLocalBranches);
        } else if (stalenessRemovalOptionsAnswer === removeRemoteBranches) {
            const removedRemoteBranches = await runRemoteBranchRemoval(previouslyRemovedBranches);
            previouslyRemovedBranches.remoteBranches.concat(removedRemoteBranches);
            console.log(removedRemoteBranches);
        }
        removeStalenessContinuationAnswer = await removeStalenessContinuationPrompt();
        console.log(removeStalenessContinuationAnswer);
    }

    console.log(`\n\nThat's a wrap.\n\n`);
}
