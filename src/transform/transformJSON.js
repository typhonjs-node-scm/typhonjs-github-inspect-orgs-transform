'use strict';

/**
 * Transforms data to a JSON string.
 *
 * @param {object}   data - Normalized data from `GitHubInspectOrgs` to transform.
 *
 * @returns {string}
 */
export default function(data)
{
   return JSON.stringify(data);
}
