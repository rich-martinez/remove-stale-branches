/**
 * @param {array} branchesAvailableForRemoval
 * @returns {string}
 */
exports.branchRemovalOptionsContent = (branchesAvailableForRemoval = []) => {
    const content = `\
    \nA list of the branches available for removal:\
    \n${JSON.stringify(branchesAvailableForRemoval, null, 2)}\n\
    \nPlease choose an option to remove branches.\n\
    `;

    return content;
};