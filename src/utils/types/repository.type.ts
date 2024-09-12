import { PostgresqlRepository } from "./postgresql-connect";


export abstract class Repository {
	abstract set postgresqlRepository(
		postgresqlRepository: PostgresqlRepository
	);
}