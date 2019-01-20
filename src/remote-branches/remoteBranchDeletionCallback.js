const simpleGit = require('simple-git/promise');

exports.remoteBranchDeletionCallback = async (branch) => {
  await simpleGit().push(remote, branch, { '--delete': null })
    .then(success => {
      console.log(`\n"${branch}" was successfully removed.\n`)
      successfullyRemovedBranches.push(branch)
    })
    .catch((error) => {
      console.error(error)
    })
}
