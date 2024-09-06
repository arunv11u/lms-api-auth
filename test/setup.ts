/* eslint-disable no-console */
import dotenv from "dotenv";
import { DefaultConfig, Environment } from "../src/utils/types";
import { config, testConfig } from "../src/utils/config";
import { winstonLogger } from "../src/utils/winston";




beforeAll(async () => {
	dotenv.config({ path: ".env.test" });

	const _environment = process.env.NODE_ENV as Environment;
	const _config: DefaultConfig = {
		prodConfig: {},
		testConfig: testConfig
	};
	config.set(_environment, _config);

	winstonLogger.start(
		_environment
	);
});
