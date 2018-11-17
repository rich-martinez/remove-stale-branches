const removeAllAvailableBranchesContent = 'Remove all branches that are available for removal.'
const removeSelectedBranchesContent = 'Select branch(es) to be removed.'
const keepSelectedBranchesContent = 'Select branch(es) to keep, and remove all other branches.'

exports.removeAllAvailableBranchesContent = removeAllAvailableBranchesContent
exports.removeSelectedBranchesContent = removeSelectedBranchesContent
exports.keepSelectedBranchesContent = keepSelectedBranchesContent

/**
 * @param {array} branchesAvailableForRemoval
 * @returns {string}
 */
exports.branchRemovalOptionsContent = (branchesAvailableForRemoval) => {
  const content = `\
    \nA list of the branches available for removal:\
    \n${JSON.stringify(branchesAvailableForRemoval, null, 2)}\n\
    \nPlease choose an option to remove branches.\n\
    `

  return content
}
