const { isGitSafeRepository } = require('../shared/isGitSafeRepository')
const { allRemotes } = require('../remote-branches/allRemotes')
const { removeSelectedBranches } = require('./removeSelectedBranches')
const { remoteNamePrompt } = require('./prompts/remoteNamePrompt')
const { branchesAvailableForRemoval: remoteBranchesAvailableForRemoval } = require('./branchesAvailableForRemoval')
const { branchesToRemove } = require('../shared/branchesToRemove')
const { allBranchesAvailableForRemoval } = require('./allBranchesAvailableForRemoval')
const { branchesToRemove } = require('../shared/branchesToRemove')

/**
 * @returns {array}
 */
exports.runBranchRemoval = async () => {
    if (await isGitSafeRepository() === false) {
        console.error('\n\nThis command only works if it is run from a git repository.\n\n')
        return process.exit(1)
      }
    
      let removedBranches = []
      const remotes = await allRemotes()
      const localBranches = await allLocalBranches()

    
      if (remotes.length === 0) {
        console.log('\nThere are no remotes available for branch removal.\n')
        return removedBranches
      }

      if (localBranches.length === 0) {
        console.log('\nThere are no local branches available for removal.\n')
        return removedBranches
      }

      const remoteNameAnswer = await remoteNamePrompt(remotes)
      const remoteBranchesAvailableForRemoval = await remoteBranchesAvailableForRemoval(remoteNameAnswer)

      const mainBranchAnswer = await mainBranchPrompt(localBranches)
      const localBranchesAvailableForRemoval = localBranches.filter(branch => branch !== mainBranchAnswer)
      
      const allBranchesAvailableForRemoval = allBranchesAvailableForRemoval(
        localBranchesAvailableForRemoval, 
        remoteBranchesAvailableForRemoval
      );
    
      if (allBranchesAvailableForRemoval.length === 0) {
        console.log('\nThere are no branches in that remote that are available for removal.\n')
        return removedBranches
      }

      const selectedBranchesToRemove = await branchesToRemove(allBranchesAvailableForRemoval)

      // run method to remove branches
      removedBranches = await removeSelectedBranches(selectedBranchesToRemove, mainBranchAnswer, remoteNameAnswer)
}
