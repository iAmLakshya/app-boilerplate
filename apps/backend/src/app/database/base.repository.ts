import { PaginationOptions, PaginationResult } from '@/types'; // Assuming these types are defined elsewhere
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  Model,
  Error as MongooseError,
  ProjectionType,
  RootFilterQuery,
  UpdateQuery,
} from 'mongoose';

export abstract class BaseRepository<T> {
  protected readonly model: Model<T>;

  constructor(protected selectedModel: Model<T>) {
    // This check is good practice for abstract base classes
    if (new.target === BaseRepository) {
      throw new TypeError('Cannot construct BaseRepository instances directly');
    }
    if (!selectedModel) {
      throw new Error('Mongoose model must be provided to the repository');
    }
    this.model = selectedModel;
  }
  protected handleMongoError(error, context: string): never {
    const prefix = `${this.model.modelName}(${context}): `;

    // 1. Duplicate Key Error (MongoServerError code 11000)
    if (error.code === 11000) {
      // Extract duplicate key information if possible (may vary slightly based on driver version)
      const keys = error.keyValue
        ? Object.keys(error.keyValue).join(', ')
        : 'unique field(s)';
      throw new ConflictException(`${prefix}Duplicate key error for ${keys}.`);
    }

    // 2. Mongoose Validation Error
    if (error instanceof MongooseError.ValidationError) {
      // Extract specific validation messages
      const messages = Object.values(error.errors)
        .map((e) => e.message)
        .join(', ');
      throw new BadRequestException(`${prefix}Validation failed: ${messages}`);
    }

    // 3. Mongoose Casting Error (e.g., invalid ObjectId format)
    if (error instanceof MongooseError.CastError) {
      throw new BadRequestException(
        `${prefix}Invalid format for field ${error.path}: ${error.value}`
      );
    }

    // 4. General Mongoose Errors or other errors
    console.error(`${prefix}Unhandled Mongoose/DB Error:`, error); // Log the original error for debugging
    throw new InternalServerErrorException(
      `${prefix}A database error occurred.`
    );
  }

  public async findAll(filter?: RootFilterQuery<T>): Promise<T[]> {
    try {
      return await this.model.find(filter || {}).exec();
    } catch (error) {
      this.handleMongoError(error, 'findAll');
    }
  }

  public async findById(id: string): Promise<T> {
    let doc: T | null;
    try {
      doc = await this.model.findById(id).exec();
    } catch (error) {
      if (error instanceof MongooseError.CastError) {
        throw new BadRequestException(`Invalid ID format: ${id}`);
      }
      this.handleMongoError(error, `findById(${id})`);
    }

    if (!doc) {
      throw new NotFoundException(`Document with ID ${id} not found.`);
    }
    return doc;
  }

  public async findOne(filter: RootFilterQuery<T>): Promise<T> {
    let doc: T | null;
    try {
      doc = await this.model.findOne(filter).exec();
    } catch (error) {
      this.handleMongoError(
        error,
        `findOne with filter ${JSON.stringify(filter)}`
      );
    }

    if (!doc) {
      throw new NotFoundException(`Document matching filter not found.`);
    }
    return doc;
  }

  public async create(data: T): Promise<T> {
    try {
      return await this.model.create(data);
    } catch (error) {
      this.handleMongoError(error, 'create');
    }
  }

  public async update(
    id: string,
    data: UpdateQuery<Partial<T>>,
    projection?: ProjectionType<T>
  ): Promise<T> {
    try {
      const updatedDoc = await this.model
        .findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
          projection,
        })
        .exec();

      if (!updatedDoc) {
        throw new NotFoundException(
          `Document with ID ${id} not found for update.`
        );
      }
      return updatedDoc;
    } catch (error) {
      if (error instanceof MongooseError.CastError && error.path === '_id') {
        throw new BadRequestException(`Invalid ID format for update: ${id}`);
      }
      this.handleMongoError(error, `update(${id})`);
    }
  }

  public async delete(id: string): Promise<T> {
    try {
      const deletedDoc = await this.model.findByIdAndDelete(id).exec();
      if (!deletedDoc) {
        throw new NotFoundException(
          `Document with ID ${id} not found for deletion.`
        );
      }
      return deletedDoc;
    } catch (error) {
      if (error instanceof MongooseError.CastError && error.path === '_id') {
        throw new BadRequestException(`Invalid ID format for delete: ${id}`);
      }
      this.handleMongoError(error, `delete(${id})`);
    }
  }

  /**
   * Generic pagination method.
   * @param {object} filter - Mongoose filter query object. Defaults to {}.
   * @param {object} options - Pagination options.
   * @param {number} [options.page=1] - Current page number.
   * @param {number} [options.limit=10] - Number of documents per page.
   * @param {object|string} [options.sort] - Mongoose sort criteria.
   * @param {string} [options.select] - Fields to select (projection).
   * @param {string|object|Array<string|object>} [options.populate] - Population options.
   * @returns {Promise<PaginationResult<T>>} - Object containing pagination results.
   */
  public async paginate(
    filter: RootFilterQuery<T> = {},
    options: PaginationOptions = {}
  ): Promise<PaginationResult<T>> {
    const {
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
      select,
      populate,
    } = options;

    const cleanPage = Math.max(1, parseInt(`${page}`, 10) || 1);
    const cleanLimit = Math.max(1, parseInt(`${limit}`, 10) || 10);
    const skip = (cleanPage - 1) * cleanLimit;

    try {
      const countPromise = this.model.countDocuments(filter).exec();

      let query = this.model
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(cleanLimit);

      if (select) {
        query = query.select(select);
      }
      if (populate) {
        query = query.populate(populate);
      }
      const docsPromise = query.exec();

      const [totalDocs, docs] = await Promise.all([countPromise, docsPromise]);
      const totalPages = Math.ceil(totalDocs / cleanLimit);
      const hasNextPage = cleanPage < totalPages;
      const hasPrevPage = cleanPage > 1;

      return {
        data: docs,
        pagination: {
          total: totalDocs,
          limit: cleanLimit,
          page: cleanPage,
          totalPages: totalPages,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage,
          nextPage: hasNextPage ? cleanPage + 1 : null,
          prevPage: hasPrevPage ? cleanPage - 1 : null,
        },
      };
    } catch (error) {
      console.error('Error during pagination:', error);
      throw new InternalServerErrorException(
        'Failed to retrieve paginated data.'
      );
    }
  }
}
