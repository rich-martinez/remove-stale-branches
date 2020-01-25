const { isGitSafeRepository } = require('../shared/isGitSafeRepository')
const { allLocalBranches } = require('../local-branches/allLocalBranches')
const { mainBranchPrompt } = require('./prompts/mainBranchPrompt')
const { removeSelectedBranches } = require('./removeSelectedBranches')
const { branchesToRemove } = require('../shared/branchesToRemove')

/**
 * @returns {array|undefined}
 */
exports.runLocalBranchRemoval = async () => {
  if (await isGitSafeRepository() === false) {
    console.error('\n\nThis command only works if it is run from a git repository.\n\n')
    return process.exit(1)
  }

  let removedBranches = []
  const localBranches = await allLocalBranches()

  if (localBranches.length === 0) {
    console.log('\nThere are no local branches available for removal.\n')
    return removedBranches
  }

  const mainBranchAnswer = await mainBranchPrompt(localBranches)
  const branchesAvailableForRemoval = localBranches.filter(branch => branch !== mainBranchAnswer)

  const selectedBranchesToRemove = await branchesToRemove(branchesAvailableForRemoval)

  // run method to remove branches
  removedBranches = await removeSelectedBranches(mainBranchAnswer, selectedBranchesToRemove)

  return removedBranches
}
