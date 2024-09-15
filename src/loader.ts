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
	postgresqlConnect,
	messagingClient
} from "./utils";
import { routes } from "./routes";
import { loadDBModels } from "./load-db-models";
import { MessagingLoaderImpl } from "./messaging-loader";



export class LoaderImpl implements Loader {

	async load(app: Express): Promise<boolean> {
		try {
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

			loadDBModels();

			const messagingLoader = new MessagingLoaderImpl();

			messagingClient.setup(true, false);
			messagingClient.brokers = [nconf.get("bootstrapKafkaBroker")];
			messagingClient.clientId = messagingLoader.clientId;
			messagingClient.producerConfig = messagingLoader.producerConfig;
			messagingClient.consumerConfig = messagingLoader.consumerConfig;
			messagingClient.listeners = messagingLoader.listeners;
			messagingClient.consumerRunConfig =
				messagingLoader.consumerRunConfig;

			messagingClient.init();
			await messagingClient.onConnect();
			await messagingClient.onSubscribe();

			routes.listen(app);

			return true;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error while starting up server :", error);
			process.exit();
		}
	}
}
