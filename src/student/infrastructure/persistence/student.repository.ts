/* eslint-disable max-lines */
import nconf from "nconf";
import { getStudentFactory } from "../../../global-config";
import { UserRepositoryImpl } from "../../../user";
import {
	ErrorCodes,
	GenericError,
	getAlphaNumericCharacters,
	getExtensionFromMimeType,
	getS3Storage,
	getUUIDV4,
	GoogleOAuthApi,
	GoogleOAuthApiImpl,
	JSONWebToken,
	JSONWebTokenImpl,
	PasswordChecker,
	PasswordCheckerImpl,
	PostgresqlRepository,
	UploadPreSignedURLResponse
} from "../../../utils";
import { StudentEntity, StudentObject, StudentRepository } from "../../domain";
import { StudentFactory } from "../../factory";
import { StudentCreatedPublisher, StudentForgotPasswordPublisher, StudentUpdatedPublisher, StudentWelcomePublisher } from "../messaging";
import { StudentForgotPasswordRepositoryImpl } from "./student-forgot-password.repository";
import { StudentSignupMethods, StudentCreationAttributes, StudentORMEntity } from "./student.orm-entity";



export class StudentRepositoryImpl implements StudentRepository, StudentObject {
	private _modelName = "Student";
	private _postgresqlRepository: PostgresqlRepository | null = null;
	private _studentFactory: StudentFactory;
	private _passwordChecker: PasswordChecker;
	private _googleOAuthApi: GoogleOAuthApi;
	private _jsonWebToken: JSONWebToken;

	constructor() {
		this._studentFactory = getStudentFactory();
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

	async getUserIdWithStudentId(id: string): Promise<string> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const studentORMEntity = await this._postgresqlRepository
			.get<StudentORMEntity>(
				this._modelName,
				id
			);
		if (!studentORMEntity)
			throw new GenericError({
				code: ErrorCodes.studentNotFound,
				error: new Error("Student not found"),
				errorCode: 404
			});

		return studentORMEntity.user_id;
	}

	async register(student: StudentEntity): Promise<StudentEntity> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		if (!student.password)
			throw new GenericError({
				code: ErrorCodes.studentPasswordNotExists,
				error: new Error("Student password does not exist"),
				errorCode: 400
			});

		if (await this._isStudentAlreadyExistsWithEmail(student.email))
			throw new GenericError({
				code: ErrorCodes.studentAlreadyExists,
				error: new Error("Student already exists"),
				errorCode: 400
			});

		const studentCreatedPublisher = new StudentCreatedPublisher();
		const studentWelcomePublisher = new StudentWelcomePublisher();
		const studentORMEntity = new StudentORMEntity();
		const userRepository = new UserRepositoryImpl();
		userRepository.postgresqlRepository = this._postgresqlRepository;

		const userId = await userRepository.createStudent();
		const password = await this._passwordChecker
			.generateHash(student.password);

		studentORMEntity.created_by = userId;
		studentORMEntity.email = student.email;
		studentORMEntity.first_name = student.firstName;
		studentORMEntity.id = student.id;
		studentORMEntity.last_modified_by = userId;
		studentORMEntity.last_name = student.lastName;
		studentORMEntity.password = password;
		studentORMEntity.signup_method = StudentSignupMethods.emailPassword;
		studentORMEntity.user_id = userId;
		studentORMEntity.version = 1;

		await this._postgresqlRepository
			.add<StudentORMEntity, StudentCreationAttributes>(
				this._modelName,
				studentORMEntity
			);


		studentCreatedPublisher.pushMessage({
			email: studentORMEntity.email,
			firstName: studentORMEntity.first_name,
			id: studentORMEntity.id,
			lastName: studentORMEntity.last_name,
			userId: studentORMEntity.user_id,
			version: studentORMEntity.version
		});

		await studentCreatedPublisher.publish();

		await studentWelcomePublisher.pushMessage({
			email: studentORMEntity.email,
			firstName: studentORMEntity.first_name,
			id: studentORMEntity.id,
			lastName: studentORMEntity.last_name,
			userId: studentORMEntity.user_id,
			version: studentORMEntity.version
		});

		await studentWelcomePublisher.publish();

		const studentEntity = this._getEntity(studentORMEntity);

		return studentEntity;
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

		const studentORMEntity = await this._getUserWithEmail(email);
		if (!studentORMEntity)
			return { isValidCredentials: false };

		if (!studentORMEntity.password)
			throw new GenericError({
				code: ErrorCodes.studentMaySignupWithGmail,
				error: new Error("Previously, You may have logged in using gmail"),
				errorCode: 400
			});

		const isValidPassowrd = await this._passwordChecker
			.isMatch(password, studentORMEntity.password);

		if (!isValidPassowrd)
			return { isValidCredentials: false };

