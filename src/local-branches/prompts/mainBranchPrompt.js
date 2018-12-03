const { prompt } = require('inquirer');
const { createStringTrimFilter } = require('../../shared/prompt-functions/createStringTrimFilter');
const { createBranchNameValidator } = require('../../shared/prompt-functions/createBranchNameValidator');
const { createUserOptionSelector } = require('../../shared/prompt-functions/createUserOptionSelector');

/**
 * @param {array} branches
 * @returns {Promise}
 */
exports.mainBranchPrompt = async (branches) => {
    const validate = createBranchNameValidator(branches);
    const source = createUserOptionSelector(branches);
    const filter = createStringTrimFilter();

    return prompt([
        {
            type: 'autocomplete',
            name: 'mainBranchPrompt',
            message: 'Please choose the main branch which will not be removed:',
            suggestOnly: false,
            filter,
            validate,
            source,
        }
    ]).then(answer => answer.mainBranchPrompt);
}