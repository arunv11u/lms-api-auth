import { Express } from "express";
import nconf from "nconf";
import { mongoDBConnect } from "@arunvaradharajalu/common.mongodb-api";
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
	winstonLogger
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

		mongoDBConnect.url = nconf.get("mongodbURL");
		mongoDBConnect.username = nconf.get("mongodbUsername");
		mongoDBConnect.password = nconf.get("mongodbPassword");
		mongoDBConnect.dbName = nconf.get("mongodbDatabaseName");

		// mongoDBConnect.init();
		// await mongoDBConnect.connect();

		routes.listen(app);

		return true;
	}
}