		return { isValidCredentials: true };
	}

	async getUserWithEmail(email: string): Promise<StudentEntity> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const studentORMEntity = await this._getUserWithEmail(email);
		if (!studentORMEntity)
			throw new GenericError({
				code: ErrorCodes.studentNotFound,
				error: new Error("Student not found"),
				errorCode: 404
			});

		const studentEntity = this._getEntity(studentORMEntity);

		return studentEntity;
	}

	async registerStudentWithGoogleOAuth(
		authCode: string,
		redirectUri: string
	): Promise<StudentEntity> {
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

		const isStudentAlreadyExists =
			await this._isStudentAlreadyExistsWithEmail(email);

		if (isStudentAlreadyExists) {
			const studentORMEntity =
				await this._getUserWithEmail(email) as StudentORMEntity;

			const studentEntity = this._getEntity(studentORMEntity);

			return studentEntity;
		}

		const userRepository = new UserRepositoryImpl();
		userRepository.postgresqlRepository = this._postgresqlRepository;

		const userId = await userRepository.createStudent();

		const studentORMEntity = new StudentORMEntity();
		studentORMEntity.created_by = userId;
		studentORMEntity.email = email;
		studentORMEntity.first_name = firstName;
		studentORMEntity.id = this._postgresqlRepository.getId();
		studentORMEntity.last_modified_by = userId;
		studentORMEntity.last_name = lastName;
		studentORMEntity.signup_method = StudentSignupMethods.googleOAuth;
		studentORMEntity.user_id = userId;
		studentORMEntity.version = 1;

		await this._postgresqlRepository
			.add<StudentORMEntity, StudentCreationAttributes>(
				this._modelName,
				studentORMEntity
			);


		const studentCreatedPublisher = new StudentCreatedPublisher();

		studentCreatedPublisher.pushMessage({
			email: studentORMEntity.email,
			firstName: studentORMEntity.first_name,
			id: studentORMEntity.id,
			lastName: studentORMEntity.last_name,
			userId: studentORMEntity.user_id,
			version: studentORMEntity.version
		});

		await studentCreatedPublisher.publish();

		const studentWelcomePublisher = new StudentWelcomePublisher();

		await studentWelcomePublisher.pushMessage({
			email: studentORMEntity.email,
			firstName: studentORMEntity.first_name,
			id: studentORMEntity.id,
			lastName: studentORMEntity.last_name,
			userId: studentORMEntity.user_id,
			version: studentORMEntity.version
		});

		await studentWelcomePublisher.publish();

		const studentEntity = this._getEntity(studentORMEntity);

		return studentEntity;
	}

	async forgotStudentPassword(email: string): Promise<void> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const studentORMEntity = await this._getUserWithEmail(email);

		if (!studentORMEntity)
			throw new GenericError({
				code: ErrorCodes.studentNotFound,
				error: new Error("Student not found with the email address"),
				errorCode: 404
			});

		if (studentORMEntity.signup_method !==
			StudentSignupMethods.emailPassword)
			throw new GenericError({
				code: ErrorCodes.studentSignupMethodDoesNotMatch,
				error: new Error("Student signup method does not match, student may have signed up with Google Signin"),
				errorCode: 400
			});

		const studentForgotPasswordRepository =
			new StudentForgotPasswordRepositoryImpl(this._postgresqlRepository);
		const studentForgotPasswordPublisher =
			new StudentForgotPasswordPublisher();

		const studentForgotPasswordEventId = getUUIDV4();
		const verificationCode = getAlphaNumericCharacters(4);

		await studentForgotPasswordRepository
			.saveForgotPasswordEntry(
				studentORMEntity.user_id,
				verificationCode
			);

		studentForgotPasswordPublisher.pushMessage({
			email: studentORMEntity.email,
			firstName: studentORMEntity.first_name,
			id: studentForgotPasswordEventId,
			lastName: studentORMEntity.last_name,
			userId: studentORMEntity.user_id,
			verificationCode: verificationCode,
			version: studentORMEntity.version
		});

		await studentForgotPasswordPublisher.publish();
	}

	async resetStudentPassword(
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

		const studentORMEntity = await this._getUserWithEmail(email);

		if (!studentORMEntity)
			throw new GenericError({
				code: ErrorCodes.studentNotFound,
				error: new Error("Student not found with the email address"),
				errorCode: 404
			});

		if (studentORMEntity.signup_method !==
			StudentSignupMethods.emailPassword)
			throw new GenericError({
				code: ErrorCodes.studentSignupMethodDoesNotMatch,
				error: new Error("Student signup method does not match, student may have signed up with Google Signin"),
				errorCode: 400
			});

		const studentForgotPasswordRepository =
			new StudentForgotPasswordRepositoryImpl(this._postgresqlRepository);

		if (!await studentForgotPasswordRepository
			.isValidVerificationCode(
				studentORMEntity.user_id,
				verificationCode
			)
		) throw new GenericError({
			code: ErrorCodes.studentForgotPasswordVerificationCodeDoesNotMatch,
			error: new Error("Reset Password - Verification code does not match"),
			errorCode: 400
		});

		const passwordHash = await this._passwordChecker
			.generateHash(password);

		await this._postgresqlRepository
			.update<StudentORMEntity>(
				this._modelName,
				{
					id: studentORMEntity.id
				},
				{
					password: passwordHash
				}
			);

		await studentForgotPasswordRepository
			.inValidateForgotPasswordEntry(studentORMEntity.user_id);
	}

	async getStudentProfileById(id: string): Promise<StudentEntity> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const studentORMEntity = await this._postgresqlRepository
			.get<StudentORMEntity>(
				this._modelName,
				id
			);
		if (!studentORMEntity)
			throw new GenericError({
				code: ErrorCodes.studentNotFound,
				error: new Error("Student not found"),
				errorCode: 404
			});

		const studentEntity = await this._getEntity(studentORMEntity);

		return studentEntity;
	}

	async getStudentProfileByUserId(userId: string): Promise<StudentEntity> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const studentORMEntity = await this._postgresqlRepository
			.findOne<StudentORMEntity>(
				this._modelName,
				{
					user_id: userId
				}
			);
		if (!studentORMEntity)
			throw new GenericError({
				code: ErrorCodes.studentNotFound,
				error: new Error("Student not found"),
				errorCode: 404
			});

		const studentEntity = this._getEntity(studentORMEntity);

		return studentEntity;
	}

	async changeStudentPassword(
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

		await this._postgresqlRepository.update<StudentORMEntity>(
			this._modelName,
			{
				id: id
			},
			{
				password: passwordHash
			}
		);
	}

	async uploadStudentProfilePicture(
		id: string,
		mimeType: string
	): Promise<UploadPreSignedURLResponse> {
		const extension = getExtensionFromMimeType(mimeType);
		const filename = `${getUUIDV4()}.${extension}`;
		const filePath = `public/users/${id}/profile-picture/${filename}`;
		const s3Storage = getS3Storage(nconf.get("s3BucketName"));

		const response = await s3Storage
			.getPreSignedUrlForUploading(filePath, 300, 2 * 1024 * 1024);

		return response;
	}

	async updateStudentProfile(student: StudentEntity): Promise<StudentEntity> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const studentORMEntity = new StudentORMEntity();

		if (student.firstName) studentORMEntity.first_name = student.firstName;
		if (student.lastName) studentORMEntity.last_name = student.lastName;
		if (student.profilePicture)
			studentORMEntity.profile_picture = student.profilePicture;

		const postgresClient = this._postgresqlRepository.getPostgresClient();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		studentORMEntity.version = postgresClient.literal("version + 1") as any;

		const updatedStudentORMEntity = await this._postgresqlRepository
			.findOneAndUpdate<StudentORMEntity>(
				this._modelName,
				{
					id: student.id
				},
				studentORMEntity
			);

		if (!updatedStudentORMEntity)
			throw new GenericError({
				code: ErrorCodes.studentNotFound,
				error: new Error("Student not found"),
				errorCode: 404
			});

		const studentUpdatedPublisher = new StudentUpdatedPublisher();

		studentUpdatedPublisher.pushMessage({
			email: updatedStudentORMEntity.email,
			firstName: updatedStudentORMEntity.first_name,
			id: updatedStudentORMEntity.id,
			lastName: updatedStudentORMEntity.last_name,
			profilePicture: updatedStudentORMEntity.profile_picture,
			userId: updatedStudentORMEntity.user_id,
			version: updatedStudentORMEntity.version
		});

		await studentUpdatedPublisher.publish();

		return this._getEntity(updatedStudentORMEntity);
	}

	private async _isStudentAlreadyExistsWithEmail(
		email: string
	): Promise<boolean> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const studentORMEntity = await this._postgresqlRepository
			.findOne<StudentORMEntity>(
				this._modelName,
				{
					email: email
				}
			);

		if (!studentORMEntity) return false;

		return true;
	}

	private async _getUserWithEmail(
		email: string
	): Promise<StudentORMEntity | null> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const studentORMEntity = await this._postgresqlRepository
			.findOne<StudentORMEntity>(
				this._modelName,
				{
					email: email
				}
			);

		return studentORMEntity;
	}

	private _getEntity(
		studentORMEntity: StudentORMEntity
	): StudentEntity {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const studentEntity = this._studentFactory.make("StudentEntity") as StudentEntity;
		studentEntity.email = studentORMEntity.email;
		studentEntity.firstName = studentORMEntity.first_name;
		studentEntity.id = studentORMEntity.id;
		studentEntity.lastName = studentORMEntity.last_name;
		studentEntity.password = studentORMEntity.password;
		studentEntity.profilePicture = studentORMEntity.profile_picture;

		return studentEntity;
	}
}