'use strict';

import TransformControl from './transform/TransformControl.js';

/**
 * GitHubInspectOrgsTransform - Provides a NPM module that transforms data from GitHubInspectOrgs /
 * [typhonjs-github-inspect-orgs](https://www.npmjs.com/package/typhonjs-github-inspect-orgs) to normalized HTML,
 * markdown, JSON or text by piping to console or a provided function in addition to returning the output of
 * GitHubInspectOrgs in addition to the transformed data via Promises. The API mirrors `typhonjs-github-inspect-orgs`
 * and requires an instance of GitHubInspectOrgs injected into the constructor of `GitHubInspectOrgsTransform`.
 * `GitHubInspectOrgsTransform` excels at creating indexes in several popular formats for a many-organization / repo
 * effort such as TyphonJS and beyond.
 *
 * By default the following transform types are available: `html`, `json`, `markdown` and `text` and initially set in
 * an options hash with an optional `transformType` entry passed into the constructor as the second parameter. All
 * methods transform normalized output data from a `GitHubInspectOrgs` query as a string, but user supplied transforms
 * may output any type of data.
 *
 * To configure GitHubInspectOrgsTransform first create an instance of GitHubInspectOrgs:
 * ```
 * import GitHubInspectOrgs          from 'typhonjs-github-inspect-orgs';
 * import GitHubInspectOrgsTransform from 'typhonjs-github-inspect-orgs-transform';
 *
 * const githubInspect = new GitHubInspectOrgs(
 * {
 *     organizations: [{ credential: <GITHUB PUBLIC TOKEN>, owner: <GITHUB USER NAME OWNING ORGANIZATIONS>,
 *                     regex: '^typhonjs' }],
 * });
 *
 * const inspectTransform = new GitHubInspectOrgsTransform(githubInspect);
 * ```
 *
 * Additional optional parameters to configure GitHubInspectOrgsTransform include:
 * ```
 * (string)    transformType - The current transform type; default ('text').
 *
 * (object)    transforms - A hash with user supplied transforms to add to TransformControl.
 * ```
 *
 * While creating custom transforms is not discussed in detail please review the current implementations in
 * [./src/transform](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/tree/master/src/transform)
 * for guidance.
 *
 * Each method of GitHubInspectOrgsTransform forwards on any options also supported by
 * [typhonjs-github-inspect-orgs](https://www.npmjs.com/package/typhonjs-github-inspect-orgs). In addition
 * GitHubInspectOrgsTransform may also take optional parameters. In particular a `pipeFunction` function entry is
 * invoked immediately with the resulting transformed data. The transformed results are added to the original data
 * returned by a given query with a new key `transformed` and returned as a Promise.
 *
 * Most methods take a hash of optional parameters. The four optional parameters that are supported include:
 * ```
 * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
 * user which limits the responses to the organizations and other query data that this
 * particular user is a member of or has access to currently.
 *
 * (boolean)   description - Add additional description info for all entries where available; default (false).
 *
 * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
 *
 * (string)    transformType - Overrides current TransformControl transform type.
 * ```
 *
 * Please review [./test/fixture](https://github.com/typhonjs-node-scm/typhonjs-github-inspect-orgs-transform/tree/master/test/fixture)
 * for examples of transformed output used in testing. These examples are generated from `typhonjs-test` organizations.
 */
export default class GitHubInspectOrgsTransform
{
   /**
    * Initializes GitHubInspectOrgsTransform with an instance of GitHubInspectOrgs and options.
    *
    * @param {object}   githubInspect - An instance of GitHubInspectOrgs.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    transformType - The current transform type; default ('text').
    *
    * (object)    transforms - A hash with user supplied transforms to add to TransformControl.
    * ```
    */
   constructor(githubInspect, options = {})
   {
      /* istanbul ignore if */
      if (typeof githubInspect !== 'object')
      {
         throw new TypeError(`initialize error: 'options.githubInspect' is not an 'object'.`);
      }

      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError(`initialize error: 'options' is not an 'object'.`); }

      /**
       * The associated GitHubInspectOrgs instance.
       * @type {Object}
       * @private
       */
      this._githubInspect = githubInspect;

