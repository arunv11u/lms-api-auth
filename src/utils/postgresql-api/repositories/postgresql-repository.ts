/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	BulkCreateOptions,
	CountOptions,
	DestroyOptions,
	FindOptions,
	Optional,
	Sequelize,
	Transaction,
	UpdateOptions
} from "sequelize";
import { v4 as uuidv4 } from "uuid";
import {
	ErrorCodes,
	PostgresqlConnect,
	PostgresqlRepository
} from "../../types";
import { GenericError } from "../../errors";



class PostgresqlRepositoryImpl implements PostgresqlRepository {

	private _postgresqlClient: Sequelize;
	private _session: Transaction | null = null;

	constructor(postgresqlConnect: PostgresqlConnect) {
		this._postgresqlClient = postgresqlConnect.postgresClient;
	}

	async startTransaction(): Promise<void> {
		const transaction = await this._postgresqlClient.transaction();

		this._session = transaction;
	}

	getId(): string {
		return uuidv4();
	}

	async get<T>(modelName: string, id: any): Promise<T | null>
	async get<T>(
		modelName: string,
		id: any,
		options?: FindOptions<any>
	): Promise<T | null> {
		const result = await this._postgresqlClient
			.models[modelName].findOne({
				where: { id },
				transaction: this._session ?? undefined,
				...options
			});

		return result ? (result.get() as T) : null;
	}

	async getAll<T>(modelName: string): Promise<T[]>
	async getAll<T>(
		modelName: string,
		options?: FindOptions<any>
	): Promise<T[]> {
		const results = await this._postgresqlClient
			.models[modelName].findAll({
				transaction: this._session ?? undefined,
				...options
			});

		return results.map(result => result.get() as T);
	}

	async find<T>(modelName: string, query: any): Promise<T[]>
	async find<T>(
		modelName: string,
		query: any,
		options?: FindOptions<any>
	): Promise<T[]> {
		const results = await this._postgresqlClient
			.models[modelName].findAll({
				where: query,
				transaction: this._session ?? undefined,
				...options
			});

		return results.map(result => result.get() as T);
	}

	async findOne<T>(modelName: string, query: any): Promise<T | null>
	async findOne<T>(
		modelName: string,
		query: any,
		options?: FindOptions<any>
	): Promise<T | null> {
		const result = await this._postgresqlClient
			.models[modelName].findOne({
				where: query,
				transaction: this._session ?? undefined,
				...options
			});

		return result ? (result.get() as T) : null;
	}

	async countDocuments(modelName: string): Promise<number>
	async countDocuments(modelName: string, query?: any): Promise<number>
	async countDocuments(
		modelName: string,
		query?: any,
		options?: Omit<CountOptions<any>, "group"> | undefined
	): Promise<number> {
		const count = await this._postgresqlClient.models[modelName].count({
			where: query,
			transaction: this._session ?? undefined,
			...options
		});

		return count;
	}

	async aggregate<T>(modelName: string, aggregation: any[]): Promise<T[]>
	async aggregate<T>(
		modelName: string,
		aggregation: any[],
		query?: any
	): Promise<T[]>
	// eslint-disable-next-line max-params
	async aggregate<T>(
		modelName: string,
		aggregation: any[],
		query?: any,
		options?: FindOptions<any>
	): Promise<T[]> {
		const result = await this._postgresqlClient.models[modelName].findAll({
			attributes: aggregation,
			where: query,
			transaction: this._session ?? undefined,
			...options
		});

		return result.map(row => row.get() as T);
	}

	async add<T, U extends Optional<any, string>>(
		modelName: string,
		data: U
	): Promise<T> {
		const result = await this._postgresqlClient.models[modelName]
			.create(data, {
				transaction: this._session ?? undefined
			});

		return result.get() as T;
	}

	async addRange<T, U extends Optional<any, string>>(
		modelName: string,
		data: U[]
	): Promise<T[]>
	async addRange<T, U extends Optional<any, string>>(
		modelName: string,
		data: U[],
		options?: BulkCreateOptions<any>
	): Promise<T[]> {
		const results = await this._postgresqlClient
			.models[modelName].bulkCreate(data, {
				transaction: this._session ?? undefined,
				returning: true,
				...options
			});

		return results.map(result => result.get() as T);
	}

	async findOneAndUpdate<T, U extends Optional<any, string>>(
		modelName: string,
		id: any,
		data: U
	): Promise<T | null>
	// eslint-disable-next-line max-params
	async findOneAndUpdate<T, U extends Optional<any, string>>(
		modelName: string,
		id: any,
		data: U,
		options?: Omit<UpdateOptions<any>, "returning">
	): Promise<T | null> {
		const [affectedRows, [updatedRecord]] = await this._postgresqlClient
			.models[modelName].update(data, {
				where: { id },
				returning: true,
				transaction: this._session ?? undefined,
				...options
			});

		if (affectedRows === 0) {
			return null;
		}

		return updatedRecord.get() as T;
	}

	async update(modelName: string, id: any, data: any): Promise<number>
	// eslint-disable-next-line max-params
	async update(
		modelName: string,
		id: any,
		data: any,
		options?: Omit<UpdateOptions<any>, "returning">
	): Promise<number> {
		const [affectedRows] = await this._postgresqlClient
			.models[modelName].update(data, {
				where: { id },
				returning: false,
				transaction: this._session ?? undefined,
				...options
			});

		return affectedRows;
	}

	async updateMany(modelName: string, query: any, data: any): Promise<number>
	// eslint-disable-next-line max-params
	async updateMany(
		modelName: string,
		query: any,
		data: any,
		options?: UpdateOptions<any>
	): Promise<number> {
		const [affectedRows] = await this._postgresqlClient
			.models[modelName].update(data, {
				where: query,
				transaction: this._session ?? undefined,
				...options
			});

		return affectedRows;
	}

	async remove(modelName: string, id: any): Promise<boolean>
	async remove(
		modelName: string,
		id: any,
		options?: DestroyOptions<any>
	): Promise<boolean> {
		const result = await this._postgresqlClient
			.models[modelName].destroy({
				where: { id },
				transaction: this._session ?? undefined,
				...options
			});

		return result > 0;
	}

	async removeRange(modelName: string, query: any): Promise<number>
	async removeRange(
		modelName: string,
		query: any,
		options?: DestroyOptions<any>
	): Promise<number> {
		const result = await this._postgresqlClient.models[modelName].destroy({
			where: query,
			transaction: this._session ?? undefined,
			...options
		});

		return result;
	}

	async abortTransaction(): Promise<void> {
		if (!this._session)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Cannot abort transaction without starting it."),
				errorCode: 500
			});

		await this._session.rollback();
	}

	async commitTransaction(): Promise<void> {
		if (!this._session)
			throw new GenericError({
				code: ErrorCodes.internalError,
				error: new Error("Cannot commit transaction without starting it."),
				errorCode: 500
			});

		await this._session.commit();
	}
}

export {
	PostgresqlRepositoryImpl
};