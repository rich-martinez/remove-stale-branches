const { asyncForEach } = require('../shared/asyncForEach')
const { remoteBranchDeletionCallback } = require('./remoteBranchDeletionCallback');

/**
 * @param {array} branchesToRemove
 * @param {string} remote
 * @returns {array}
 */
exports.removeSelectedBranches = async (branchesToRemove, remote) => {
  const successfullyRemovedBranches = await asyncForEach(branchesToRemove, remoteBranchDeletionCallback)

  return successfullyRemovedBranches;
}
