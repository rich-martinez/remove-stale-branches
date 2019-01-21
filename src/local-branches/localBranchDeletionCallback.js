const simpleGit = require('simple-git/promise')

/**
 * @param {string} branch
* @returns string
*/
exports.localBranchDeletionCallback = async (branch) => {
  let successfullyRemovedBranch

  await simpleGit().deleteLocalBranch(branch)
    .then(({ branch }) => {
      successfullyRemovedBranch = branch
      console.log(`\n"${successfullyRemovedBranch}" was successfully removed.\n`)
    })
    .catch((error) => {
      console.error(error)
    })

  return successfullyRemovedBranch
}
