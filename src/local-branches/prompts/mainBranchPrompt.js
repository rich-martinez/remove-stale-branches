const inquirer = require('inquirer');
const { createStringTrimFilter } = require('../../shared/prompt-functions/createStringTrimFilter');
const { createBranchNameValidator } = require('../../shared/prompt-functions/createBranchNameValidator');
const { createBranchNameSelector } = require('../../shared/prompt-functions/createBranchNameSelector');

/**
 * @param {array} branches
 * @returns {Promise}
 */
exports.mainBranchPrompt = async (branches) => {
    const validate = createBranchNameValidator(branches);
    const source = createBranchNameSelector(branches);
    const filter = createStringTrimFilter();

    return inquirer.prompt([
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