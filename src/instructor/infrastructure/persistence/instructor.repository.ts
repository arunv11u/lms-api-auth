/* eslint-disable max-lines */
import { getInstructorFactory } from "../../../global-config";
import { UserRepositoryImpl } from "../../../user";
import {
	ErrorCodes,
	GenericError,
	getAlphaNumericCharacters,
	getUUIDV4,
	GoogleOAuthApi,
	GoogleOAuthApiImpl,
	JSONWebToken,
	JSONWebTokenImpl,
	PasswordChecker,
	PasswordCheckerImpl,
	PostgresqlRepository
} from "../../../utils";
import { 
	InstructorEntity, 
	InstructorObject, 
	InstructorRepository 
} from "../../domain";
import { InstructorFactory } from "../../factory";
import { 
	InstructorCreatedPublisher, 
	InstructorForgotPasswordPublisher, 
	InstructorWelcomePublisher 
} from "../messaging";
import { InstructorForgotPasswordRepositoryImpl } from "./instructor-forgot-password.repository";
import { 
	InstructorCreationAttributes, 
	InstructorORMEntity, 
	InstructorSignupMethods 
} from "./instructor.orm-entity";



export class InstructorRepositoryImpl implements
	InstructorRepository, InstructorObject {
	private _modelName = "Instructor";
	private _postgresqlRepository: PostgresqlRepository | null = null;
	private _instructorFactory: InstructorFactory;
	private _passwordChecker: PasswordChecker;
	private _googleOAuthApi: GoogleOAuthApi;
	private _jsonWebToken: JSONWebToken;


	constructor() {
		this._instructorFactory = getInstructorFactory();
		this._passwordChecker = new PasswordCheckerImpl();
		this._googleOAuthApi = new GoogleOAuthApiImpl();
		this._jsonWebToken = new JSONWebTokenImpl();
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

	async registerInstructorWithGoogleOAuth(
		authCode: string,
		redirectUri: string
	): Promise<InstructorEntity> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const { id_token } = await this._googleOAuthApi
			.getTokens(authCode, redirectUri);

		const {
			email,
			firstName,
			lastName
		} = this._jsonWebToken.decodeGoogleOAuthIdToken(id_token);

		const isInstructorAlreadyExists =
			await this._isInstructorAlreadyExistsWithEmail(email);

		if (isInstructorAlreadyExists) {
			const instructorORMEntity =
				await this._getUserWithEmail(email) as InstructorORMEntity;

			const instructorEntity = this._getEntity(instructorORMEntity);

			return instructorEntity;
		}

		const userRepository = new UserRepositoryImpl();
		userRepository.postgresqlRepository = this._postgresqlRepository;

		const userId = await userRepository.createInstructor();

		const instructorORMEntity = new InstructorORMEntity();
		instructorORMEntity.created_by = userId;
		instructorORMEntity.email = email;
		instructorORMEntity.first_name = firstName;
		instructorORMEntity.id = this._postgresqlRepository.getId();
		instructorORMEntity.last_modified_by = userId;
		instructorORMEntity.last_name = lastName;
		instructorORMEntity.signup_method = InstructorSignupMethods.googleOAuth;
		instructorORMEntity.user_id = userId;
		instructorORMEntity.version = 1;

		await this._postgresqlRepository
			.add<InstructorORMEntity, InstructorCreationAttributes>(
				this._modelName,
				instructorORMEntity
			);


		const instructorCreatedPublisher = new InstructorCreatedPublisher();

		instructorCreatedPublisher.pushMessage({
			email: instructorORMEntity.email,
			firstName: instructorORMEntity.first_name,
			id: instructorORMEntity.id,
			lastName: instructorORMEntity.last_name,
			userId: instructorORMEntity.user_id,
			version: instructorORMEntity.version
		});

		await instructorCreatedPublisher.publish();

		const instructorWelcomePublisher = new InstructorWelcomePublisher();

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

	async forgotInstructorPassword(email: string): Promise<void> {
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
				error: new Error("Instructor not found with the email address"),
				errorCode: 404
			});

		if (instructorORMEntity.signup_method !==
			InstructorSignupMethods.emailPassword)
			throw new GenericError({
				code: ErrorCodes.instructorSignupMethodDoesNotMatch,
				error: new Error("Instructor signup method does not match, instructor may have signed up with Google Signin"),
				errorCode: 400
			});

		const instructorForgotPasswordRepository =
			new InstructorForgotPasswordRepositoryImpl(
				this._postgresqlRepository
			);
		const instructorForgotPasswordPublisher =
			new InstructorForgotPasswordPublisher();

		const studentForgotPasswordEventId = getUUIDV4();
		const verificationCode = getAlphaNumericCharacters(4);

		await instructorForgotPasswordRepository
			.saveForgotPasswordEntry(
				instructorORMEntity.user_id,
				verificationCode
			);

		instructorForgotPasswordPublisher.pushMessage({
			email: instructorORMEntity.email,
			firstName: instructorORMEntity.first_name,
			id: studentForgotPasswordEventId,
			lastName: instructorORMEntity.last_name,
			userId: instructorORMEntity.user_id,
			verificationCode: verificationCode,
			version: instructorORMEntity.version
		});

		await instructorForgotPasswordPublisher.publish();
	}

	async resetInstructorPassword(
		email: string,
		verificationCode: string,
		password: string
	): Promise<void> {
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
				error: new Error("Instructor not found with the email address"),
				errorCode: 404
			});

		if (instructorORMEntity.signup_method !==
			InstructorSignupMethods.emailPassword)
			throw new GenericError({
				code: ErrorCodes.instructorSignupMethodDoesNotMatch,
				error: new Error("Instructor signup method does not match, student may have signed up with Google Signin"),
				errorCode: 400
			});

		const instructorForgotPasswordRepository =
			new InstructorForgotPasswordRepositoryImpl(
				this._postgresqlRepository
			);

		if (!await instructorForgotPasswordRepository
			.isValidVerificationCode(
				instructorORMEntity.user_id,
				verificationCode
			)
		) throw new GenericError({
			// eslint-disable-next-line max-len
			code: ErrorCodes.instructorForgotPasswordVerificationCodeDoesNotMatch,
			error: new Error("Reset Password - Verification code does not match"),
			errorCode: 400
		});

		const passwordHash = await this._passwordChecker
			.generateHash(password);

		await this._postgresqlRepository
			.update<InstructorORMEntity>(
				this._modelName,
				{
					id: instructorORMEntity.id
				},
				{
					password: passwordHash
				}
			);

		await instructorForgotPasswordRepository
			.inValidateForgotPasswordEntry(instructorORMEntity.user_id);
	}

	async getInstructorProfileById(id: string): Promise<InstructorEntity> {
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

		const instructorEntity = await this._getEntity(instructorORMEntity);

		return instructorEntity;
	}

	async getInstructorProfileByUserId(
		userId: string
	): Promise<InstructorEntity> {
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
					user_id: userId
				}
			);
		if (!instructorORMEntity)
			throw new GenericError({
				code: ErrorCodes.instructorNotFound,
				error: new Error("Instructor not found"),
				errorCode: 404
			});

		const instructorEntity = this._getEntity(instructorORMEntity);

		return instructorEntity;
	}

	async changeInstructorPassword(
		id: string,
		password: string
	): Promise<void> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const passwordHash = await this._passwordChecker.generateHash(password);

		await this._postgresqlRepository.update<InstructorORMEntity>(
			this._modelName,
			{
				id: id
			},
			{
				password: passwordHash
			}
		);
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