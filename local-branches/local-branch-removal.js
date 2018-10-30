const inquirer = require('inquirer');
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const  branchOptionsAnswer = async (branches = []) => {
    if (branches.length > 0) {
        await inquirer
            .prompt([
                {
                    type: 'checkbox',
                    message: 'Select the branches that you want to remove',
                    name: 'branchOptionsPrompt',

                }
            ])
            .then();
    } else {
        console.log("\nNo local branches can be removed because there is only one local branch.\n");
    }
};

exports.runLocalBranchRemoval = async () => {
    const localBranchRemovalAnswer =  await inquirer
        .prompt([
            {
                type: 'input',
                message: 'Do you want to remove local branches?',
                name: 'shouldRemoveLocalBranchesPrompt',
                filter(answer) {
                    return answer.toLowerCase();
                },
                validate(answer) {
                    const exceptableValues = ['n', 'y', 'yes', 'no'];
                    if (answer.length > 1 ||  !exceptableValues.includes(answer) ) {
                        return 'Please choose one of the available options.';
                    }

                    return true;
                },
                default: 'y',
            },
        ])
        .then(answer  => answer.shouldRemoveLocalBranchesPrompt);

    if (localBranchRemovalAnswer === 'y') {
        const simpleGit = require('simple-git/promise')();
        const branches = simpleGit.branchLocal().then(branches => branches.all);
        const defaultBranchName = 'master';

        const mainBranchAnswer = await inquirer.prompt([
            {
                type: 'autocomplete',
                name: 'mainBranchPrompt',
                message: 'Please choose the main branch which will not be removed:',
                suggestOnly: true,
                filter(answer) {
                    return answer.trim();
                },
                async validate(answer) {
                    branches = await branches;
                    console.log(JSON.stringify(answer, null, 2));
                    console.log(JSON.stringify(branches));
                    console.log(' ');
                    if (!branches.includes(answer)) {
                        // console.log(`${answer} is not one of the available branches:\n${JSON.stringify(branches, null, 2)}`);
                    }

                    return true;
                },
                async source(answers, input) {
                    const fuzzy = require('fuzzy');

                    const branchSearch = await new Promise((resolve) => {
                        input = input || '';
                        let fuzzyResult = fuzzy.filter(input, branches);
                        return resolve(fuzzyResult.map(branchName => branchName.original));
                    });

                    return branchSearch;
                },
                default: defaultBranchName,
            }
        ]).then(answer => answer.mainBranchPrompt);

        const branchesAvailableForRemoval = branches.filter(branch => branch !== mainBranchAnswer);
        // showOptions(branchesAvailableForRemoval);

    } else {
        // If 'n' was selected then move on.
        console.log('\nMoving on...\n');
    }
}
