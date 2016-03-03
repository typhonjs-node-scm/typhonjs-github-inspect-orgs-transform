'use strict';

/**
 * Provides a function to create Gulp tasks for GitHubInspectOrgsTransform.
 *
 * @param {GitHubInspectOrgsTransform} inspectTransform - An instance of GitHubInspectOrgsTransform.
 *
 * @param {object}                     options - Optional parameters:
 * ```
 * required:
 * (Gulp)      gulp - An instance of Gulp.
 *
 * optional:
 * (string)    credential - A GitHub public access token that defines additional user specific Gulp tasks.
 *
 * (boolean)   description - Add additional description info for all entries where available; default (false).
 *
 * (function)  pipeFunction - A function invoked with the results of the transformed data from a `GitHubInspectOrgs`
 *                            query; default(`console.log`).
 *
 * (boolean)   skipNonCredentialTasks - If true then skip all tasks that don't require credentials.
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
 */
export default function(inspectTransform, options)
{
   const gulp = options.gulp;
   const credential = options.credential;

   if (typeof gulp !== 'object' && typeof gulp.task !== 'function')
   {
      throw new TypeError(`gulptasks error: 'options.gulp' does not conform to the Gulp API.`);
   }

   if (typeof credential !== 'undefined' && typeof credential !== 'string')
   {
      throw new TypeError(`gulptasks error: 'options.credential' is not a 'string'.`);
   }

   const pipeFunction = typeof options.pipeFunction === 'function' ? options.pipeFunction : console.log;

   const description = typeof options.description === 'boolean' ? options.description : false;

   const categories = Array.isArray(options.statCategories) ? options.statCategories : ['stargazers', 'watchers'];

   // Potentially skip non-credentialed tasks.
   const skipNonCredentialTasks = typeof options.skipNonCredentialTasks === 'boolean' ? options.skipNonCredentialTasks :
    false;

   if (!skipNonCredentialTasks)
   {
      /**
       * Transforms normalized `getCollaborators`.
       */
      gulp.task('github-get-collaborators-all', () =>
      {
         return inspectTransform.getCollaborators({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getContributors`.
       */
      gulp.task('github-get-contributors-all', () =>
      {
         return inspectTransform.getContributors({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getMembers`.
       */
      gulp.task('github-get-members-all', () =>
      {
         return inspectTransform.getMembers({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgMembers`.
       */
      gulp.task('github-get-org-members-all', () =>
      {
         return inspectTransform.getOrgMembers({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgRepoCollaborators`.
       */
      gulp.task('github-get-org-repo-collaborators-all', () =>
      {
         return inspectTransform.getOrgRepoCollaborators({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgRepoContributors`.
       */
      gulp.task('github-get-org-repo-contributors-all', () =>
      {
         return inspectTransform.getOrgRepoContributors({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgRepoStats`.
       */
      gulp.task('github-get-org-repo-stats-all', () =>
      {
         return inspectTransform.getOrgRepoStats({ categories, description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgRepos`.
       */
      gulp.task('github-get-org-repos-all', () =>
      {
         return inspectTransform.getOrgRepos({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgTeams`.
       */
      gulp.task('github-get-org-teams-all', () =>
      {
         return inspectTransform.getOrgTeams({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgTeamMembers`.
       */
      gulp.task('github-get-org-team-members-all', () =>
      {
         return inspectTransform.getOrgTeamMembers({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgs`.
       */
      gulp.task('github-get-orgs-all', () =>
      {
         return inspectTransform.getOrgs({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getOwnerOrgs`.
       */
      gulp.task('github-get-owner-orgs', () =>
      {
         return inspectTransform.getOwnerOrgs({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getOwners`.
       */
      gulp.task('github-get-owners', () =>
      {
         return inspectTransform.getOwners({ description, pipeFunction });
      });

      /**
       * Transforms normalized `getOwnerRateLimits`.
       */
      gulp.task('github-get-owners-rate-limit', () =>
      {
         return inspectTransform.getOwnerRateLimits({ description, pipeFunction });
      });
   }

   // If no credential string is supplied then skip credentialed Gulp tasks.
   if (typeof credential === 'string')
   {
      /**
       * Transforms normalized `getCollaborators` with user credentials.
       */
      gulp.task('github-get-collaborators-user', () =>
      {
         return inspectTransform.getCollaborators({ credential, description, pipeFunction });
      });

      /**
       * Transforms normalized `getContributors` with user credentials.
       */
      gulp.task('github-get-contributors-user', () =>
      {
         return inspectTransform.getContributors({ credential, description, pipeFunction });
      });

      /**
       * Transforms normalized `getMembers` with user credentials.
       */
      gulp.task('github-get-members-user', () =>
      {
         return inspectTransform.getMembers({ credential, description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgMembers` with user credentials.
       */
      gulp.task('github-get-org-members-user', () =>
      {
         return inspectTransform.getOrgMembers({ credential, description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgRepoCollaborators` with user credentials.
       */
      gulp.task('github-get-org-repo-collaborators-user', () =>
      {
         return inspectTransform.getOrgRepoCollaborators({ credential, description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgRepoContributors` with user credentials.
       */
      gulp.task('github-get-org-repo-contributors-user', () =>
      {
         return inspectTransform.getOrgRepoContributors({ credential, description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgRepoStats` with user credentials.
       */
      gulp.task('github-get-org-repo-stats-user', () =>
      {
         return inspectTransform.getOrgRepoStats({ credential, categories, description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgRepos` with user credentials.
       */
      gulp.task('github-get-org-repos-user', () =>
      {
         return inspectTransform.getOrgRepos({ credential, description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgTeams` with user credentials.
       */
      gulp.task('github-get-org-teams-user', () =>
      {
         return inspectTransform.getOrgTeams({ credential, description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgTeamMembers` with user credentials.
       */
      gulp.task('github-get-org-team-members-user', () =>
      {
         return inspectTransform.getOrgTeamMembers({ credential, description, pipeFunction });
      });

      /**
       * Transforms normalized `getOrgs` with user credentials.
       */
      gulp.task('github-get-orgs-user', () =>
      {
         return inspectTransform.getOrgs({ credential, description, pipeFunction });
      });

      /**
       * Transforms normalized `getUserFromCredential` with user credentials.
       */
      gulp.task('github-get-user-from-credential', () =>
      {
         return inspectTransform.getUserFromCredential({ credential, description, pipeFunction });
      });
   }
}