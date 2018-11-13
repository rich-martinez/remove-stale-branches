const inquirer = require('inquirer');
const { createSourceFunction } = require('./createSourceFunction');
const { stalenessRemovalOptions } = require('./stalenessRemovalOptionsContent');

exports.stalenessRemovalOptionsPrompt = async () => {
    const source = createSourceFunction(stalenessRemovalOptions);

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
