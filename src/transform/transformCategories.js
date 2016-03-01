'use strict';

/**
 * Provides a recursive function to traverse categories.
 *
 * @param {object}   data - Data to traverse.
 * @param {function} transformFunction - Function to apply to category.
 * @param {object}   options - Optional parameters.
 * @returns {string}
 */
export default function(data, transformFunction, options)
{
   const categories = data.categories.split(':');

   options._maxDepthLength = categories.length;
   options._transformData = [];

   // Push X empty objects for the cateogories length transform data.
   for (let cntr = 0; cntr < categories.length; cntr++) { options._transformData.push({}); }

   const resultString = s_DEPTH_TRAVERSAL(categories, data, 0, transformFunction, options);

   options._transformData = undefined;
   options._maxDepthLength = undefined;

   return resultString;
}

// Module private ---------------------------------------------------------------------------------------------------

/**
 * Provides a recursive function to normalize results.
 *
 * @param {Array<string>}  categories - Array of categories to traverse.
 * @param {object}         data - Data to traverse.
 * @param {number}         depth - Current category depth.
 * @param {function}       transformFunction - Function to apply to category.
 * @param {object}         options - Optional parameters.
 * @returns {string}
 */
const s_DEPTH_TRAVERSAL = (categories, data, depth, transformFunction, options) =>
{
   const category = categories[depth];
   const nextCategory = categories.length > depth ? categories[depth + 1] : undefined;
   const entries = data[category];

   let resultString = '';

   for (let cntr = 0; cntr < entries.length; cntr++)
   {
      const maxDepth = !(nextCategory && Array.isArray(entries[cntr][nextCategory]) &&
       entries[cntr][nextCategory].length > 0);

      options._transformData[depth].firstEntry = cntr === 0;
      options._transformData[depth].lastEntry = cntr === entries.length - 1;
      options._transformData[depth].maxDepth = maxDepth;
      options._transformData[depth].pass = 0;

      resultString += transformFunction(category, entries[cntr], depth, options);

      if (!maxDepth)
      {
         resultString += s_DEPTH_TRAVERSAL(categories, entries[cntr], depth + 1, transformFunction, options);
      }

      // Make a second closing pass of the transform function; necessary for HTML transform.

      options._transformData[depth].pass = 1;

      resultString += transformFunction(category, entries[cntr], depth, options);
   }

   return resultString;
};
