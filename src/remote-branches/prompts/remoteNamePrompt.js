const inquirer = require('inquirer');
const { createStringTrimFilter } = require('../../shared/prompt-functions/createStringTrimFilter');
const { createBranchNameValidator } = require('../../shared/prompt-functions/createBranchNameValidator');
const { createUserOptionSelector } = require('../../shared/prompt-functions/createUserOptionSelector');

/**
 * @param {array} branches
 * @returns {Promise}
 */
exports.remoteNamePrompt = async (branches) => {
    const validate = createBranchNameValidator(branches);
    const source = createUserOptionSelector(branches);
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