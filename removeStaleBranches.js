#!/usr/bin/env node

const removeStaleBranches = async () => {
    const { stalenessRemovalOptionsPrompt } = require('./main/prompts/stalenessRemovalOptions/stalenessRemovalOptionsPrompt');
    const { removeStalenessContinuationPrompt } = require('./main/prompts/removeStalenessContinuation/removeStalenessContinuationPrompt');
    const { runLocalBranchRemoval } = require('./local-branches/localBranchRemoval');

    let removeStalenessContinuationAnswer = true;
    let previouslyRemovedBranches = {
        localBranches: [],
        remoteBranches: [],
    };

    // make this a loop and make the responses to each removal option available to every other removal option
    while (removeStalenessContinuationAnswer === true) {
        const stalenessRemovalOptionsAnswer =  await stalenessRemovalOptionsPrompt();
        if (stalenessRemovalOptionsAnswer === 'removeLocalBranches') {
            const removedLocalBranches = await runLocalBranchRemoval(previouslyRemovedBranches);
            previouslyRemovedBranches.localBranches.concat(removedLocalBranches);
        } else if (stalenessRemovalOptionsAnswer === 'removeRemoteBranches') {
            // await runRemoteBranchRemoval(previouslyRemovedBranches);
        }
        removeStalenessContinuationAnswer = await removeStalenessContinuationPrompt();
    }
};

removeStaleBranches();

console.log(`\n\nYour repository has been freshened up.\n\n`);