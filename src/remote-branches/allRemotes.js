const simpleGit = require('simple-git/promise')

/**
 * Resolves to all available remotes.
 * @returns {Promise}
 */
exports.allRemotes = async () => {
  return simpleGit().getRemotes().then(remotes => remotes.map(remote => remote.name))
}
