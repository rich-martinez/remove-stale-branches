const simpleGit = require('simple-git/promise')
const { asyncForEach } = require('../shared/asyncForEach')

/**
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
  await asyncForEach(branchesToRemove, async (branch) => {
    await simpleGit().deleteLocalBranch(branch)
      .then((branchDeletionSummary) => {
        if (branchDeletionSummary.success) {
          console.log(`\n"${branchDeletionSummary.branch}" was successfully removed.\n`)
          successfullyRemovedBranches.push(branchDeletionSummary.branch)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  })

  return successfullyRemovedBranches
}
