const simpleGit = require('simple-git/promise')();

/**
 * @param {array} branchesToRemove
 */
exports.removeSelectedBranches = (branchesToRemove) => {
    branchesToRemove.forEach((branch) => {
        console.log(`\nRemoving branch: ${branch}\n`);
        simpleGit.deleteLocalBranch(branch)
        .then((branchDeletionSummary) => {
            if (branchDeletionSummary.success) {
                console.log(`${branchDeletionSummary.branch} was successfully removed`);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    });
}