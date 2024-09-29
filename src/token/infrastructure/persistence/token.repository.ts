/* eslint-disable max-lines */
import nconf from "nconf";
import { Authorization } from "@arunvaradharajalu/common.learning-management-system-api.authorization";
import {
	ErrorCodes,
	GenericError,
	getAuthorization,
	JSONWebToken,
	JSONWebTokenImpl,
	JWTPayload,
	PostgresqlRepository
} from "../../../utils";
import { getInstructorFactory, getStudentFactory } from "../../../global-config";
import { StudentEntity, StudentFactory, StudentRepository } from "../../../student";
import { TokenObject, TokenRepository } from "../../domain";
import { TokenCreationAttributes, TokenORMEntity, TokenTypes, UserTypes } from "./token.orm-entity";
import { InstructorEntity, InstructorFactory, InstructorRepository } from "../../../instructor";


export class TokenRepositoryImpl implements TokenRepository, TokenObject {
	private _modelName = "Token";
	private _jsonWebToken: JSONWebToken;
	private _postgresqlRepository: PostgresqlRepository | null = null;
	private _studentFactory: StudentFactory;
	private _instructorFactory: InstructorFactory;
	private _authorization: Authorization;

	constructor() {
		this._jsonWebToken = new JSONWebTokenImpl();
		this._studentFactory = getStudentFactory();
		this._instructorFactory = getInstructorFactory();
		this._authorization = getAuthorization();
	}

	set postgresqlRepository(postgresqlRepository: PostgresqlRepository) {
		this._postgresqlRepository = postgresqlRepository;
	}

	async createAccessTokenForStudent(
		sessionId: string,
		student: StudentEntity
	): Promise<string> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const secretKey = nconf.get("JWT_PRIVATE_KEY");
		const accessTokenExpiration = nconf.get("accessTokenExpiration");

		const studentRepository = this._studentFactory.make("StudentRepository") as StudentRepository;
		studentRepository.postgresqlRepository = this._postgresqlRepository;

		const userId = await studentRepository
			.getUserIdWithStudentId(student.id);

		const jwtPayload = new JWTPayload();
		jwtPayload.user = userId;
		jwtPayload.type = UserTypes.student;
		jwtPayload.sessionId = sessionId;

		const token = await this._jsonWebToken
			.sign(
				JSON.parse(JSON.stringify(jwtPayload)),
				secretKey,
				{ expiresIn: accessTokenExpiration }
			);

