const { isGitSafeRepository } = require('../shared/isGitSafeRepository')
const { allRemotes } = require('../remote-branches/allRemotes')
const { removeSelectedBranches } = require('./removeSelectedBranches')
const { remoteNamePrompt } = require('./prompts/remoteNamePrompt')
const { branchesAvailableForRemoval } = require('./branchesAvailableForRemoval');
const { branchesToRemove } = require('../shared/branchesToRemove')

/**
 * @param {object} previouslyRemovedBranches - This is intended to be used to provide an additional option
 *  for the branches to remove prompt. For instance, removing branches remotely that have already been
 * removed locally.
 * @returns {array}
 */
exports.runRemoteBranchRemoval = async (previouslyRemovedBranches) => {
  if (isGitSafeRepository()) {
    let removedBranches = [];
    const remotes = await allRemotes()

    if (remotes.length === 0) {
      console.log('\nThere are no remotes available for branch removal.\n');
      return removedBranches;
    }

    const remoteNameAnswer = await remoteNamePrompt(remotes)
    const remoteNameIdentifier = `${remoteNameAnswer}/`
    const allBranchesAvailableForRemoval =  await branchesAvailableForRemoval(remoteNameIdentifier)

    if (allBranchesAvailableForRemoval.length === 0) {
      console.log('\nThere are no branches in that remote that are available for removal.\n');
      return removedBranches;
    }

    const selectedBranchesToRemove = await branchesToRemove(allBranchesAvailableForRemoval)

    // run method to remove branches
    removedBranches = await removeSelectedBranches(selectedBranchesToRemove)

    return removedBranches
  }
}
