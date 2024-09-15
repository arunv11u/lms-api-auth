import { getStudentFactory } from "../../../global-config";
import { UserRepositoryImpl } from "../../../user";
import { ErrorCodes, GenericError, PasswordChecker, PasswordCheckerImpl, PostgresqlRepository } from "../../../utils";
import { StudentEntity, StudentObject, StudentRepository } from "../../domain";
import { StudentFactory } from "../../factory";
import { StudentCreatedPublisher } from "../messaging";
import { StudentCreationAttributes, StudentORMEntity } from "./student.orm-entity";



export class StudentRepositoryImpl implements StudentRepository, StudentObject {
	private _modelName = "Student";
	private _postgresqlRepository: PostgresqlRepository | null = null;
	private _studentFactory: StudentFactory;
	private _passwordChecker: PasswordChecker;

	constructor() {
		this._studentFactory = getStudentFactory();
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

		if (await this._isStudentAlreadyExists(student))
			throw new GenericError({
				code: ErrorCodes.studentAlreadyExists,
				error: new Error("Student already exists"),
				errorCode: 400
			});

		const studentCreatedPublisher = new StudentCreatedPublisher();
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

		const studentEntity = this._studentFactory.make("StudentEntity") as StudentEntity;
		studentEntity.email = studentORMEntity.email;
		studentEntity.firstName = studentORMEntity.first_name;
		studentEntity.id = studentORMEntity.id;
		studentEntity.lastName = studentORMEntity.last_name;
		studentEntity.password = studentORMEntity.password;

		return studentEntity;
	}

	private async _isStudentAlreadyExists(
		student: StudentEntity
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
					email: student.email
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

	private async _getEntity(
		studentORMEntity: StudentORMEntity
	): Promise<StudentEntity> {
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

		return studentEntity;
	}
}