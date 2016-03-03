'use strict';

import { assert }                   from 'chai';
import fs                           from 'fs';

import GitHubInspectOrgs            from 'typhonjs-github-inspect-orgs';
import GitHubInspectOrgsTransform   from '../../src/GitHubInspectOrgsTransform.js';
import TransformControl             from '../../src/transform/TransformControl.js';

/**
 * This series of tests confirm that GitHubInspectOrgsTransform properly queries the organizations and data associated
 * with `typhonjs-test`.
 *
 * The normalized data results are stripped of variable data and compared against all permutations stored in
 * `./test/fixture`.
 *
 * Please note that the module private variables:
 * `s_TEST_DATA` - Always true enabling verification against stored `./test/fixture` data.
 *
 * `s_WRITE_DATA` - Most always false; unless specifically generating `./test/fixture` data.
 *
 * `s_FILE_DATA` - defines the 8 major permutations; 4 for each transform with and without description data generated.
 *
 * Note that the repo / statistics queries are skipped as the generated data is to complex to analyze. Also since
 * none of the transforms output repo file requests these are not tested.
 *
 * @test {onHandleCode}
 */
describe('GitHubInspectOrgsTransform', () =>
{
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

   // Create an instance of GitHubInspectOrgsTransform. Include Gulp for test coverage even though it is not tested
   // directly.
   const inspectTransform = new GitHubInspectOrgsTransform(githubInspect, { transformType: 'text' });

   // For expedient testing TransformControl is invoked directly for all supported transforms after the initial query.
   const transformControl = new TransformControl({ transformType: 'html' });

   /**
    * Test `getCollaborators` without user credentials.
    */
   it('getCollaborators (all)', () =>
   {
      return inspectTransform.getCollaborators().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Unless generating test data the body of s_DATA_WRITE is commented out.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-collaborators-all');

         // Usually data is being tested, so this path is active unless generating data.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-collaborators-all');
      });
   });

   /**
    * Test `getCollaborators` with user credentials.
    */
   it('getCollaborators (user)', () =>
   {
      return inspectTransform.getCollaborators({ credential: userCredential }).then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-collaborators-user');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-collaborators-user');
      });
   });

   /**
    * Test `getContributors` without user credentials.
    */
   it('getContributors (all)', () =>
   {
      return inspectTransform.getContributors().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-contributors-all');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-contributors-all');
      });
   });

   /**
    * Test `getContributors` with user credentials.
    */
   it('getContributors (user)', () =>
   {
      return inspectTransform.getContributors({ credential: userCredential }).then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-contributors-user');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-contributors-user');
      });
   });

   /**
    * Test `getMembers` without user credentials.
    */
   it('getMembers (all)', () =>
   {
      return inspectTransform.getMembers().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-members-all');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-members-all');
      });
   });

   /**
    * Test `getMembers` with user credentials.
    */
   it('getMembers (user)', () =>
   {
      return inspectTransform.getMembers({ credential: userCredential }).then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-members-user');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-members-user');
      });
   });

   /**
    * Test `getOrgMembers` without user credentials.
    */
   it('getOrgMembers (all)', () =>
   {
      return inspectTransform.getOrgMembers().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-members-all');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-members-all');
      });
   });

   /**
    * Test `getOrgMembers` with user credentials.
    */
   it('getOrgMembers (user)', () =>
   {
      return inspectTransform.getOrgMembers({ credential: userCredential }).then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-members-user');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-members-user');
      });
   });

   /**
    * Test `getOrgRepoCollaborators` without user credentials.
    */
   it('getOrgRepoCollaborators (all)', () =>
   {
      return inspectTransform.getOrgRepoCollaborators().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-repo-collaborators-all');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-repo-collaborators-all');
      });
   });

   /**
    * Test `getOrgRepoCollaborators` with user credentials.
    */
   it('getOrgRepoCollaborators (user)', () =>
   {
      return inspectTransform.getOrgRepoCollaborators({ credential: userCredential }).then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-repo-collaborators-user');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-repo-collaborators-user');
      });
   });

   /**
    * Test `getOrgRepoContributors` without user credentials.
    */
   it('getOrgRepoContributors (all)', () =>
   {
      return inspectTransform.getOrgRepoContributors().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-repo-contributors-all');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-repo-contributors-all');
      });
   });

   /**
    * Test `getOrgRepoContributors` with user credentials.
    */
   it('getOrgRepoContributors (user)', () =>
   {
      return inspectTransform.getOrgRepoContributors({ credential: userCredential }).then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-repo-contributors-user');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-repo-contributors-user');
      });
   });

   /**
    * Test `getOrgRepos` without user credentials.
    */
   it('getOrgRepos (all)', () =>
   {
      return inspectTransform.getOrgRepos().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-repos-all');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-repos-all');
      });
   });

   /**
    * Test `getOrgRepos` with user credentials.
    */
   it('getOrgRepos (user)', () =>
   {
      return inspectTransform.getOrgRepos({ credential: userCredential }).then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-repos-user');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-repos-user');
      });
   });

   /**
    * Test `getOrgTeamMembers` without user credentials.
    */
   it('getOrgTeamMembers (all)', () =>
   {
      return inspectTransform.getOrgTeamMembers().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-team-members-all');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-team-members-all');
      });
   });

   /**
    * Test `getOrgTeamMembers` with user credentials.
    */
   it('getOrgTeamMembers (user)', () =>
   {
      return inspectTransform.getOrgTeamMembers({ credential: userCredential }).then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-team-members-user');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-team-members-user');
      });
   });

   /**
    * Test `getOrgTeams` without user credentials.
    */
   it('getOrgTeams (all)', () =>
   {
      return inspectTransform.getOrgTeams().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-teams-all');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-teams-all');
      });
   });

   /**
    * Test `getOrgTeams` with user credentials.
    */
   it('getOrgTeams (user)', () =>
   {
      return inspectTransform.getOrgTeams({ credential: userCredential }).then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-org-teams-user');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-org-teams-user');
      });
   });

   /**
    * Test `getOrgs` without user credentials.
    */
   it('getOrgs (all)', () =>
   {
      return inspectTransform.getOrgs().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-orgs-all');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-orgs-all');
      });
   });

   /**
    * Test `getOrgs` with user credentials.
    */
   it('getOrgs (user)', () =>
   {
      return inspectTransform.getOrgs({ credential: userCredential }).then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-orgs-user');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-orgs-user');
      });
   });

   /**
    * Test `getOwnerOrgs`.
    */
   it('getOwnerOrgs', () =>
   {
      return inspectTransform.getOwnerOrgs().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-owner-orgs');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-owner-orgs');
      });
   });

   /**
    * Test `getOwners`.
    */
   it('getOwners', () =>
   {
      return inspectTransform.getOwners().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-owners');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-owners');
      });
   });

   /**
    * Test `getOwnerRateLimits`.
    */
   it('getOwnerRateLimits', () =>
   {
      return inspectTransform.getOwnerRateLimits().then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-owners-rate-limit');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-owners-rate-limit');
      });
   });

   /**
    * Test `getUserFromCredential`.
    */
   it('getUserFromCredential', () =>
   {
      return inspectTransform.getUserFromCredential({ credential: userCredential }).then((data) =>
      {
         assert(typeof data === 'object');
         assert(typeof data.normalized === 'object');
         assert(typeof data.raw === 'object');
         assert(typeof data.transformed === 'string');

         // Delete any variable data.
         s_STRIP_VARIABLE_DATA(data.normalized);

         // Only enabled when generating test data.
         s_DATA_WRITE(data.normalized, transformControl, 'github-get-user-from-credential');

         // Usually data is being tested.
         s_DATA_TEST(data.normalized, transformControl, 'github-get-user-from-credential');
      });
   });
});

