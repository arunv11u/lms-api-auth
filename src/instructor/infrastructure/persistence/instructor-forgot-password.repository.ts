import { ErrorCodes, GenericError, PostgresqlRepository } from "../../../utils";
import {
	InstructorForgotPasswordCreationAttributes,
	InstructorForgotPasswordORMEntity
} from "./instructor-forgot-password.orm-entity";



export class InstructorForgotPasswordRepositoryImpl {
	private _modelName = "InstructorForgotPassword";
	private _postgresqlRepository: PostgresqlRepository | null = null;

	constructor(postgresqlRepository: PostgresqlRepository) {
		this._postgresqlRepository = postgresqlRepository;
	}

	async saveForgotPasswordEntry(
		userId: string,
		verificationCode: string
	): Promise<void> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const instructorForgotPasswordORMEntity =
			new InstructorForgotPasswordORMEntity();
		instructorForgotPasswordORMEntity.created_by = userId;
		instructorForgotPasswordORMEntity.id =
			this._postgresqlRepository.getId();
		instructorForgotPasswordORMEntity.is_valid = true;
		instructorForgotPasswordORMEntity.last_modified_by = userId;
		instructorForgotPasswordORMEntity.user_id = userId;
		instructorForgotPasswordORMEntity.verification_code = verificationCode;
		instructorForgotPasswordORMEntity.version = 1;

		await this._postgresqlRepository
			.add<
				InstructorForgotPasswordORMEntity,
				InstructorForgotPasswordCreationAttributes
			>(this._modelName, instructorForgotPasswordORMEntity);
	}

	async isValidVerificationCode(
		userId: string,
		verificationCode: string
	): Promise<boolean> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const forgotPasswordEntry = await this._postgresqlRepository
			.findOne<InstructorForgotPasswordORMEntity>(
				this._modelName,
				{ user_id: userId }
			);
		if (!forgotPasswordEntry)
			throw new GenericError({
				code: ErrorCodes.instructorForgotPasswordEntryDoesNotExist,
				error: new Error("Instructor did not request for reset password"),
				errorCode: 500
			});

		if (!forgotPasswordEntry.is_valid) return false;

		if (
			forgotPasswordEntry.verification_code !== verificationCode
		) return false;

		return true;
	}

	async inValidateForgotPasswordEntry(
		userId: string
	): Promise<void> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		await this._postgresqlRepository
			.update<InstructorForgotPasswordORMEntity>(
				this._modelName,
				{
					user_id: userId
				},
				{
					is_valid: false
				}
			);
	}
}