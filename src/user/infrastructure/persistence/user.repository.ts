import {
	ErrorCodes,
	GenericError,
	PostgresqlRepository
} from "../../../utils";
import { UserCreationAttributes, UserORMEntity, UserTypes } from "./user.orm-entity";



export class UserRepositoryImpl {
	private _modelName = "User";
	private _postgresqlRepository: PostgresqlRepository | null = null;

	constructor() { }

	set postgresqlRepository(postgresqlRepository: PostgresqlRepository) {
		this._postgresqlRepository = postgresqlRepository;
	}

	async createStudent(): Promise<string> {
		if (!this._postgresqlRepository)
			throw new GenericError({
				code: ErrorCodes.postgresqlRepositoryDoesNotExist,
				error: new Error("Postgresql repository does not exist"),
				errorCode: 500
			});

		const userId = this._postgresqlRepository.getId();

		const userORMEntity = new UserORMEntity();
		userORMEntity.created_by = userId;
		userORMEntity.id = userId;
		userORMEntity.last_modified_by = userId;
		userORMEntity.type = UserTypes.student;
		userORMEntity.version = 1;

		await this._postgresqlRepository
			.add<UserORMEntity, UserCreationAttributes>(
				this._modelName,
				userORMEntity
			);

		return userId;
	}
}