#!/usr/bin/env node

/**
 * This is the entry point for removing stale remote/local branches.
 */
const removeStaleBranches = async () => {
    const { stalenessRemovalOptionsPrompt } = require('./main/prompts/staleness-removal-options/stalenessRemovalOptionsPrompt');
    const { removeStalenessContinuationPrompt } = require('./main/prompts/staleness-removal-continuation/removeStalenessContinuationPrompt');
    const { runLocalBranchRemoval } = require('./local-branches/localBranchRemoval');
    const { runRemoteBranchRemoval } = require('./remote-branches/remoteBranchRemoval');
    const { removeLocalBranches, removeRemoteBranches } = require('./main/prompts/staleness-removal-options/stalenessRemovalOptionsContent');

    let removeStalenessContinuationAnswer = true;
    let previouslyRemovedBranches = {
        localBranches: [],
        remoteBranches: [],
    };

    // make this a loop and make the responses to each removal option available to every other removal option
    while (removeStalenessContinuationAnswer === true) {
        const stalenessRemovalOptionsAnswer =  await stalenessRemovalOptionsPrompt();

        if (stalenessRemovalOptionsAnswer === removeLocalBranches) {
            const removedLocalBranches = await runLocalBranchRemoval(previouslyRemovedBranches);
            previouslyRemovedBranches.localBranches.concat(removedLocalBranches);
        } else if (stalenessRemovalOptionsAnswer === removeRemoteBranches) {
            const removedRemoteBranches = await runRemoteBranchRemoval(previouslyRemovedBranches);
            previouslyRemovedBranches.remoteBranches.concat(removedRemoteBranches);
        }
        removeStalenessContinuationAnswer = await removeStalenessContinuationPrompt();
    }

    console.log(`\n\nThat's a wrap.\n\n`);
};

exports.removeStaleBranches = removeStaleBranches;

removeStaleBranches();
