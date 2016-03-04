![typhonjs-github-inspect-orgs-transform](http://i.imgur.com/zjygypY.png)

[![NPM](https://img.shields.io/npm/v/typhonjs-github-inspect-orgs-transform.svg?label=npm)](https://www.npmjs.com/package/typhonjs-github-inspect-orgs-transform)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MPLv2-yellowgreen.svg?style=flat)](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/blob/master/LICENSE)
[![Gitter](https://img.shields.io/gitter/room/typhonjs/TyphonJS.svg)](https://gitter.im/typhonjs/TyphonJS)

[![Build Status](https://travis-ci.org/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform.svg?branch=master)](https://travis-ci.org/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform)
[![Coverage](https://img.shields.io/codecov/c/github/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform.svg)](https://codecov.io/github/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform)
[![Dependency Status](https://www.versioneye.com/user/projects/56d5f636d71695003e63077b/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56d5f636d71695003e63077b)

Provides a NPM module that transforms data from typhonjs-github-inspect-orgs to normalized HTML, markdown, JSON or text by piping to console or a provided function. 

GitHubInspectOrgsTransform - Provides various transform functions to convert the normalized data returned by all
GitHubInspectOrgs queries from
[typhonjs-github-inspect-orgs](https://www.npmjs.com/package/typhonjs-github-inspect-orgs). The API mirrors
`typhonjs-github-inspect-orgs` and requires an instance injected into the constructor of
`GitHubInspectOrgsTransform`.

By default the following transform types are available: `html`, `json`, `markdown` and `text` and initially set in
an options hash with a required `transformType` entry passed into the constructor as the second parameter. All
functions transform normalized output data from a `GitHubInspectOrgs` query as a string, but user supplied transforms
may output any type of data. Each function forwards on any options supported by `typhonjs-github-inspect-orgs` and
may also take optional parameters `description` to provide expanded descriptive output in addition to a 
`pipeFunction` function entry which is invoked immediately with the resulting transformed data. The transformed 
results are added to the original data returned by a given query with a new key `transformed` and returned as a 
Promise.

`GitHubInspectOrgsTransform` excels at creating indexes in several popular formats for a many-organization / repo effort such as TyphonJS and beyond. 

More docs soon... 
