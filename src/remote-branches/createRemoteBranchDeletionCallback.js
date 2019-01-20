const simpleGit = require('simple-git/promise');

exports.createRemoteBranchDelectionCallback = (remote) => {
  const remoteBranchDeletionCallback = async (branch) => {
    const successfullyRemovedBranch = [];
    await simpleGit().push(remote, branch, { '--delete': null })
      .then(success => {
        console.log(`\n"${branch}" was successfully removed.\n`)
        successfullyRemovedBranch.push(branch)
      })
      .catch((error) => {
        console.error(error)
      })

      return successfullyRemovedBranch;
  };

  return remoteBranchDeletionCallback;
}