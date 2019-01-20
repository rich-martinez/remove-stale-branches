const simpleGit = require('simple-git/promise')
const { asyncForEach } = require('../../src/shared/asyncForEach')

jest.mock('simple-git/promise');
jest.mock('../../src/shared/asyncForEach');


