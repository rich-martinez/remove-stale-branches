const inquirer = require('inquirer');
const { createStringTrimFilter } = require('../../shared/promptFunctions/createStringTrimFilter');
const { createBranchNameValidator } = require('../../shared/promptFunctions/createBranchNameValidator');
const { createBranchNameSelector } = require('../../shared/promptFunctions/createBranchNameSelector');

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