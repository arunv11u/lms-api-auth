/* eslint-disable max-lines */
import { getInstructorFactory } from "../../../global-config";
import { UserRepositoryImpl } from "../../../user";
import {
	ErrorCodes,
	GenericError,
	PasswordChecker,
	PasswordCheckerImpl,
	PostgresqlRepository
} from "../../../utils";
import { InstructorEntity, InstructorObject, InstructorRepository } from "../../domain";
import { InstructorFactory } from "../../factory";
import { InstructorCreatedPublisher, InstructorWelcomePublisher } from "../messaging";
import { InstructorCreationAttributes, InstructorORMEntity, InstructorSignupMethods } from "./instructor.orm-entity";



export class InstructorRepositoryImpl implements
	InstructorRepository, InstructorObject {
	private _modelName = "Instructor";
	private _postgresqlRepository: PostgresqlRepository | null = null;
	private _instructorFactory: InstructorFactory;
	private _passwordChecker: PasswordChecker;

	constructor() {
		this._instructorFactory = getInstructorFactory();
		this._passwordChecker = new PasswordCheckerImpl();
	}

	set postgresqlRepository(postgresqlRepository: PostgresqlRepository) {
		this._postgresqlRepository = postgresqlRepository;
	}

	getId(): string {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		return this._postgresqlRepository.getId();
	}

	async getUserIdWithInstructorId(id: string): Promise<string> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const instructorORMEntity = await this._postgresqlRepository
			.get<InstructorORMEntity>(
				this._modelName,
				id
			);
		if (!instructorORMEntity)
			throw new GenericError({
				code: ErrorCodes.instructorNotFound,
				error: new Error("Instructor not found"),
				errorCode: 404
			});

		return instructorORMEntity.user_id;
	}

	async register(instructor: InstructorEntity): Promise<InstructorEntity> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		if (!instructor.password)
			throw new GenericError({
				code: ErrorCodes.instructorPasswordNotExists,
				error: new Error("Instructor password does not exist"),
				errorCode: 400
			});

		if (await this._isInstructorAlreadyExistsWithEmail(instructor.email))
			throw new GenericError({
				code: ErrorCodes.instructorAlreadyExists,
				error: new Error("Instructor already exists"),
				errorCode: 400
			});

		const instructorCreatedPublisher = new InstructorCreatedPublisher();
		const instructorWelcomePublisher = new InstructorWelcomePublisher();
		const instructorORMEntity = new InstructorORMEntity();
		const userRepository = new UserRepositoryImpl();
		userRepository.postgresqlRepository = this._postgresqlRepository;

		const userId = await userRepository.createInstructor();
		const password = await this._passwordChecker
			.generateHash(instructor.password);

		instructorORMEntity.created_by = userId;
		instructorORMEntity.email = instructor.email;
		instructorORMEntity.first_name = instructor.firstName;
		instructorORMEntity.id = instructor.id;
		instructorORMEntity.last_modified_by = userId;
		instructorORMEntity.last_name = instructor.lastName;
		instructorORMEntity.password = password;
		instructorORMEntity.signup_method =
			InstructorSignupMethods.emailPassword;
		instructorORMEntity.user_id = userId;
		instructorORMEntity.version = 1;

		await this._postgresqlRepository
			.add<InstructorORMEntity, InstructorCreationAttributes>(
				this._modelName,
				instructorORMEntity
			);

		instructorCreatedPublisher.pushMessage({
			email: instructorORMEntity.email,
			firstName: instructorORMEntity.first_name,
			id: instructorORMEntity.id,
			lastName: instructorORMEntity.last_name,
			userId: instructorORMEntity.user_id,
			version: instructorORMEntity.version
		});

		await instructorCreatedPublisher.publish();

		await instructorWelcomePublisher.pushMessage({
			email: instructorORMEntity.email,
			firstName: instructorORMEntity.first_name,
			id: instructorORMEntity.id,
			lastName: instructorORMEntity.last_name,
			userId: instructorORMEntity.user_id,
			version: instructorORMEntity.version
		});

		await instructorWelcomePublisher.publish();

		const instructorEntity = this._getEntity(instructorORMEntity);

		return instructorEntity;
	}

	async signInWithEmail(
		email: string,
		password: string
	): Promise<{ isValidCredentials: boolean }> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const instructorORMEntity = await this._getUserWithEmail(email);
		if (!instructorORMEntity)
			return { isValidCredentials: false };

		if (!instructorORMEntity.password)
			throw new GenericError({
				code: ErrorCodes.instructorMaySignupWithGmail,
				error: new Error("Previously, You may have logged in using gmail"),
				errorCode: 400
			});

		const isValidPassowrd = await this._passwordChecker
			.isMatch(password, instructorORMEntity.password);

		if (!isValidPassowrd)
			return { isValidCredentials: false };

		return { isValidCredentials: true };
	}

	async getUserWithEmail(email: string): Promise<InstructorEntity> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const instructorORMEntity = await this._getUserWithEmail(email);
		if (!instructorORMEntity)
			throw new GenericError({
				code: ErrorCodes.instructorNotFound,
				error: new Error("Instructor not found"),
				errorCode: 404
			});

		const instructorEntity = this._getEntity(instructorORMEntity);

		return instructorEntity;
	}

	private async _isInstructorAlreadyExistsWithEmail(
		email: string
	): Promise<boolean> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const instructorORMEntity = await this._postgresqlRepository
			.findOne<InstructorORMEntity>(
				this._modelName,
				{
					email: email
				}
			);

		if (!instructorORMEntity) return false;

		return true;
	}

	private async _getUserWithEmail(
		email: string
	): Promise<InstructorORMEntity | null> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const instructorORMEntity = await this._postgresqlRepository
			.findOne<InstructorORMEntity>(
				this._modelName,
				{
					email: email
				}
			);

		return instructorORMEntity;
	}

	private _getEntity(
		instructorORMEntity: InstructorORMEntity
	): InstructorEntity {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const instructorEntity = this._instructorFactory.make("InstructorEntity") as InstructorEntity;
		instructorEntity.email = instructorORMEntity.email;
		instructorEntity.firstName = instructorORMEntity.first_name;
		instructorEntity.id = instructorORMEntity.id;
		instructorEntity.lastName = instructorORMEntity.last_name;
		instructorEntity.password = instructorORMEntity.password;
		instructorEntity.profilePicture = instructorORMEntity.profile_picture;

		return instructorEntity;
	}
}