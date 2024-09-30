/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	BulkCreateOptions,
	CountOptions,
	DestroyOptions,
	FindOptions,
	Optional,
	Sequelize,
	UpdateOptions,
	WhereOptions
} from "sequelize";



export abstract class PostgresqlRepository {

	abstract getPostgresClient(): Sequelize;

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

	abstract find<T>(
		modelName: string, 
		query: WhereOptions<T>
	): Promise<T[]>;
	abstract find<T>(
		modelName: string,
		query: WhereOptions<T>,
		options: FindOptions<any>
	): Promise<T[]>;


	abstract findOne<T>(
		modelName: string, 
		query: WhereOptions<T>
	): Promise<T | null>;
	abstract findOne<T>(
		modelName: string,
		query: WhereOptions<T>,
		options: FindOptions<any>
	): Promise<T | null>;

	abstract countDocuments(modelName: string): Promise<number>;
	abstract countDocuments<T>(
		modelName: string, 
		query: WhereOptions<T>
	): Promise<number>;
	abstract countDocuments<T>(
		modelName: string,
		query: WhereOptions<T>,
		options: Omit<CountOptions<any>, "group"> | undefined
	): Promise<number>;

	abstract aggregate<T>(modelName: string, aggregation: any[]): Promise<T[]>;
	abstract aggregate<T>(
		modelName: string,
		aggregation: any[],
		query: WhereOptions<T>
	): Promise<T[]>;
	// eslint-disable-next-line max-params
	abstract aggregate<T>(
		modelName: string,
		aggregation: any[],
		query: WhereOptions<T>,
		options: FindOptions<any>
	): Promise<T[]>;

	abstract add<T, U extends Optional<any, string>>(
		modelName: string, 
		data: U
	): Promise<T>;

	abstract addRange<T, U extends Optional<any, string>>(
		modelName: string, 
		data: U[]
	): Promise<T[]>;
	abstract addRange<T, U extends Optional<any, string>>(
		modelName: string,
		data: U[],
		options: BulkCreateOptions<any>
	): Promise<T[]>;

	abstract findOneAndUpdate<T>(
		modelName: string,
		query: WhereOptions<T>,
		data: Partial<T>
	): Promise<T | null>;
	// eslint-disable-next-line max-params
	abstract findOneAndUpdate<T>(
		modelName: string,
		query: WhereOptions<T>,
		data: Partial<T>,
		options: Omit<UpdateOptions<any>, "returning">
	): Promise<T | null>;

	abstract update<T>(
		modelName: string, 
		query: WhereOptions<T>,
		data: Partial<T>
	): Promise<number>;
	// eslint-disable-next-line max-params
	abstract update<T>(
		modelName: string,
		query: WhereOptions<T>,
		data: Partial<T>,
		options: Omit<UpdateOptions<any>, "returning">
	): Promise<number>;

	abstract updateMany<T>(
		modelName: string,
		query: WhereOptions<T>,
		data: Partial<T>
	): Promise<number>;
	// eslint-disable-next-line max-params
	abstract updateMany<T>(
		modelName: string,
		query: WhereOptions<T>,
		data: Partial<T>,
		options: UpdateOptions<any>
	): Promise<number>;

	abstract remove(modelName: string, id: any): Promise<boolean>;
	abstract remove(
		modelName: string,
		id: any,
		options: DestroyOptions<any>
	): Promise<boolean>;

	abstract removeRange<T>(
		modelName: string, 
		query: WhereOptions<T>
	): Promise<number>;
	abstract removeRange<T>(
		modelName: string,
		query: WhereOptions<T>,
		options: DestroyOptions<any>
	): Promise<number>;

	abstract rawSqlQueryForReadOperations(query: string): Promise<any>;

	abstract commitTransaction(): Promise<void>;

	abstract abortTransaction(): Promise<void>;
}