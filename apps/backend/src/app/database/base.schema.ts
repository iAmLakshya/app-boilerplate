import {
  Schema as MongooseSchema,
  SchemaOptions,
  HydratedDocument,
} from 'mongoose';
import { SchemaFactory } from '@nestjs/mongoose';
import { Type } from '@nestjs/common';

/**
 * Creates a Mongoose schema instance using NestJS's SchemaFactory,
 * adding common configurations like a virtual 'id' field and standardized
 * toJSON/toObject options.
 *
 * @template T The type/class representing the document structure.
 * @param {Type<T>} definition The class decorated with @Schema() for which to create the schema.
 * @param {SchemaOptions} [schemaOptions] Optional Mongoose schema options.
 * @returns {MongooseSchema<T>} The configured Mongoose schema instance.
 */
export const createSchema = <T>(
  definition: Type<T>,
  schemaOptions?: SchemaOptions
): MongooseSchema<T> => {
  const schema: MongooseSchema<T> = SchemaFactory.createForClass(definition);

  schema.virtual('id').get(function (this: HydratedDocument<T>) {
    return this._id.toString();
  });

  const existingToObject = schemaOptions?.toObject ?? {};
  const existingToJson = schemaOptions?.toJSON ?? {};

  schema.set('toObject', {
    virtuals: true,
    ...existingToObject,
  });

  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    ...existingToJson, // Merge first
    transform: (
      doc: HydratedDocument<T>, // Keep doc typed correctly here
      ret: Record<string, any>,
      options: any
    ) => {
      delete ret._id;

      if (typeof existingToJson.transform === 'function') {
        // --- Workaround ---
        // Use type assertion 'as any' for 'doc' ONLY when calling the potentially
        // problematic external transform function. This acknowledges the complex
        // type mismatch related to toJSON signatures.
        return existingToJson.transform(doc as any, ret, options);
        // --- End Workaround ---
      }

      return ret;
    },
  });

  return schema;
};
