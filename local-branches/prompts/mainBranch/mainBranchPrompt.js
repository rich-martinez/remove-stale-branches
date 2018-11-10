const inquirer = require('inquirer');
const { filter } = require('./filter');
const { createValidateMethod } = require('./createValidateMethod');
const { fuzzyUserOptionSearch } = require('../../../shared/fuzzyUserOptionSearch');

exports.mainBranchPrompt = async (branches = []) => {
    const validate = createValidateMethod(branches);

    return inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'mainBranchPrompt',
            message: 'Please choose the main branch which will not be removed:',
            suggestOnly: false,
            filter,
            validate,
            async source(answers, input) {
                const branchSearch = await fuzzyUserOptionSearch(input, branches);

                return branchSearch;
            },
        }
    ]).then(answer => answer.mainBranchPrompt);
}