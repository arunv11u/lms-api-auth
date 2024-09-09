import { Sequelize } from "sequelize";


abstract class PostgresqlConnect {
	abstract set url(url: string);

	abstract set dbName(dbName: string);

	abstract set username(username: string);

	abstract set password(password: string);

	abstract get postgresClient(): Sequelize;

	abstract init(): void;

	abstract connect(): Promise<void>;
}

export {
	PostgresqlConnect
};