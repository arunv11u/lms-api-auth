/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-lines */
import { getInstructorFactory, getStudentFactory, getTokenFactory } from "../../global-config";
import { InstructorRepository } from "../../instructor";
import { StudentRepository } from "../../student";
import { TokenRepository } from "../../token";
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
	studentRepository = "StudentRepository",
	tokenRepository = "TokenRepository",
	instructorRepository = "InstructorRepository"
}

class UnitOfWorkImpl implements UnitOfWork {

	private _repositories = [
		Repositories.studentRepository,
		Repositories.tokenRepository,
		Repositories.instructorRepository
	];

	private _postgresqlRepository: PostgresqlRepository;
	private _studentRepository: StudentRepository;
	private _tokenRepository: TokenRepository;
	private _instructorRepository: InstructorRepository;

	constructor() {
		this._postgresqlRepository = getPostgresqlRepository();

		this._studentRepository = getStudentFactory()
			.make(Repositories.studentRepository) as StudentRepository;
		this._studentRepository.postgresqlRepository =
			this._postgresqlRepository;

		this._tokenRepository = getTokenFactory()
			.make(Repositories.tokenRepository) as TokenRepository;
		this._tokenRepository.postgresqlRepository = this._postgresqlRepository;

		this._instructorRepository = getInstructorFactory()
			.make(Repositories.instructorRepository) as InstructorRepository;
		this._instructorRepository.postgresqlRepository =
			this._postgresqlRepository;
	}

	async start() {
		await this._postgresqlRepository.startTransaction();
	}

	getAllRepositoryNames() {
		return this._repositories;
	}

	getRepository(repositoryName: string): Repository {

		if (repositoryName === Repositories.studentRepository)
			return this._studentRepository;

		if (repositoryName === Repositories.tokenRepository)
			return this._tokenRepository;

		if (repositoryName === Repositories.instructorRepository)
			return this._instructorRepository;

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