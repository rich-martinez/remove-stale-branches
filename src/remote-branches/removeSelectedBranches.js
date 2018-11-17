const simpleGit = require('simple-git/promise')()
const { asyncForEach } = require('../shared/asyncForEach')

/**
 * @param {array} branchesToRemove
 * @returns {array}
 */
exports.removeSelectedBranches = async (branchesToRemove) => {
  let successfullyRemovedBranches = []

  // make sure all the callbacks have finshed before returning anything
  await asyncForEach(branchesToRemove, async (branch) => {
    await simpleGit.deleteLocalBranch(branch)
      .then((branchDeletionSummary) => {
        if (branchDeletionSummary.success) {
          console.log(`\n"${branchDeletionSummary.branch}" was successfully removed\n`)
          successfullyRemovedBranches.push(branchDeletionSummary.branch)
        }
      })
      .catch((error) => {
        console.error(error)
      })
  })

  return successfullyRemovedBranches
}
