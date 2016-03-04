'use strict';

import TransformControl from './transform/TransformControl.js';

/**
 * GitHubInspectOrgsTransform - Provides various transform functions to convert the normalized data returned by all
 * GitHubInspectOrgs queries from
 * [typhonjs-github-inspect-orgs](https://www.npmjs.com/package/typhonjs-github-inspect-orgs). The API mirrors
 * `typhonjs-github-inspect-orgs` and requires an instance injected into the constructor of
 * `GitHubInspectOrgsTransform`.
 *
 * By default the following transform types are available: `html`, `json`, `markdown` and `text` and initially set in
 * an options hash with a required `transformType` entry passed into the constructor as the second parameter. All
 * functions transform normalized output data from a `GitHubInspectOrgs` query as a string, but user supplied transforms
 * may output any type of data. Each function forwards on any options supported by `typhonjs-github-inspect-orgs` and
 * may also take optional parameters `description` to provide expanded descriptive output in addition to a
 * `pipeFunction` function entry which is invoked immediately with the resulting transformed data. The transformed
 * results are added to the original data returned by a given query with a new key `transformed` and returned as a
 * Promise.
 *
 * `GitHubInspectOrgsTransform` excels at creating indexes in several popular formats for a many-organization / repo
 * effort such as TyphonJS and beyond.
 */
