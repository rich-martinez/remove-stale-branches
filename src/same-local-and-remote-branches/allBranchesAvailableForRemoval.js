/**
 * Get a filtered array that represents the branch names that are 
 * shared between the remote branches and the local branches.
 * @param {array} localBranches
 * @param {array} remoteBranches
 * @returns {array}
 */
exports.allBranchesAvailableForRemoval = (localBranches, remoteBranches) => {
    let branchesToFilter = remoteBranches;
    let branchesToFind = localBranches;
    if (localBranches.length > remoteBranches.length) {
        branchesToFilter = localBranches;
        branchesToFind = remoteBranches;
    }

    return branchesToFilter.filter(branch => branchesToFind.includes(branch));
}
