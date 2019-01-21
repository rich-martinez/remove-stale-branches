const simpleGit = require('simple-git/promise')

/**
 * @description This callback is intended to be used in the asyncForEach to removed selected branches.
 * @param {object} - This represents a branch name and a remote name.
 * @returns {undefined|string}
 */
exports.remoteBranchDeletionCallback = async ({ branch, remote }) => {
  let successfullyRemovedBranch
  await simpleGit().push(remote, branch, { '--delete': null })
    .then(() => {
      console.log(`\n"${branch}" was successfully removed.\n`)
      successfullyRemovedBranch = branch
    })
    .catch((error) => {
      console.error(error)
    })

  return successfullyRemovedBranch
}
