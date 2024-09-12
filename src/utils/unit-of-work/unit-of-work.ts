/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */
import { GenericError } from "../errors";
import { getPostgresqlRepository } from "../helpers";
import {
	ErrorCodes,
	PostgresqlRepository,
	Repository,
	UnitOfWork
} from "../types";


//! Do not export this Repositories enum at any cost.
enum Repositories {
	
}

class UnitOfWorkImpl implements UnitOfWork {

	private _repositories = [];

	private _postgresqlRepository: PostgresqlRepository;

	constructor() {
		this._postgresqlRepository = getPostgresqlRepository();
	}

	async start() {
		await this._postgresqlRepository.startTransaction();
	}

	getAllRepositoryNames() {
		return this._repositories;
	}

	getRepository(repositoryName: string): Repository {

		throw new GenericError({
			code: ErrorCodes.internalError,
			error: new Error("Given repository not found"),
			errorCode: 500
		});
	}

	async complete() {
		await this._postgresqlRepository.commitTransaction();
	}

	async dispose() {
		await this._postgresqlRepository.abortTransaction();
	}
}

export {
	UnitOfWorkImpl
};