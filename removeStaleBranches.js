#!/usr/bin/env node

const removeStaleness = async () => {
    const { runLocalBranchRemoval } = require('./local-branches/localBranchRemoval');

    await runLocalBranchRemoval();
};

removeStaleness();