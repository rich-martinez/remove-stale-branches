const fuzzy = require('fuzzy');
const inquirer = require('inquirer');

exports.mainBranchPrompt = async (branches = []) => {
    return inquirer.prompt([
        {
            type: 'autocomplete',
            name: 'mainBranchPrompt',
            message: 'Please choose the main branch which will not be removed:',
            suggestOnly: false,
            filter(answer) {
                return answer.trim();
            },
            async validate(answer) {
                if (!branches.includes(answer)) {
                    console.log(`\n\n${answer} is not one of the available branches:\n${JSON.stringify(branches, null, 2)}\n\n`);
                }

                return true;
            },
            async source(answers, input) {
                const branchSearch = await new Promise((resolve) => {
                    input = input || '';
                    let fuzzyResult = fuzzy.filter(input, branches);
                    return resolve(fuzzyResult.map(branchName => branchName.original));
                });

                return branchSearch;
            },
        }
    ]).then(answer => answer.mainBranchPrompt);
}