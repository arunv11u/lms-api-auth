/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	BulkCreateOptions,
	CountOptions,
	DestroyOptions,
	FindOptions,
	Optional,
	UpdateOptions
} from "sequelize";



export abstract class PostgresqlRepository {

	abstract startTransaction(): Promise<void>;

	abstract getId(): string;

	abstract get<T>(modelName: string, id: any): Promise<T | null>;
	abstract get<T>(
		modelName: string,
		id: any,
		options: FindOptions<any>
	): Promise<T | null>;

	abstract getAll<T>(modelName: string): Promise<T[]>;
	abstract getAll<T>(
		modelName: string,
		options: FindOptions<any>
	): Promise<T[]>;

	abstract find<T>(modelName: string, query: any): Promise<T[]>;
	abstract find<T>(
		modelName: string,
		query: any,
		options: FindOptions<any>
	): Promise<T[]>;


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

	abstract add<T,U extends Optional<any, string>>(
		modelName: string, 
		data: U
	): Promise<T>;

	abstract addRange<T, U extends Optional<any, string>>(
		modelName: string, 
		data: U[]
	): Promise<T[]>;
	abstract addRange<T,U extends Optional<any, string>>(
		modelName: string,
		data: U[],
		options: BulkCreateOptions<any>
	): Promise<T[]>;

	abstract findOneAndUpdate<T,U extends Optional<any, string>>(
		modelName: string,
		id: any,
		data: U
	): Promise<T | null>;
	// eslint-disable-next-line max-params
	abstract findOneAndUpdate<T,U extends Optional<any, string>>(
		modelName: string,
		id: any,
		data: U,
		options: Omit<UpdateOptions<any>, "returning">
	): Promise<T | null>;

	abstract update<U extends Optional<any, string>>(
		modelName: string, 
		id: any, 
		data: U
	): Promise<number>;
	// eslint-disable-next-line max-params
	abstract update<U extends Optional<any, string>>(
		modelName: string,
		id: any,
		data: U,
		options: Omit<UpdateOptions<any>, "returning">
	): Promise<number>;

	abstract updateMany<U extends Optional<any, string>>(
		modelName: string,
		query: any,
		data: U
	): Promise<number>;
	// eslint-disable-next-line max-params
	abstract updateMany<U extends Optional<any, string>>(
		modelName: string,
		query: any,
		data: U,
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