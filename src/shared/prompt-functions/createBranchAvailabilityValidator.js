/**
* @description The function is used to create a callback for validating a user input.
* The callback is intended to be used as a validate function for an inquirer prompt.
* @param {array} branchesAvailableForRemoval
* @returns {function}
*/
exports.createBranchAvailabilityValidator = (branchesAvailableForRemoval) => {
  return (answer) => {
    if (answer.length === 0) {
        return `\n\nPlease leave at least one branch to remove.\n\n`;
    }

    if (!answer.some(branch => branchesAvailableForRemoval.includes(branch))) {
        return `\n\n${branch} is not one of the available branches:\n${JSON.stringify(branchesAvailableForRemoval, null, 2)}\n\n`;
    }

    return true;
  }
}