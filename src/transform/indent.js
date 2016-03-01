'use strict';

/**
 * Provides a function providing an indented string based on the depth of category.
 *
 * @param {number}   depth - Depth of category.
 *
 * @returns {string}
 */
export default function(depth)
{
   if (!Number.isInteger(depth)) { throw new TypeError(`indent error: 'depth' is not an 'integer'.`); }

   let result = '';

   for (let cntr = 0; cntr < depth; cntr++) { result += '   '; }

   return result;
}