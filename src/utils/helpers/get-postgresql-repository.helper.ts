import {
	postgresqlConnect,
	PostgresqlRepositoryImpl
} from "../postgresql-api";



function getPostgresqlRepository() {
	const postgresqlRepository = new PostgresqlRepositoryImpl(
		postgresqlConnect
	);

	return postgresqlRepository;
}

export {
	getPostgresqlRepository
};