export default class GitHubInspectOrgsTransform
{
   /**
    * Initializes GitHubInspectOrgsTransform with an instance of GitHubInspectOrgs, transform options, and optional
    * Gulp integration options.
    *
    * @param {object}   githubInspect - An instance of GitHubInspectOrgs.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * required:
    * (string)    transformType - The current transform type.
    *
    * optional:
    * (object)    transforms - A hash with user supplied transforms to add to TransformControl.
    * ```
    */
   constructor(githubInspect, options = {})
   {
      if (typeof githubInspect !== 'object')
      {
         throw new TypeError(`initialize error: 'options.githubInspect' is not an 'object'.`);
      }

      if (typeof options !== 'object') { throw new TypeError(`initialize error: 'options' is not an 'object'.`); }

      if (typeof optionsGulp !== 'object')
      {
         throw new TypeError(`initialize error: 'optionsGulp' is not an 'object'.`);
      }

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
    * Transforms all normalized data from `getCollaborators` based on organization credentials stored in the associated
    * `GitHubInspectOrgs` instance returning the original query data including the transformed results under an added
    * key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with the
    * transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    credential - A GitHub public access token or username:password combination to use for further
    *                          filtering. This credential must be a part of an organization or team for results to be
    *                          returned; default (none / all results).
    * ```
    *
    * @returns {Promise}
    */
   getCollaborators(options = {})
   {
      if (typeof options !== 'object') { throw new TypeError(`getCollaborators error: 'options' is not an 'object'.`); }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getCollaborators error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getContributors` based on organization credentials stored in the associated
    * `GitHubInspectOrgs` instance returning the original query data including the transformed results under an added
    * key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with the
    * transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    credential - A GitHub public access token or username:password combination to use for further
    *                          filtering. This credential must be a part of an organization or team for results to be
    *                          returned; default (none / all results).
    * ```
    *
    * @returns {Promise}
    */
   getContributors(options = {})
   {
      if (typeof options !== 'object') { throw new TypeError(`getContributors error: 'options' is not an 'object'.`); }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getContributors error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getMembers` based on organization credentials stored in the associated
    * `GitHubInspectOrgs` instance returning the original query data including the transformed results under an added
    * key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with the
    * transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    credential - A GitHub public access token or username:password combination to use for further
    *                          filtering. This credential must be a part of an organization or team for results to be
    *                          returned; default (none / all results).
    * ```
    *
    * @returns {Promise}
    */
   getMembers(options = {})
   {
      if (typeof options !== 'object') { throw new TypeError(`getMembers error: 'options' is not an 'object'.`); }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getMembers error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getOrgMembers` based on organization credentials stored in the associated
    * `GitHubInspectOrgs` instance returning the original query data including the transformed results under an added
    * key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with the
    * transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    credential - A GitHub public access token or username:password combination to use for further
    *                          filtering. This credential must be a part of an organization or team for results to be
    *                          returned; default (none / all results).
    * ```
    *
    * @returns {Promise}
    */
   getOrgMembers(options = {})
   {
      if (typeof options !== 'object') { throw new TypeError(`getOrgMembers error: 'options' is not an 'object'.`); }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgMembers error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getOrgRepos` based on organization credentials stored in the associated
    * `GitHubInspectOrgs` instance returning the original query data including the transformed results under an added
    * key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with the
    * transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    credential - A GitHub public access token or username:password combination to use for further
    *                          filtering. This credential must be a part of an organization or team for results to be
    *                          returned; default (none / all results).
    * ```
    *
    * @returns {Promise}
    */
   getOrgRepos(options = {})
   {
      if (typeof options !== 'object') { throw new TypeError(`getOrgRepos error: 'options' is not an 'object'.`); }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgRepos error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getOrgRepoCollaborators` based on organization credentials stored in the
    * associated `GitHubInspectOrgs` instance returning the original query data including the transformed results under
    * an added key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with
    * the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    credential - A GitHub public access token or username:password combination to use for further
    *                          filtering. This credential must be a part of an organization or team for results to be
    *                          returned; default (none / all results).
    * ```
    *
    * @returns {Promise}
    */
   getOrgRepoCollaborators(options = {})
   {
      if (typeof options !== 'object')
      {
         throw new TypeError(`getOrgRepoCollaborators error: 'options' is not an 'object'.`);
      }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgRepoCollaborators error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getOrgRepoContributors` based on organization credentials stored in the
    * associated `GitHubInspectOrgs` instance returning the original query data including the transformed results under
    * an added key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with
    * the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    credential - A GitHub public access token or username:password combination to use for further
    *                          filtering. This credential must be a part of an organization or team for results to be
    *                          returned; default (none / all results).
    * ```
    *
    * @returns {Promise}
    */
   getOrgRepoContributors(options = {})
   {
      if (typeof options !== 'object')
      {
         throw new TypeError(`getOrgRepoContributors error: 'options' is not an 'object'.`);
      }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgRepoContributors error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getOrgRepoStats` based on organization credentials stored in the associated
    * `GitHubInspectOrgs` instance returning the original query data including the transformed results under an added
    * key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with the
    * transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    credential - A GitHub public access token or username:password combination to use for further
    *                          filtering. This credential must be a part of an organization or team for results to be
    *                          returned; default (none / all results).
    *
    * (Array<String>)   categories - Required list of stats categories to query. May include:
    *    'all': A wildcard that includes all categories defined below.
    *    'codeFrequency': Get the number of additions and deletions per week.
    *    'commitActivity': Get the last year of commit activity data.
    *    'contributors': Get contributors list with additions, deletions & commit counts.
    *    'participation': Get the weekly commit count for the repository owner & everyone else.
    *    'punchCard': Get the number of commits per hour in each day.
    *    'stargazers': Get list GitHub users who starred repos.
    *    'watchers': Get list of GitHub users who are watching repos.
    * ```
    *
    * @returns {Promise}
    */
   getOrgRepoStats(options = {})
   {
      if (typeof options !== 'object')
      {
         throw new TypeError(`getOrgRepoStats error: options is not an 'object'.`);
      }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgRepoStats error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getOrgTeams` based on organization credentials stored in the associated
    * `GitHubInspectOrgs` instance returning the original query data including the transformed results under an added
    * key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with the
    * transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    credential - A GitHub public access token or username:password combination to use for further
    *                          filtering. This credential must be a part of an organization or team for results to be
    *                          returned; default (none / all results).
    * ```
    *
    * @returns {Promise}
    */
   getOrgTeams(options = {})
   {
      if (typeof options !== 'object') { throw new TypeError(`getOrgTeams error: 'options' is not an 'object'.`); }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgTeams error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getOrgTeamMembers` based on organization credentials stored in the associated
    * `GitHubInspectOrgs` instance returning the original query data including the transformed results under an added
    * key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with the
    * transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    credential - A GitHub public access token or username:password combination to use for further
    *                          filtering. This credential must be a part of an organization or team for results to be
    *                          returned; default (none / all results).
    * ```
    *
    * @returns {Promise}
    */
   getOrgTeamMembers(options = {})
   {
      if (typeof options !== 'object')
      {
         throw new TypeError(`getOrgTeamMembers error: 'options' is not an 'object'.`);
      }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgTeamMembers error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getOrgs` based on organization credentials stored in the associated
    * `GitHubInspectOrgs` instance returning the original query data including the transformed results under an added
    * key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with the
    * transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    *
    * (string)    credential - A GitHub public access token or username:password combination to use for further
    *                          filtering. This credential must be a part of an organization or team for results to be
    *                          returned; default (none / all results).
    * ```
    *
    * @returns {Promise}
    */
   getOrgs(options = {})
   {
      if (typeof options !== 'object') { throw new TypeError(`getOrgs error: 'options' is not an 'object'.`); }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOrgs error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getOwnerOrgs` based on organization credentials stored in the associated
    * `GitHubInspectOrgs` instance returning the original query data including the transformed results under an added
    * key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with the
    * transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    * ```
    *
    * @returns {Promise}
    */
   getOwnerOrgs(options = {})
   {
      if (typeof options !== 'object') { throw new TypeError(`getOwnerOrgs error: 'options' is not an 'object'.`); }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOwnerOrgs error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getOwnerRateLimits` based on organization credentials stored in the
    * associated `GitHubInspectOrgs` instance returning the original query data including the transformed results under
    * an added key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with
    * the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    * ```
    *
    * @returns {Promise}
    */
   getOwnerRateLimits(options = {})
   {
      if (typeof options !== 'object')
      {
         throw new TypeError(`getOwnerRateLimits error: 'options' is not an 'object'.`);
      }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOwnerRateLimits error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Transforms all normalized data from `getOwners` based on organization credentials stored in the associated
    * `GitHubInspectOrgs` instance returning the original query data including the transformed results under an added
    * key `transformed`. In addition if an optional function, `pipeFunction`, is supplied it is invoked with the
    * transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    * ```
    *
    * @returns {Promise}
    */
   getOwners(options = {})
   {
      if (typeof options !== 'object') { throw new TypeError(`getOwners error: 'options' is not an 'object'.`); }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getOwners error: 'options.pipeFunction' is not a 'function'.`);
      }

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
    * Returns the transform control instance which is useful to change the current transform type via
    * `setTransformType`.
    *
    * @returns {TransformControl}
    */
   getTransformControl()
   {
      return this._transformControl;
   }


   /**
    * Transforms all normalized data from `getUserFromCredential` based on the `credential` entry in the `options` hash
    * returning the original query data including the transformed results under an added key `transformed`. In addition
    * if an optional function, `pipeFunction`, is supplied it is invoked with the transformed results.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (function)  pipeFunction - A function that will be invoked with a single parameter with the transformed result.
    * ```
    *
    * @returns {Promise}
    */
   getUserFromCredential(options = {})
   {
      if (typeof options !== 'object')
      {
         throw new TypeError(`getUserFromCredential error: 'options' is not an 'object'.`);
      }

      options.description = options.description || false;
      options.pipeFunction = options.pipeFunction || undefined;

      if (options.pipeFunction && typeof options.pipeFunction !== 'function')
      {
         throw new TypeError(`getUserFromCredential error: 'options.pipeFunction' is not a 'function'.`);
      }

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