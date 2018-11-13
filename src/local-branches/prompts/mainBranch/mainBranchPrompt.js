const inquirer = require('inquirer');
const { filter } = require('./filter');
const { createValidateFunction } = require('./createValidateFunction');
const { createSourceFunction } = require('./createSourceFunction');

exports.mainBranchPrompt = async (branches = []) => {
    const validate = createValidateFunction(branches);
    const source = createSourceFunction(branches);

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