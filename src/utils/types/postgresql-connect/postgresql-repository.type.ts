/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	BulkCreateOptions,
	CountOptions,
	DestroyOptions,
	FindOptions,
	UpdateOptions
} from "sequelize";



export abstract class PostgresqlRepository {

	abstract startTransaction(): Promise<void>;

	abstract get<T>(modelName: string, id: any): Promise<T | null>;
	abstract get<T>(
		modelName: string,
		id: any,
		options: FindOptions<any>
	): Promise<T | null>;

	abstract getAll<T>(modelName: string): Promise<T[] | null>;
	abstract getAll<T>(
		modelName: string,
		options: FindOptions<any>
	): Promise<T[] | null>;

	abstract find<T>(modelName: string, query: any): Promise<T[] | null>;
	abstract find<T>(
		modelName: string,
		query: any,
		options: FindOptions<any>
	): Promise<T[] | null>;


	abstract findOne<T>(modelName: string, query: any): Promise<T | null>;
	abstract findOne<T>(
		modelName: string,
		query: any,
		options: FindOptions<any>
	): Promise<T | null>;

	abstract countDocuments(modelName: string): Promise<number>;
	abstract countDocuments(modelName: string, query: any): Promise<number>;
	abstract countDocuments(
		modelName: string,
		query: any,
		options: Omit<CountOptions<any>, "group"> | undefined
	): Promise<number>;

	abstract aggregate<T>(modelName: string, aggregation: any[]): Promise<T[]>;
	abstract aggregate<T>(
		modelName: string,
		aggregation: any[],
		query: any
	): Promise<T[]>;
	// eslint-disable-next-line max-params
	abstract aggregate<T>(
		modelName: string,
		aggregation: any[],
		query: any,
		options: FindOptions<any>
	): Promise<T[]>;

	abstract add<T>(modelName: string, data: any): Promise<T>;
	abstract add<T>(
		modelName: string,
		data: any
	): Promise<T>;

	abstract addRange<T>(modelName: string, data: any[]): Promise<T[]>;
	abstract addRange<T>(
		modelName: string,
		data: any[],
		options: BulkCreateOptions<any>
	): Promise<T[]>;

	abstract findOneAndUpdate<T>(
		modelName: string,
		id: any,
		data: any
	): Promise<T | null>;
	// eslint-disable-next-line max-params
	abstract findOneAndUpdate<T>(
		modelName: string,
		id: any,
		data: any,
		options: Omit<UpdateOptions<any>, "returning">
	): Promise<T | null>;

	abstract update(modelName: string, id: any, data: any): Promise<number>;
	// eslint-disable-next-line max-params
	abstract update(
		modelName: string,
		id: any,
		data: any,
		options: Omit<UpdateOptions<any>, "returning">
	): Promise<number>;

	abstract updateMany(
		modelName: string,
		query: any,
		data: any
	): Promise<number>;
	// eslint-disable-next-line max-params
	abstract updateMany(
		modelName: string,
		query: any,
		data: any,
		options: UpdateOptions<any>
	): Promise<number>;

	abstract remove(modelName: string, id: any): Promise<boolean>;
	abstract remove(
		modelName: string,
		id: any,
		options: DestroyOptions<any>
	): Promise<boolean>;

	abstract removeRange(modelName: string, query: any): Promise<number>;
	abstract removeRange(
		modelName: string,
		query: any,
		options: DestroyOptions<any>
	): Promise<number>;

	abstract commitTransaction(): Promise<void>;

	abstract abortTransaction(): Promise<void>;
}