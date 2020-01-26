const { removeSelectedBranches: removeSelectedRemoteBranches } = require('../remote-branches/removeSelectedBranches')
const { removeSelectedBranches: removeSelectedLocalBranches } = require('../local-branches/removeSelectedBranches')

/**
 * @param {array} branchesToRemove
 * @param {string} mainLocalBranch
 * @param {string} remote
 * @returns {array}
 */
exports.removeSelectedBranches = async (branchesToRemove, mainLocalBranch, remote) => {
    let successfullyRemovedBranches = []
    successfullyRemovedBranches += await removeSelectedLocalBranches(mainLocalBranch, branchesToRemove)
    successfullyRemovedBranches += await removeSelectedRemoteBranches(branchesToRemove, remote)


    return successfullyRemovedBranches
}
