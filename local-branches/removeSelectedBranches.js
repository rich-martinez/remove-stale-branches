const simpleGit = require('simple-git/promise')();

/**
 * @param {array} branchesToRemove
 * @returns {array}
 */
exports.removeSelectedBranches = async (branchesToRemove) => {
    let successfullyRemovedBranches = [];

    branchesToRemove.forEach((branch) => {
        console.log(`\nRemoving branch: ${branch}\n`);
        simpleGit.deleteLocalBranch(branch)
        .then((branchDeletionSummary) => {
            if (branchDeletionSummary.success) {
                console.log(`${branchDeletionSummary.branch} was successfully removed`);
                successfullyRemovedBranches.push(branchDeletionSummary.branch);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    });

    return successfullyRemovedBranches;
}