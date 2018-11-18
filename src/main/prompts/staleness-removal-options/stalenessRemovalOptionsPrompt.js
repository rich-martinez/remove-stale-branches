const inquirer = require('inquirer');
const { createBranchNameSelector } = require('../../../shared/prompt-functions/createBranchNameSelector');
const { stalenessRemovalOptions } = require('./stalenessRemovalOptionsContent');

/**
 * @returns {Promise}
 */
exports.stalenessRemovalOptionsPrompt = async () => {
    const source = createBranchNameSelector(stalenessRemovalOptions);

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
