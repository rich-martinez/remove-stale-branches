const simpleGit = require('simple-git/promise')();

exports.allBranches = async (branches) => {
    return simpleGit.branchLocal().then(branches => branches.all);
}
