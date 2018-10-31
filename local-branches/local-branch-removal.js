const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

exports.runLocalBranchRemoval = async () => {
    const shouldRemoveLocalBranches =  await inquirer
        .prompt([
            {
                type: 'confirm',
                message: 'Do you want to remove local branches?',
                name: 'shouldRemoveLocalBranchesPrompt',
            },
        ])
        .then(answer  => answer.shouldRemoveLocalBranchesPrompt);

    if (shouldRemoveLocalBranches) {
        const simpleGit = require('simple-git/promise')();
        let branches = simpleGit.branchLocal().then(branches => branches.all);

        const mainBranchAnswer = await inquirer.prompt([
            {
                type: 'autocomplete',
                name: 'mainBranchPrompt',
                message: 'Please choose the main branch which will not be removed:',
                suggestOnly: false,
                filter(answer) {
                    return answer.trim();
                },
                async validate(answer) {
                    branches = await branches;
                    if (!branches.includes(answer)) {
                        console.log(`\n\n${answer} is not one of the available branches:\n${JSON.stringify(branches, null, 2)}\n\n`);
                    }

                    return true;
                },
                async source(answers, input) {
                    branches = await branches;

                    const branchSearch = await new Promise((resolve) => {
                        input = input || '';
                        let fuzzyResult = fuzzy.filter(input, branches);
                        return resolve(fuzzyResult.map(branchName => branchName.original));
                    });

                    return branchSearch;
                },
            }
        ]).then(answer => answer.mainBranchPrompt);

        /**
         * @param {array} branchesAvailableForRemoval
         * @returns {string}
         */
        const branchRemovalOptionsContent = (branchesAvailableForRemoval = []) => {
            const content = `\
            \nA list of the branches available for removal:\
            \n${JSON.stringify(branchesAvailableForRemoval, null, 2)}\n\
            \nPlease choose an option to remove branches.\n\
            `;

            return content;
        };
        const branchesAvailableForRemoval = branches.filter(branch => branch !== mainBranchAnswer);

        // Can this be an array full of objects with a common key and a specific identifier
        // e.g. {title: 'remove etc. etc.', name: 'removeAllBranches'}
        // This will make it easier to do a comparision to handle these with conditionall logic
        // Alternatively we could create a constant for each of these strings.
        const branchRemovalOptions = [
            'Remove all branches except the main branch.',
            'Select branch(es) to be removed.',
            'Select branch(es) to keep, and remove all other branches.',
        ];

        const branchesToRemoveAnswer = await inquirer.prompt([
            {
                type: 'autocomplete',
                name: 'branchesToRemovePrompt',
                message: branchRemovalOptionsContent(branchesAvailableForRemoval),
                suggestOnly: false,
                async source(answers, input) {
                    const branchRemovalOptionSearch = await new Promise((resolve) => {
                        input = input || '';
                        // TODO: Can I filter with an array full of objects?
                        let fuzzyResult = fuzzy.filter(input, branchRemovalOptions);
                        return resolve(fuzzyResult.map(removalOption => removalOption.original));
                    });

                    return branchRemovalOptionSearch;
                },
            }
        ]);

        // showOptions(branchesAvailableForRemoval);

    } else {
        // If 'n' was selected then move on.
        console.log('\nMoving on...\n');
    }
}
