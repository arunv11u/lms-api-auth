

abstract class DbConnect {
	abstract set url(url: string);

	abstract set dbName(dbName: string);

	abstract set username(username: string);

	abstract set password(password: string);

	abstract init(): void;

	abstract connect(): Promise<void>;
}

export {
	DbConnect
};