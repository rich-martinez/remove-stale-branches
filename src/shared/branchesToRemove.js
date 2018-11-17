const { branchesToRemovePrompt } = require('./prompts/branchesToRemovePrompt')
const { removeSelectedBranchesPrompt } = require('./prompts/removeSelectedBranchesPrompt')
const { keepSelectedBranchesPrompt } = require('./prompts/keepSelectedBranchesPrompt')
const {
  removeAllBranchesExceptMainBranchContent,
  removeSelectedBranchesContent,
  keepSelectedBranchesContent
} = require('./branchRemovalOptionsContent')

/**
 * @description This function is used to get a list of branches that the user wants to remove or keep
 * and does the neccessary filtering to the branchesAvailableForRemoval and returns the result.
 * @param {array} branchesAvailableForRemoval
 * @returns {Promise}
 */
exports.branchesToRemove = async (branchesAvailableForRemoval) => {
  const branchesToRemoveAnswer = await branchesToRemovePrompt(
    branchesAvailableForRemoval,
    [
      removeAllBranchesExceptMainBranchContent,
      removeSelectedBranchesContent,
      keepSelectedBranchesContent
    ]
  )
  let selectedBranchesToRemove = []

  if (branchesToRemoveAnswer === removeAllBranchesExceptMainBranchContent) {
    selectedBranchesToRemove = branchesAvailableForRemoval
  } else if (branchesToRemoveAnswer === removeSelectedBranchesContent) {
    selectedBranchesToRemove = await removeSelectedBranchesPrompt(branchesAvailableForRemoval)
  } else if (branchesToRemoveAnswer === keepSelectedBranchesContent) {
    selectedBranchesToRemove = await keepSelectedBranchesPrompt(branchesAvailableForRemoval)
  } else {
    console.log('Oops! Something went wrong.')
    process.exit(1)
  }

  return selectedBranchesToRemove;
}