      /**
       * The transform control which dispatches to currently selected transform.
       * @type {TransformControl}
       * @private
       */
      this._transformControl = new TransformControl(options);
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getCollaborators` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getCollaborators
    *
    * @returns {Promise}
    */
   getCollaborators(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError(`getCollaborators error: 'options' is not an 'object'.`); }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getCollaborators error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getCollaborators error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getCollaborators(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getContributors` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getContributors
    *
    * @returns {Promise}
    */
   getContributors(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError(`getContributors error: 'options' is not an 'object'.`); }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getContributors error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getContributors error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getContributors(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getMembers` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getMembers
    *
    * @returns {Promise}
    */
   getMembers(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError(`getMembers error: 'options' is not an 'object'.`); }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getMembers error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getMembers error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getMembers(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getOrgMembers` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getOrgMembers
    *
    * @returns {Promise}
    */
   getOrgMembers(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError(`getOrgMembers error: 'options' is not an 'object'.`); }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getOrgMembers error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgMembers error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getOrgMembers(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getOrgRepos` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getOrgRepos
    *
    * @returns {Promise}
    */
   getOrgRepos(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError(`getOrgRepos error: 'options' is not an 'object'.`); }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getOrgRepos error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgRepos error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getOrgRepos(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getOrgRepoCollaborators` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getOrgRepoCollaborators
    *
    * @returns {Promise}
    */
   getOrgRepoCollaborators(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object')
      {
         throw new TypeError(`getOrgRepoCollaborators error: 'options' is not an 'object'.`);
      }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getOrgRepoCollaborators error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgRepoCollaborators error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getOrgRepoCollaborators(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getOrgRepoContributors` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getOrgRepoContributors
    *
    * @returns {Promise}
    */
   getOrgRepoContributors(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object')
      {
         throw new TypeError(`getOrgRepoContributors error: 'options' is not an 'object'.`);
      }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getOrgRepoContributors error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgRepoContributors error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getOrgRepoContributors(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getOrgRepoStats` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getOrgRepoStats
    *
    * @returns {Promise}
    */
   getOrgRepoStats(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object')
      {
         throw new TypeError(`getOrgRepoStats error: options is not an 'object'.`);
      }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getOrgRepoStats error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgRepoStats error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getOrgRepoStats(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getOrgTeams` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getOrgTeams
    *
    * @returns {Promise}
    */
   getOrgTeams(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError(`getOrgTeams error: 'options' is not an 'object'.`); }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getOrgTeams error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgTeams error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getOrgTeams(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getOrgTeamMembers` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getOrgTeamMembers
    *
    * @returns {Promise}
    */
   getOrgTeamMembers(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object')
      {
         throw new TypeError(`getOrgTeamMembers error: 'options' is not an 'object'.`);
      }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getOrgTeamMembers error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgTeamMembers error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getOrgTeamMembers(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getOrgs` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getOrgs
    *
    * @returns {Promise}
    */
   getOrgs(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError(`getOrgs error: 'options' is not an 'object'.`); }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getOrgs error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgs error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getOrgs(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getOwnerOrgs` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getOwnerOrgs
    *
    * @returns {Promise}
    */
   getOwnerOrgs(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError(`getOwnerOrgs error: 'options' is not an 'object'.`); }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getOwnerOrgs error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOwnerOrgs error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getOwnerOrgs().then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getOwnerRateLimits` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getOwnerRateLimits
    *
    * @returns {Promise}
    */
   getOwnerRateLimits(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object')
      {
         throw new TypeError(`getOwnerRateLimits error: 'options' is not an 'object'.`);
      }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getOwnerRateLimits error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOwnerRateLimits error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getOwnerRateLimits().then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getOwners` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getOwners
    *
    * @returns {Promise}
    */
   getOwners(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object') { throw new TypeError(`getOwners error: 'options' is not an 'object'.`); }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getOwners error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOwners error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getOwners().then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }

   /**
    * Returns the TransformControl instance which is useful to change the current transform type via `setTransformType`.
    *
    * @returns {TransformControl}
    */
   getTransformControl()
   {
      return this._transformControl;
   }

   /**
    * Transforms all normalized data from `GitHubInspectOrgs->getUserFromCredential` returning the original query data
    * including the transformed results under an added key `transformed`. In addition if an optional function,
    * `pipeFunction`, is supplied it is invoked immediately with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string)    credential - A public access token with `public_repo` and `read:org` permissions for any GitHub
    *                          user which limits the responses to the organizations and other query data that this
    *                          particular user is a member of or has access to currently.
    *
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    transformType - Overrides current TransformControl transform type.
    * ```
    *
    * @see https://www.npmjs.com/package/typhonjs-github-inspect-orgs#getUserFromCredential
    *
    * @returns {Promise}
    */
   getUserFromCredential(options = {})
   {
      /* istanbul ignore if */
      if (typeof options !== 'object')
      {
         throw new TypeError(`getUserFromCredential error: 'options' is not an 'object'.`);
      }

      /* istanbul ignore if */
      if (options.description && typeof options.description !== 'boolean')
      {
         throw new TypeError(`getUserFromCredential error: 'options.description' is not a 'boolean'.`);
      }

      /* istanbul ignore if */
      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getUserFromCredential error: 'options.pipeFunction' is not a 'function'.`);
      }

      // Set default values if no optional parameters provided.
      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      return this._githubInspect.getUserFromCredential(options).then((data) =>
      {
         const result = this._transformControl.transform(data.normalized, options);

         // If a pipeFunction function is optionally supplied then pipe `result`.
         if (options.pipeFunction) { options.pipeFunction.call(null, result); }

         // Add transformed result under a `transformed` key with the original query data.
         data.transformed = result;

         return data;
      });
   }
}