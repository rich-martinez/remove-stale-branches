const simpleGit = require('simple-git/promise')

/**
 * @param {string} branch
* @returns string
*/
exports.localBranchDeletionCallback = async (branch) => {
  let successfullyRemovedBranch

  await simpleGit().deleteLocalBranch(branch)
    .then((branchDeletionSummary) => {
      if (branchDeletionSummary.success) {
        successfullyRemovedBranch = branchDeletionSummary.branch
        console.log(`\n"${successfullyRemovedBranch}" was successfully removed.\n`)
      }
    })
    .catch((error) => {
      console.error(error)
    })

  return successfullyRemovedBranch
}
