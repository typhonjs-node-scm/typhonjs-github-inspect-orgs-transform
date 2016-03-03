'use strict';

import indent              from './indent.js';
import transformCategories from './transformCategories.js';

/**
 * Transforms data to markdown.
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
 * Provides a single pass transforming a given category and entry at a particular depth to markdown.
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
   // Note Markdown only responds to the first pass.
   if (options._transformData[depth].pass > 0) { return ''; }

   const lastEntry = options._transformData[depth].lastEntry;
   const maxDepth = options._transformData[depth].maxDepth;
   const maxDepthLength = options._maxDepthLength;

   const desc = typeof options.description === 'boolean' ? options.description : false;

   let resultString = '';

   let prefix = '';
   let tail = '\n\n';

   switch (depth)
   {
      case 1:
         prefix = `${indent(1)}- `;
         tail = '\n';
         tail += lastEntry && maxDepth ? '\n' : '';
         break;
      case 2:
         prefix = `${indent(2)}* `;
         tail = '\n';
         tail += lastEntry && maxDepth ? '\n' : '';
         break;
   }

   switch(category)
   {
      case 'collaborators':
      case 'contributors':
      case 'members':
      case 'owners':
      case 'users':
         if (depth === 0 && maxDepthLength === 1) { prefix = '- '; tail = '\n'; }
         resultString += `${prefix}${entry.url !== '' ? `[${entry.name}](${entry.url})` : entry.name}${tail}`;
         break;

      case 'orgs':
      case 'repos':
         if (desc)
         {
            resultString += `${prefix}${entry.url !== '' ? `[${entry.name}](${entry.url})` :
             entry.name}${entry.description ? ` - ${entry.description}` : ''}${tail}`;
         }
         else { resultString += `${prefix}${entry.url !== '' ? `[${entry.name}](${entry.url})` : entry.name}${tail}`; }
         break;

      case 'ratelimit':
         resultString += `${prefix}Core: limit: ${entry.core.limit}, remaining: ${entry.core.remaining}, reset: ${
          new Date(entry.core.reset)}\n${prefix}Search: limit: ${entry.search.limit}, remaining: ${
           entry.search.remaining}, reset: ${new Date(entry.search.reset)}${tail}`;
         break;

      case 'teams':
         if (desc)
         {
            resultString += `${prefix}${entry.name}${entry.description ? ` - ${entry.description}` : ''}${tail}`;
         }
         else { resultString += `${prefix}${entry.name}${tail}`; }
         break;

      case 'stats':
         resultString += `${prefix}\`\`\`${JSON.stringify(entry)}\`\`\`${tail}`;
         break;
   }

   return resultString;
};