// Module private ---------------------------------------------------------------------------------------------------

/**
 * Always true; enabling testing of data in `./test/fixture`.
 * @type {boolean}
 */
const s_TEST_DATA = true;

/**
 * Usually false; generates test data written to `./test/fixture`.
 * @type {boolean}
 */
const s_WRITE_DATA = false;

/**
 * Defines the transform type / description permutations in addition to file postfix strings.
 * @type {*[]}
 */
const s_FILE_DATA =
[
   { transform_type: 'html', file_postfix: '-html.txt' },
   { transform_type: 'json', file_postfix: '-json.txt' },
   { transform_type: 'markdown', file_postfix: '-markdown.txt' },
   { transform_type: 'text', file_postfix: '-text.txt' },
   { transform_type: 'html', file_postfix: '-html-with-desc.txt', description: true },
   { transform_type: 'json', file_postfix: '-json-with-desc.txt', description: true },
   { transform_type: 'markdown', file_postfix: '-markdown-with-desc.txt', description: true },
   { transform_type: 'text', file_postfix: '-text-with-desc.txt', description: true }
];

/**
 * Tests all permutations for the given filePrefix. Iterates through `s_FILE_DATA` and compares all results.
 *
 * @param {object}            data - The normalized data output from `GitHubInspectOrgsTransform`.
 * @param {TransformControl}  transformControl - An instance of TransformControl.
 * @param {string}            filePrefix - A file path prefix for the test being run.
 */
