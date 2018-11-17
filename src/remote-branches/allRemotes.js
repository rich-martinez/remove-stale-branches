const simpleGit = require('simple-git/promise')()

/**
 * @returns {Promise}
 */
exports.allRemotes = async () => {
  return simpleGit.getRemotes().then(remotes => remotes.map(remote => remote.name))
}
