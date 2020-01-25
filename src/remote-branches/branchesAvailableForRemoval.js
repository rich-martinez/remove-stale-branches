const simpleGit = require('simple-git/promise')

/**
 * This resolves to an array of available branches for the specified remote.
 * @param {string} remoteNameAnswer
 * @returns {Promise}
 */
exports.branchesAvailableForRemoval = async (remoteNameAnswer) => {
  const remoteNameIdentifier = `${remoteNameAnswer}/`
  const git = simpleGit();

  // Make sure we have the most up to date branches before we filter remote branches
  await git.fetch(remoteNameAnswer);

  const remoteBranches = await git.branch(['--remote']).then(remoteBranches => remoteBranches.all)

  return remoteBranches
    .filter(remoteBranch => remoteBranch.startsWith(remoteNameIdentifier))
    .map(remoteBranch => remoteBranch.replace(remoteNameIdentifier, ''))
}
