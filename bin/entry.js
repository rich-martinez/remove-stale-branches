#!/usr/bin/env node

/**
 * This is the entry point for removing stale remote/local branches.
 */
const { removeStaleBranches } = require('../src/core/removeStaleBranches')

removeStaleBranches()