const s_DATA_TEST = (data, transformControl, filePrefix) =>
{
   if (s_TEST_DATA)
   {
      for (let cntr = 0; cntr < s_FILE_DATA.length; cntr++)
      {
         const entry = s_FILE_DATA[cntr];
         const filePath = `./test/fixture/${filePrefix}${entry.file_postfix}`;

         transformControl.setTransformType(entry.transform_type);
         const result = transformControl.transform(data, entry);

         const testData = fs.readFileSync(filePath, 'utf-8');

         if (result !== testData) { throw new Error(`Test failed for filePath: ${filePath}`); }
      }
   }
};

/**
 * Iterates over `s_FILE_DATA` writing out comparison data to `./test/fixture`.
 *
 * @param {object}            data - The normalized data output from `GitHubInspectOrgsTransform`.
 * @param {TransformControl}  transformControl - An instance of TransformControl.
 * @param {string}            filePrefix - A file path prefix for the test being run.
 */
const s_DATA_WRITE = (data, transformControl, filePrefix) =>
{
   if (s_WRITE_DATA)
   {
      for (let cntr = 0; cntr < s_FILE_DATA.length; cntr++)
      {
         const entry = s_FILE_DATA[cntr];
         const filePath = `./test/fixture/${filePrefix}${entry.file_postfix}`;

         transformControl.setTransformType(entry.transform_type);
         const result = transformControl.transform(data, entry);

         fs.writeFileSync(filePath, result, 'utf-8');
      }
   }
};

/**
 * Strips variable data entries that may change from the normalized data returned from GitHubInspectOrgs.
 *
 * Strips data.normalized.timestamp
 *
 * Strips from data.normalized.orgs[].repos[] -> 'updated_at', 'pushed_at', 'stargazers_count', 'watchers_count'
 *
 * Strips from data.normalized.owners[].ratelimit[] -> 'limit', 'remaining', 'reset' fields.
 *
 * @param {object}   data - Normalized data to strip.
 */
const s_STRIP_VARIABLE_DATA = (data) =>
{
   delete data['timestamp'];

   // Strip any variable repo data from orgs.
   if (Array.isArray(data.orgs))
   {
      s_STRIP_VARIABLE_ORGS(data.orgs);
   }

   // Strip any owner / ratelimit data.
   if (Array.isArray(data.owners))
   {
      for (let cntr = 0; cntr < data.owners.length; cntr++)
      {
         const owner = data.owners[cntr];

         // Strip any variable repo data from orgs.
         if (Array.isArray(owner.orgs))
         {
            s_STRIP_VARIABLE_ORGS(owner.orgs);
         }

         if (Array.isArray(owner.ratelimit))
         {
            // Strip 'limit', 'remaining', 'reset' fields as they may change.
            for (let cntr2 = 0; cntr2 < owner.ratelimit.length; cntr2++)
            {
               const ratelimit = owner.ratelimit[cntr2];

               delete ratelimit.core['limit'];
               delete ratelimit.core['remaining'];
               delete ratelimit.core['reset'];

               delete ratelimit.search['limit'];
               delete ratelimit.search['remaining'];
               delete ratelimit.search['reset'];
            }
         }
      }
   }
};

/**
 * Strips variable repo data from an array of normalized organizations.
 *
 * @param {Array} orgs - Organizations to parse.
 */
const s_STRIP_VARIABLE_ORGS = (orgs) =>
{
   for (let cntr = 0; cntr < orgs.length; cntr++)
   {
      const org = orgs[cntr];

      // Strip 'updated_at', 'pushed_at', 'stargazers_count', 'watchers_count' fields as they may change.
      if (Array.isArray(org.repos))
      {
         for (let cntr2 = 0; cntr2 < org.repos.length; cntr2++)
         {
            const repo = org.repos[cntr2];

            delete repo['updated_at'];
            delete repo['pushed_at'];
            delete repo['stargazers_count'];
            delete repo['watchers_count'];
         }
      }
   }
};
