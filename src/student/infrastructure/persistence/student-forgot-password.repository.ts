import { ErrorCodes, GenericError, PostgresqlRepository } from "../../../utils";
import { StudentForgotPasswordCreationAttributes, StudentForgotPasswordORMEntity } from "./student-forgot-password.orm-entity";



export class StudentForgotPasswordRepositoryImpl {
	private _modelName = "StudentForgotPassword";
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

		const studentForgotPasswordORMEntity =
			new StudentForgotPasswordORMEntity();
		studentForgotPasswordORMEntity.created_by = userId;
		studentForgotPasswordORMEntity.id = this._postgresqlRepository.getId();
		studentForgotPasswordORMEntity.is_valid = true;
		studentForgotPasswordORMEntity.last_modified_by = userId;
		studentForgotPasswordORMEntity.user_id = userId;
		studentForgotPasswordORMEntity.verification_code = verificationCode;
		studentForgotPasswordORMEntity.version = 1;

		await this._postgresqlRepository
			.add<
				StudentForgotPasswordORMEntity,
				StudentForgotPasswordCreationAttributes
			>(this._modelName, studentForgotPasswordORMEntity);
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
			.findOne<StudentForgotPasswordORMEntity>(
				this._modelName,
				{ user_id: userId },
				{
					order: [["created_at", "DESC"]]
				}
			);
		if (!forgotPasswordEntry)
			throw new GenericError({
				code: ErrorCodes.studentForgotPasswordEntryDoesNotExist,
				error: new Error("Student did not request for reset password"),
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
			.update<StudentForgotPasswordORMEntity>(
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