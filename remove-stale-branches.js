#!/usr/bin/env node

const checkGitExists = require('./check-git-exists').checkGitExists;
const runLocalBranchRemoval = require('./local-branch-removal').runLocalBranchRemoval;

runLocalBranchRemoval();
