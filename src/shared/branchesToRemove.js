const { branchRemovalStrategyPrompt } = require('./prompts/branchRemovalStrategyPrompt')
const { removeSelectedBranchesPrompt } = require('./prompts/removeSelectedBranchesPrompt')
const { keepSelectedBranchesPrompt } = require('./prompts/keepSelectedBranchesPrompt')
const {
  removeAllAvailableBranchesContent,
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
  const branchesToRemoveAnswer = await branchRemovalStrategyPrompt(
    branchesAvailableForRemoval,
    [
      removeAllAvailableBranchesContent,
      removeSelectedBranchesContent,
      keepSelectedBranchesContent
    ]
  )
  let selectedBranchesToRemove = []

  if (branchesToRemoveAnswer === removeAllAvailableBranchesContent) {
    selectedBranchesToRemove = branchesAvailableForRemoval
  } else if (branchesToRemoveAnswer === removeSelectedBranchesContent) {
    selectedBranchesToRemove = await removeSelectedBranchesPrompt(branchesAvailableForRemoval)
  } else if (branchesToRemoveAnswer === keepSelectedBranchesContent) {
    selectedBranchesToRemove = await keepSelectedBranchesPrompt(branchesAvailableForRemoval)
  } else {
    console.log('No branches will be removed')
  }

  return selectedBranchesToRemove
}
