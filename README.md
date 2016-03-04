![typhonjs-github-inspect-orgs-transform](http://i.imgur.com/zjygypY.png)

[![NPM](https://img.shields.io/npm/v/typhonjs-github-inspect-orgs-transform.svg?label=npm)](https://www.npmjs.com/package/typhonjs-github-inspect-orgs-transform)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/typhonjs/TyphonJS.svg)](https://gitter.im/typhonjs/TyphonJS)

[![Build Status](https://travis-ci.org/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform.svg?branch=master)](https://travis-ci.org/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform)
[![Coverage](https://img.shields.io/codecov/c/github/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform.svg)](https://codecov.io/github/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform)
[![Dependency Status](https://www.versioneye.com/user/projects/56d5f636d71695003e63077b/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56d5f636d71695003e63077b)

Provides a NPM module that transforms data from GitHubInspectOrgs /  [typhonjs-github-inspect-orgs](https://www.npmjs.com/package/typhonjs-github-inspect-orgs) to normalized HTML, markdown, JSON or text by piping to console or a provided function in addition to returning the output of GitHubInspectOrgs in addition to the transformed data via Promises. The API mirrors `typhonjs-github-inspect-orgs` and requires an instance of GitHubInspectOrgs injected into the constructor of `GitHubInspectOrgsTransform`. `GitHubInspectOrgsTransform` excels at creating indexes in several popular formats for a many-organization / repo effort such as TyphonJS and beyond. 

By default the following transform types are available: `html`, `json`, `markdown` and `text` and initially set in
an options hash with an optional `transformType` entry passed into the constructor as the second parameter. All
methods transform normalized output data from a `GitHubInspectOrgs` query as a string, but user supplied transforms
may output any type of data. 

To configure GitHubInspectOrgsTransform first create an instance of GitHubInspectOrgs:
```
import GitHubInspectOrgs          from 'typhonjs-github-inspect-orgs';
import GitHubInspectOrgsTransform from 'typhonjs-github-inspect-orgs-transform';

const githubInspect = new GitHubInspectOrgs(
{
    organizations: [{ credential: <GITHUB PUBLIC TOKEN>, owner: <GITHUB USER NAME OWNING ORGANIZATIONS>,
                    regex: '^typhonjs' }],
});

const inspectTransform = new GitHubInspectOrgsTransform(githubInspect);
```

Additional optional parameters to configure GitHubInspectOrgsTransform include:
```
(string)    transformType - The current transform type; default ('text').

(object)    transforms - A hash with user supplied transforms to add to TransformControl.
```

While creating custom transforms is not discussed in detail please review the current implementations in [./src/transform](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/tree/master/src/transform) for guidance.

Each method of GitHubInspectOrgsTransform forwards on any options also supported by [typhonjs-github-inspect-orgs](https://www.npmjs.com/package/typhonjs-github-inspect-orgs). In addition GitHubInspectOrgsTransform may also take optional parameters. In particular a `pipeFunction` function entry is invoked immediately with the resulting transformed data. The transformed results are added to the original data returned by a given query with a new key `transformed` and returned as a Promise.

Most methods take a hash of optional parameters. The four optional parameters that are supported include:
```
(string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
                         user which limits the responses to the organizations and other query data that this
                         particular user is a member of or has access to currently.

(boolean)   description - Add additional description info for all entries where available; default (false).

(function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.

(string)    transformType - Overrides current TransformControl transform type.
```

Please review [./test/fixture](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/tree/master/test/fixture) for examples of transformed output used in testing. These examples are generated from `typhonjs-test` organizations. 

-----------------------

GitHubInspectOrgsTransform method summary:

- [getCollaborators](#getCollaborators) - Returns all collaborators across all organizations.
- [getContributors](#getContributors) - Returns all contributors across all organizations.
- [getMembers](#getMembers) - Returns all organization members across all organizations.
- [getOrgMembers](#getOrgMembers) - Returns all members by organization across all organizations.
- [getOrgRepos](#getOrgRepos) - Returns all repos by organization across all organizations.
- [getOrgRepoCollaborators](#getOrgRepoCollaborators) - Returns all collaborators by repo by organization across all organizations.
- [getOrgRepoContributors](#getOrgRepoContributors) - Returns all contributors by repo by organization across all organizations.
- [getOrgRepoStats](#getOrgRepoStats) - Returns GitHub statistics by repo by organization across all organizations.
- [getOrgs](#getOrgs) - Returns all organizations.
- [getOrgTeams](#getOrgTeams) - Returns all teams by organization across all organizations.
- [getOwnerOrgs](#getOwnerOrgs) - Returns all organizations by organization owner.
- [getOwnerRateLimits](#getOwnerRateLimits) - Returns the current rate limits for all organization owners.
- [getOwners](#getOwners) - Returns all organization owners.
- [getUserFromCredential](#getUserFromCredential) - Returns the GitHub user who owns the provided credential.

-----------

