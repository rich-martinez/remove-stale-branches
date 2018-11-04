#!/usr/bin/env node

const removeStaleness = async () => {
    const runLocalBranchRemoval = require('./local-branches/localBranchRemoval').runLocalBranchRemoval;

    await runLocalBranchRemoval();
};

removeStaleness();