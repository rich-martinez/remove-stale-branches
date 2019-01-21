const { asyncForEach } = require('../shared/asyncForEach');
const { remoteBranchDeletionCallback } = require('./remoteBranchDeletionCallback');

/**
 * @param {array} branchesToRemove
 * @param {string} remote
 * @returns {array}
 */
exports.removeSelectedBranches = async (branchesToRemove, remote) => {
  let successfullyRemovedBranches = []
  const branchesAndRemotes = branchesToRemove.map(branch => ({remote, branch,}));

  // make sure all the callbacks have finshed before returning anything
  successfullyRemovedBranches = await asyncForEach(branchesAndRemotes, remoteBranchDeletionCallback);

  return successfullyRemovedBranches;
}
