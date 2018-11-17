/**
 * @param {string}
 * @returns {Promise}
 */
exports.branchesAvailableForRemoval = async (remoteNameIdentifier) => {
  return simpleGit.branch(['--remote']).then(remoteBranches => remoteBranches.all)
    .filter(remoteBranch => remoteBranch.startsWith(remoteNameIdentifier))
    .map(remoteBranch => remoteBranch.replace(remoteNameIdentifier, ''));
}