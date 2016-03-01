/**
 * Please see `typhonjs-core-gulptasks` (https://www.npmjs.com/package/typhonjs-core-gulptasks)
 */

import fs                           from 'fs';
import gulp                         from 'gulp';
import gulpTasks                    from 'typhonjs-core-gulptasks';

import GitHubInspectOrgs            from 'typhonjs-github-inspect-orgs';
import GitHubInspectOrgsTransform   from './src/GitHubInspectOrgsTransform.js';

// Import all tasks and set `rootPath` to the base project path and `srcGlob` to all JS sources in `./src`.
gulpTasks(gulp,
{
   rootPath: __dirname,
   importTasks: ['esdoc', 'eslint', 'npm'],
   srcGlob: ['./src/**/*.js', './test/src/**/*.js']
});

// Loads owner / user public access tokens from environment variables or from `./token.owner` and `./token.user` in
// the root directory.
//
// For Travis CI this is the testing account public access token of typhonjs-test GitHub account. The associated
// organizations are:
// https://github.com/test-org-typhonjs
// https://github.com/test-org-typhonjs2
let ownerCredential = process.env.GITHUB_OWNER_TOKEN;
let userCredential = process.env.GITHUB_USER_TOKEN;

// If user ownerCredential is still undefined attempt to load from a local file `./owner.token`.
if (typeof ownerCredential === 'undefined')
{
   try { ownerCredential = fs.readFileSync('./token.owner', 'utf-8'); }
   catch(err) { /* ... */ }
}

// If user userCredential is still undefined attempt to load from a local file `./user.token`.
if (typeof userCredential === 'undefined')
{
   try { userCredential = fs.readFileSync('./token.user', 'utf-8'); }
   catch(err) { /* ... */ }
}

// Fail now if we don't have an owner token.
if (typeof ownerCredential !== 'string')
{
   throw new TypeError('No owner credentials found in `process.env.GITHUB_OWNER_TOKEN` or `./token.owner`.');
}

// Fail now if we don't have an user token.
if (typeof userCredential !== 'string')
{
   throw new TypeError('No user credentials found in `process.env.GITHUB_USER_TOKEN` or `./token.user`.');
}

// Create instance of GitHubInspectOrgs.
const githubInspect = new GitHubInspectOrgs(
{
   organizations: [{ credential: ownerCredential, owner: 'typhonjs-test', regex: '^test' }]
});

// Create an instance of GitHubInspectOrgsTransform with the Gulp instance such that various Gulp tasks are added.
new GitHubInspectOrgsTransform(githubInspect, { transformType: 'text' },
{
   gulp,
   credential: userCredential,
   description: true,
   statCategories: ['all']
});