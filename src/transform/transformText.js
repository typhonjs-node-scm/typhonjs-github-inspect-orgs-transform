'use strict';

import indent              from './indent.js';
import transformCategories from './transformCategories.js';

/**
 * Transforms data to text.
 *
 * @param {object}   data - Normalized data from `GitHubInspectOrgs` to transform.
 * @param {object}   options - Optional parameters:
 * ```
 * (boolean)   description - A boolean which will include more descriptive data while transforming.
 * ```
 *
 * @returns {string}
 */
export default function(data, options)
{
   return transformCategories(data, s_TRANSFORM, options);
}

// Module private ---------------------------------------------------------------------------------------------------

/**
 * Provides a single pass transforming a given category and entry at a particular depth to text.
 *
 * @param {string}   category - Current category type.
 * @param {object}   entry - Entry to transform.
 * @param {number}   depth - Current category depth.
 * @param {object}   options - Optional parameters:
 * ```
 * (boolean)   description - A boolean which will include more descriptive data while transforming.
 * ```
 *
 * @returns {string}
 */
const s_TRANSFORM = (category, entry, depth, options) =>
{
   // Note text only responds to the first pass.
   if (options._transformData[depth].pass > 0) { return ''; }

   const lastEntry = options._transformData[depth].lastEntry;
   const maxDepth = options._transformData[depth].maxDepth;

   const desc = typeof options.description === 'boolean' ? options.description : false;

   const prefix = indent(depth);

   let tail = '\n';

   let resultString = prefix;

   switch(category)
   {
      case 'collaborators':
      case 'contributors':
      case 'members':
      case 'owners':
      case 'users':
         if (depth > 0 && lastEntry && maxDepth) { tail += '\n'; }
         if (desc) { resultString += `${entry.name}${entry.url !== '' ? ` - ${entry.url}` : ''}${tail}`; }
         else { resultString += `${entry.name}${tail}`; }

         break;

      case 'orgs':
         if (depth === 0 && options._maxDepthLength > 1 && maxDepth) { tail += '\n'; }
         else if (depth > 0 && lastEntry && maxDepth) { tail += '\n'; }

         if (desc)
         {
            resultString += `${entry.name}${entry.description !== '' ? ` - ${entry.description}` : ''}${tail}`;
         }
         else { resultString += `${entry.name}${tail}`; }
         break;

      case 'ratelimit':
         if (depth > 0 && lastEntry && maxDepth) { tail += '\n'; }

         resultString += `Core: limit: ${entry.core.limit}, remaining: ${entry.core.remaining}, reset: ${
          new Date(entry.core.reset)}\n${indent(depth)}Search: limit: ${entry.search.limit}, remaining: ${
           entry.search.remaining}, reset: ${new Date(entry.search.reset)}${tail}`;
         break;

      case 'repos':
      case 'teams':
         if (depth > 0 && options._maxDepthLength > 0 && lastEntry && maxDepth) { tail += '\n'; }

         if (desc)
         {
            resultString += `${entry.name}${entry.description ? ` - ${entry.description}` : ''}${tail}`;
         }
         else { resultString += `${entry.name}${tail}`; }
         break;

      case 'stats':
         if (depth > 0 && options._maxDepthLength > 0 && maxDepth) { tail += '\n'; }
         resultString += `${JSON.stringify(entry)}${tail}`;
         break;
   }

   return resultString;
};