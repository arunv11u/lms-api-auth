import { DatabaseConnectionError } from "@arunvaradharajalu/common.errors";
import { Sequelize } from "sequelize";
import { DbConnect } from "../types";



class PostgresqlConnectImpl implements DbConnect {

	private _url: string | null = null;
	private _dbName: string | null = null;
	private _username: string | null = null;
	private _password: string | null = null;
	private _postgresClient: Sequelize | null = null;


	set url(url: string) {
		this._url = url;
	}

	set dbName(dbName: string) {
		this._dbName = dbName;
	}

	set username(userName: string) {
		this._username = userName;
	}

	set password(password: string) {
		this._password = password;
	}

	init(): void {
		if (!this._url)
			throw new DatabaseConnectionError("Url is not set in PostgresqlConnectImpl");

		if (!this._dbName)
			throw new DatabaseConnectionError("Database Name is not set in PostgresqlConnectImpl");

		if (!this._username)
			throw new DatabaseConnectionError("Database username is not set in PostgresqlConnectImpl");

		if (!this._password)
			throw new DatabaseConnectionError("Database password is not set in PostgresqlConnectImpl");

		this._postgresClient = new Sequelize(this._url, {
			database: this._dbName,
			username: this._username,
			password: this._password,
			dialect: "postgres",
			dialectOptions: {
				ssl: {
					require: true
				}
			}
		});
	}

	async connect(): Promise<void> {

		if (!this._postgresClient)
			throw new DatabaseConnectionError("Postgres client not set, should call init method before connect");

		try {
			await this._postgresClient.authenticate();
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error in db connect ::", error);

			throw new DatabaseConnectionError("Error, connecting to the database");
		}
	}
}

const postgresqlConnect = new PostgresqlConnectImpl();

export {
	postgresqlConnect,
	PostgresqlConnectImpl
};
