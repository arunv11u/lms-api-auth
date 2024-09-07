import { Express } from "express";
import nconf from "nconf";
import {
	DefaultConfig,
	Environment,
	Loader,
	LogPath,
	config,
	devConfig,
	prodConfig,
	stagingConfig,
	testConfig,
	unhandledErrorHandler,
	winstonLogger,
	postgresqlConnect
} from "./utils";
import { routes } from "./routes";



export class LoaderImpl implements Loader {

	async load(app: Express): Promise<boolean> {

		const _environment = process.env.NODE_ENV as Environment;

		const _config: DefaultConfig = {
			devConfig,
			prodConfig,
			stagingConfig,
			testConfig
		};

		unhandledErrorHandler();

		config.set(_environment, _config);

		let logPath: LogPath | null = null;
		if (_environment === Environment.PRODUCTION ||
			_environment === Environment.STAGING)
			logPath = {
				combinedLogPath: nconf.get("combinedLogPath"),
				errorLogPath: nconf.get("errorLogPath")
			};

		winstonLogger.start(
			_environment,
			logPath
		);

		postgresqlConnect.url = nconf.get("postgresURL");
		postgresqlConnect.username = nconf.get("POSTGRES_USERNAME");
		postgresqlConnect.password = nconf.get("POSTGRES_PASSWORD");
		postgresqlConnect.dbName = nconf.get("postgresDatabaseName");

		postgresqlConnect.init();
		await postgresqlConnect.connect();

		routes.listen(app);

		return true;
	}
}
