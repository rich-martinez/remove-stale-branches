const inquirer = require('inquirer');
const { createStringTrimFilter } = require('../../shared/prompt-functions/createStringTrimFilter');
const { createBranchNameValidator } = require('../../shared/prompt-functions/createBranchNameValidator');
const { createBranchNameSelector } = require('../../shared/prompt-functions/createBranchNameSelector');

/**
 * @param {array} branches
 * @returns {Promise}
 */
exports.remoteNamePrompt = async (branches) => {
    const validate = createBranchNameValidator(branches);
    const source = createBranchNameSelector(branches);
    const filter = createStringTrimFilter();

    return inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'remoteNamePrompt',
            message: 'Please choose the remote that will be used to remove remote branches:',
            suggestOnly: false,
            filter,
            validate,
            source,
        }
    ]).then(answer => answer.remoteNamePrompt);
}