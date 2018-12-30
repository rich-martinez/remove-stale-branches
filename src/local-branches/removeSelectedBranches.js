const simpleGit = require('simple-git/promise')
const { asyncForEach } = require('../shared/asyncForEach')
const { localBranchDeletionCallback } = require('./localBranchDeletionCallback');

/**
 * @description Attempt to remove all the local branches that have been selected by the user.
 * @param {string} mainBranch
 * @param {array} branchesToRemove
 * @returns {array}
 */
exports.removeSelectedBranches = async (mainBranch, branchesToRemove) => {
  let successfullyRemovedBranches = []

  const { modified } = await simpleGit().status();
  if (modified.length > 0) {
    console.log(`\nTo avoid losing uncommited changes please commit, stash, or reset your changes and then try again.\n`);
    return successfullyRemovedBranches;
  }

  // checkout to the main branch before trying to remove any branches
  await simpleGit().checkout(mainBranch)

  // make sure all the callbacks have finshed before returning anything
  successfullyRemovedBranches = await asyncForEach(branchesToRemove, localBranchDeletionCallback)

  return successfullyRemovedBranches
}
