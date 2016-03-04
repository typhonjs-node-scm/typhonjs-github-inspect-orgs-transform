'use strict';

import transformHTML       from './transformHTML.js';
import transformJSON       from './transformJSON.js';
import transformMarkdown   from './transformMarkdown.js';
import transformText       from './transformText.js';

/**
 * TransformControl - Provides a dispatch mechanism to transform a given data object of nested categories by a
 * provided transform function. By default the following transform types are available: `html`, `json`, `markdown` and
 * `text`. The default transforms output data as a string, but user supplied transforms may output any type of data.
 */
export default class TransformControl
{
   /**
    * Initializes TransformControl with `html`, `json`, `markdown` and `text` transforms in addition to any user
    * supplied transforms stored in `options.transforms` hash.
    *
    * @param {object}   options - Optional parameters:
    * ```
    * optional:
    * (string) transformType - The current transform type.
    *
    * (object) transforms - A hash with user supplied transforms to add to TransformControl.
    * ```
    */
   constructor(options = {})
   {
      /**
       * Stores all transform functions by type.
       *
       * @type {{html: Function, json: Function, markdown: Function, text: Function}}
       * @private
       */
      this._transforms =
      {
         html: transformHTML,
         json: transformJSON,
         markdown: transformMarkdown,
         text: transformText
      };

      /**
       * Stores the current transform type.
       *
       * @type {string}
       * @private
       */
      this._transformType = typeof options.transformType === 'string' ? options.transformType : 'text';

      // Add any user supplied transforms.
      if (typeof options.transforms === 'object')
      {
         for (const key in options.transforms)
         {
            if (typeof key !== 'string')
            {
               throw new TypeError(`ctor error: 'options.transforms[key]' is not a 'string'.`);
            }

            if (typeof options.transforms[key] !== 'function')
            {
               throw new TypeError(`ctor error: 'options.transforms[value]' is not a 'function'.`);
            }

            this._transforms[key] = options.transforms[key];
         }
      }

      // Validate the current transform type.
      if (typeof this._transforms[this._transformType] === 'undefined')
      {
         throw new Error(`ctor error: 'options.transformType' is an invalid transform type.`);
      }
   }

   /**
    * Returns the current transform type.
    *
    * @returns {string}
    */
   getTransformType()
   {
      return this._transformType;
   }

   /**
    * Sets the current transform type.
    *
    * @param {string}   transformType - A transform type.
    */
   setTransformType(transformType)
   {
      if (typeof this._transformType !== 'string')
      {
         throw new TypeError(`setTransformType error: 'transformType' is not a 'string'.`);
      }

      if (typeof this._transforms[this._transformType] === 'undefined')
      {
         throw new Error(`setTransformType error: 'transformType' is an invalid transform type.`);
      }

      this._transformType = transformType;
   }

   /**
    * Transforms the given data by the current tranform type.
    *
    * @param {object}   data - The normalized data output from `GitHubInspectOrgs`.
    *
    * @param {object}   options - Optional parameters passed to transform function.
    * ```
    * (boolean)   description - Add additional description info for all entries where available; default (false).
    *
    * (string)    transformType - Overrides TransformControl default transformType; default (_transformType).
    * ```
    *
    * @returns {*}
    */
   transform(data, options = {})
   {
      if (typeof data !== 'object')
      {
         throw new TypeError(`transform error: 'data' is not a 'object'.`);
      }

      if (typeof options !== 'object')
      {
         throw new TypeError(`transform error: 'options' is not a 'object'.`);
      }

      if (typeof options.transformType !== 'undefined' && typeof options.transformType !== 'string')
      {
         throw new TypeError(`transform error: 'options.transformType' is not a 'string'.`);
      }

      const transformType = typeof options.transformType === 'string' ? options.transformType : this._transformType;

      if (typeof this._transforms[transformType] === 'undefined')
      {
         throw new Error(`transform error: 'transformType' is an invalid transform type.`);
      }

      return this._transforms[transformType](data, options);
   }
}