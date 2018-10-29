const inquirer = require('inquirer');

exports.runLocalBranchRemoval = () => {
    return inquirer
        .prompt([
            {
            type: 'input',
            message: 'Do you want to remove local branches? (Y/n)',
            name: 'shouldRemoveLocalBranches',
            validate(answer) {
                const exceptableValues = ['n', 'y'];
                if (answer.length > 1 ||  !exceptableValues.includes(answer.toLowerCase()) ) {
                    return 'Please choose one of the available options.';
                }

                return true;
            },
            filter(answer) {

                return answer.toLowerCase();
            },
            default: 'y',
            }
        ])
        .then(answers => {
            console.log(JSON.stringify(answers, null, '  '));
        });
}
