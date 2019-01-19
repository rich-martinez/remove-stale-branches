const { prompt } = require('inquirer');
const { createStringTrimFilter } = require('../../shared/prompt-functions/createStringTrimFilter');
const { createBranchNameValidator } = require('../../shared/prompt-functions/createBranchNameValidator');
const { createUserOptionSelector } = require('../../shared/prompt-functions/createUserOptionSelector');

/**
 * @description Prompt the user to choose an available remote to be used to remove remote branches.
 * @param {array} remotes
 * @returns {Promise}
 */
exports.remoteNamePrompt = async (remotes) => {
    const validate = createBranchNameValidator(remotes);
    const source = createUserOptionSelector(remotes);
    const filter = createStringTrimFilter();

    return prompt([
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