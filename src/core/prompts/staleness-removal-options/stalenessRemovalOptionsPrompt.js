const { prompt } = require('inquirer');
const { createUserOptionSelector } = require('../../../shared/prompt-functions/createUserOptionSelector');
const { stalenessRemovalOptions } = require('./stalenessRemovalOptionsContent');

/**
 * @returns {Promise}
 */
exports.stalenessRemovalOptionsPrompt = async () => {
    const source = createUserOptionSelector(stalenessRemovalOptions);

    return prompt([
        {
            type: 'autocomplete',
            name: 'stalenessRemovalOptionsPrompt',
            message: 'Please choose a removal option:',
            suggestOnly: false,
            source,
        }
    ]).then(answer => answer.stalenessRemovalOptionsPrompt);
}