		return token;
	}

	async createRefreshTokenForStudent(
		sessionId: string,
		student: StudentEntity
	): Promise<string> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const studentRepository = this._studentFactory.make("StudentRepository") as StudentRepository;
		studentRepository.postgresqlRepository = this._postgresqlRepository;

		const userId = await studentRepository
			.getUserIdWithStudentId(student.id);

		const refreshTokenExpiration = nconf.get("refreshTokenExpiration");
		const refreshToken = this._postgresqlRepository.getId();

		const tokenORMEntity = new TokenORMEntity();
		tokenORMEntity.created_by = userId;
		tokenORMEntity.id = refreshToken;
		tokenORMEntity.is_deleted = false;
		tokenORMEntity.last_modified_by = userId;
		tokenORMEntity.session_id = sessionId;
		tokenORMEntity.type = TokenTypes.refresh;
		tokenORMEntity.token_expire_on = new Date(
			new Date()
				.setSeconds(new Date().getSeconds() + refreshTokenExpiration)
		);
		tokenORMEntity.user_id = userId;
		tokenORMEntity.user_type = UserTypes.student;
		tokenORMEntity.version = 1;

		await this._postgresqlRepository
			.add<TokenORMEntity, TokenCreationAttributes>(
				this._modelName,
				tokenORMEntity
			);

		return refreshToken;
	}

	async validateStudentAuthorizationToken(
		authorizationToken: string
	): Promise<StudentEntity> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const payload = await this._authorization
			.validate(authorizationToken);

		const jwtPayload = new JWTPayload();
		jwtPayload.sessionId = payload.sessionId;
		jwtPayload.type = payload.type;
		jwtPayload.user = payload.user;

		const studentRepository = this._studentFactory.make("StudentRepository") as StudentRepository;
		studentRepository.postgresqlRepository = this._postgresqlRepository;

		const studentEntity = await studentRepository
			.getStudentProfileByUserId(jwtPayload.user);

		return studentEntity;
	}

	async createAccessTokenForInstructor(
		sessionId: string,
		instructor: InstructorEntity
	): Promise<string> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const secretKey = nconf.get("JWT_PRIVATE_KEY");
		const accessTokenExpiration = nconf.get("accessTokenExpiration");

		const instructorRepository = this._instructorFactory.make("InstructorRepository") as InstructorRepository;
		instructorRepository.postgresqlRepository = this._postgresqlRepository;

		const userId = await instructorRepository
			.getUserIdWithInstructorId(instructor.id);

		const jwtPayload = new JWTPayload();
		jwtPayload.user = userId;
		jwtPayload.type = UserTypes.instructor;
		jwtPayload.sessionId = sessionId;

		const token = await this._jsonWebToken
			.sign(
				JSON.parse(JSON.stringify(jwtPayload)),
				secretKey,
				{ expiresIn: accessTokenExpiration }
			);

		return token;
	}

	async createRefreshTokenForInstructor(
		sessionId: string,
		instructor: InstructorEntity
	): Promise<string> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const instructorRepository = this._instructorFactory.make("InstructorRepository") as InstructorRepository;
		instructorRepository.postgresqlRepository = this._postgresqlRepository;

		const userId = await instructorRepository
			.getUserIdWithInstructorId(instructor.id);

		const refreshTokenExpiration = nconf.get("refreshTokenExpiration");
		const refreshToken = this._postgresqlRepository.getId();

		const tokenORMEntity = new TokenORMEntity();
		tokenORMEntity.created_by = userId;
		tokenORMEntity.id = refreshToken;
		tokenORMEntity.is_deleted = false;
		tokenORMEntity.last_modified_by = userId;
		tokenORMEntity.session_id = sessionId;
		tokenORMEntity.type = TokenTypes.refresh;
		tokenORMEntity.token_expire_on = new Date(
			new Date()
				.setSeconds(new Date().getSeconds() + refreshTokenExpiration)
		);
		tokenORMEntity.user_id = userId;
		tokenORMEntity.user_type = UserTypes.instructor;
		tokenORMEntity.version = 1;

		await this._postgresqlRepository
			.add<TokenORMEntity, TokenCreationAttributes>(
				this._modelName,
				tokenORMEntity
			);

		return refreshToken;
	}

	async validateInstructorAuthorizationToken(
		authorizationToken: string
	): Promise<InstructorEntity> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const payload = await this._authorization
			.validate(authorizationToken);

		const jwtPayload = new JWTPayload();
		jwtPayload.sessionId = payload.sessionId;
		jwtPayload.type = payload.type;
		jwtPayload.user = payload.user;

		const instructorRepository = this._instructorFactory.make("InstructorRepository") as InstructorRepository;
		instructorRepository.postgresqlRepository = this._postgresqlRepository;

		const instructorEntity = await instructorRepository
			.getInstructorProfileByUserId(jwtPayload.user);

		return instructorEntity;
	}

	async generateTokenPairWithRefreshToken(
		refreshToken: string
	): Promise<{ accessToken: string, refreshToken: string }> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const tokenORMEntity = await this._postgresqlRepository
			.findOne<TokenORMEntity>(
				this._modelName,
				{
					id: refreshToken
				}
			);

		if (!tokenORMEntity)
			throw new GenericError({
				code: ErrorCodes.refreshTokenNotFound,
				error: new Error("Refresh token not found"),
				errorCode: 404
			});

		if (tokenORMEntity.is_deleted) {
			await this._makeAllTokensInSessionInactive(
				tokenORMEntity.session_id
			);

			throw new GenericError({
				code: ErrorCodes.invalidRefreshToken,
				error: new Error("Invalid refresh token"),
				errorCode: 400
			});
		}

		// eslint-disable-next-line max-len
		const isTokenExpired = new Date(tokenORMEntity.token_expire_on).getTime() < new Date().getTime();

		if (isTokenExpired) {
			throw new GenericError({
				code: ErrorCodes.invalidRefreshToken,
				error: new Error("Invalid refresh token"),
				errorCode: 400
			});
		}


		if (tokenORMEntity.user_type === UserTypes.instructor) {
			const instructorRepository = this._instructorFactory.make("InstructorRepository") as InstructorRepository;
			instructorRepository.postgresqlRepository =
				this._postgresqlRepository;

			const instructorEntity = await instructorRepository
				.getInstructorProfileByUserId(tokenORMEntity.user_id);

			const newAccessToken = await this.createAccessTokenForInstructor(
				tokenORMEntity.session_id,
				instructorEntity
			);

			const newRefreshToken = await this.createRefreshTokenForInstructor(
				tokenORMEntity.session_id,
				instructorEntity
			);

			await this._invalidateRefreshToken(refreshToken);

			return {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken
			};
		}

		if (tokenORMEntity.user_type === UserTypes.student) {
			const studentRepository = this._studentFactory.make("StudentRepository") as StudentRepository;
			studentRepository.postgresqlRepository =
				this._postgresqlRepository;

			const studentEntity = await studentRepository
				.getStudentProfileByUserId(tokenORMEntity.user_id);

			const newAccessToken = await this.createAccessTokenForStudent(
				tokenORMEntity.session_id,
				studentEntity
			);

			const newRefreshToken = await this.createRefreshTokenForStudent(
				tokenORMEntity.session_id,
				studentEntity
			);

			await this._invalidateRefreshToken(refreshToken);

			return {
				accessToken: newAccessToken,
				refreshToken: newRefreshToken
			};
		}

		throw new GenericError({
			code: ErrorCodes.invalidUserTypeInToken,
			error: new Error("Invalid user type in token"),
			errorCode: 500
		});
	}

	private async _makeAllTokensInSessionInactive(
		sessionId: string
	): Promise<void> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		await this._postgresqlRepository.removeRange<TokenORMEntity>(
			this._modelName,
			{ session_id: sessionId }
		);
	}

	private async _invalidateRefreshToken(
		refreshToken: string
	): Promise<void> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		await this._postgresqlRepository.update<TokenORMEntity>(
			this._modelName,
			{
				id: refreshToken
			},
			{
				is_deleted: true
			}
		);
	}
}