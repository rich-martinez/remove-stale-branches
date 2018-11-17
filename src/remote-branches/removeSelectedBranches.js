const simpleGit = require('simple-git/promise')()
const { asyncForEach } = require('../shared/asyncForEach')

/**
 * @param {array} branchesToRemove
 * @param {string} remote
 * @returns {array}
 */
exports.removeSelectedBranches = async (branchesToRemove, remote) => {
  let successfullyRemovedBranches = []

  // make sure all the callbacks have finshed before returning anything
  await asyncForEach(branchesToRemove, async (branch) => {
    await simpleGit.push(remote, branch, {'--delete': null})
      .then(success => {
          console.log(`\n"${branch}" was successfully removed.\n`)
          successfullyRemovedBranches.push(branch)
      })
      .catch((error) => {
        console.error(error)
      })
  })

  return successfullyRemovedBranches
}
