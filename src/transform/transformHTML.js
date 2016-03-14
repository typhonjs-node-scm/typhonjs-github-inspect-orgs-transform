'use strict';

import indent              from './indent.js';
import transformCategories from './transformCategories.js';

/**
 * Transforms data to HTML via a series of unordered lists based on category data from a query. Each category
 * will be assigned a CSS `id` with the category name. For stylizing lists the first `li` at depth 0 will be assigned
 * a CSS class `li-depth-0` which can be used for providing margins.
 *
 * @param {object}   data - Normalized data from `GitHubInspectOrgs` to transform.
 * @param {object}   options - Optional parameters:
 * ```
 * (boolean)   description - A boolean which will include more descriptive data while transforming.
 * ```
 *
 * @returns {string}
 */
export default function(data, options = {})
{
   return transformCategories(data, s_TRANSFORM, options);
}

// Module private ---------------------------------------------------------------------------------------------------

/**
 * Provides a two pass dispatch transforming a given category and entry at a particular depth to HTML.
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
   switch (options._transformData[depth].pass)
   {
      case 0:
         return s_TRANSFORM_FIRST_PASS(category, entry, depth, options);

      case 1:
         return s_TRANSFORM_SECOND_PASS(category, entry, depth, options);

      /* istanbul ignore next */
      default:
         return '';
   }
};

/**
 * Provides the first pass transforming a given category and entry at a particular depth to HTML.
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
const s_TRANSFORM_FIRST_PASS = (category, entry, depth, options = {}) =>
{
   const firstEntry = options._transformData[depth].firstEntry;
   const maxDepth = options._transformData[depth].maxDepth;
   const maxDepthLength = options._maxDepthLength;

   const desc = typeof options.description === 'boolean' ? options.description : false;

   let prefix = '';
   let tail = '\n';

   if (firstEntry)
   {
      prefix += `${indent(depth)}<ul id="${category}">\n${indent(depth + 1)}<li>`;
   }
   else
   {
      if (depth === 0 && depth < maxDepthLength - 1)
      {
         prefix += `${indent(depth + 1)}<li class="li-depth-0">`;
      }
      else
      {
         prefix += `${indent(depth + 1)}<li>`;
      }
   }

   if (maxDepth) { tail = '</li>\n'; }

   let resultString = prefix;

   switch (category)
   {
      case 'collaborators':
      case 'contributors':
      case 'members':
      case 'owners':
      case 'users':
         resultString += `${entry.url !== '' ? `<a href="${entry.url}" target="_blank">${entry.name}</a>` :
          entry.name}${tail}`;
         break;

      case 'orgs':
      case 'repos':
         if (desc)
         {
            resultString += `${entry.url !== '' ? `<a href="${entry.url}" target="_blank">${entry.name}</a>` :
             entry.name}${entry.description ? ` - ${entry.description}` : ''}${tail}`;
         }
         else
         {
            resultString += `${entry.url !== '' ? `<a href="${entry.url}" target="_blank">${entry.name}</a>` :
             entry.name}${tail}`;
         }
         break;

      case 'ratelimit':
         resultString += `Core: limit: ${entry.core.limit}, remaining: ${entry.core.remaining}, reset: ${
          new Date(entry.core.reset)}${tail}`;

         resultString += `${indent(depth + 1)}<li>Search: limit: ${entry.search.limit}, remaining: ${
          entry.search.remaining}, reset: ${new Date(entry.search.reset)}${tail}`;
         break;

      case 'teams':
         if (desc) { resultString += `${entry.name}${entry.description ? ` - ${entry.description}` : ''}${tail}`; }
         else { resultString += `${entry.name}${tail}`; }
         break;

      case 'stats':
         resultString += `<pre>${JSON.stringify(entry)}</pre>${tail}`;
         break;
   }

   return resultString;
};

/**
 * Provides the second pass transforming a given category and entry at a particular depth to HTML (provides closing
 * tags).
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
const s_TRANSFORM_SECOND_PASS = (category, entry, depth, options = {}) =>
{
   const lastEntry = options._transformData[depth].lastEntry;
   const maxDepth = options._transformData[depth].maxDepth;

   let resultString = '';

   let tail = '';

   if (!maxDepth) { tail = `${indent(depth + 1)}</li>\n`; }

   if (lastEntry) { tail += `${indent(depth)}</ul>\n`; }

   resultString += tail;

   return resultString;
};