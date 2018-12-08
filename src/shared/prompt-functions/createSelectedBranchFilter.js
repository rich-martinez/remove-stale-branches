/**
* @description The function is used to create a callback for filtering a user input.
* The callback is intended to be used as a filter function for an inquirer prompt.
* @param {array} branchesAvailableForRemoval
* @returns {function}
*/
exports.createSelectedBranchFilter = (branchesAvailableForRemoval) => {
  return (answer) => {
      // filter any branch name that was selected
      return branchesAvailableForRemoval.filter(branch => !answer.includes(branch));
  }
}