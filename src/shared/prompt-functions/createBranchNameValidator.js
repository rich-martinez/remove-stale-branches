/**
 * @description The function is used to create a callback for validating a user selected branch name
 * exists in the branch names given.
 * The callback intended to be used as a validate function for an inquirer prompt.
 * @param {array} branches
 * @returns {bool}
 */
exports.createBranchNameValidator = (branches) => {
  return async (answer) => {
    if (!branches.includes(answer)) {
        console.log(`\n\n${answer} is not one of the available branches:\n${JSON.stringify(branches, null, 2)}\n\n`);
    }

    return true;
  }
}