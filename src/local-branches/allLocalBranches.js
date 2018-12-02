const simpleGit = require('simple-git/promise')

/**
 * @returns {Promise}
 */
exports.allLocalBranches = async () => {
  return simpleGit().branchLocal().then(branches => branches.all)
}
