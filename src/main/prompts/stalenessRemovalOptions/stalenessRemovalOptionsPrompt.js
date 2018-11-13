const inquirer = require('inquirer');
const { filter } = require('./filter');
const { createValidateFunction } = require('./createValidateFunction');
const { createSourceFunction } = require('./createSourceFunction');

exports.stalenessRemovalOptionsPrompt = async () => {
    return inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'stalenessRemovalOptionsPrompt',
            message: 'Please choose a removal option:',
            suggestOnly: false,
            source,
        }
    ]).then(answer => answer.stalenessRemovalOptionsPrompt);
}
