#!/usr/bin/env node

const checkGitExists = require('./shared/check-git-exists').checkGitExists;
const runLocalBranchRemoval = require('./local-branches/local-branch-removal').runLocalBranchRemoval;

// make sure git exists
checkGitExists();

runLocalBranchRemoval();