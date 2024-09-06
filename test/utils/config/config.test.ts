/* eslint-disable @typescript-eslint/no-explicit-any */
import nconf from "nconf";
import { Environment, config } from "../../../src/utils";



describe("Config Module", () => {

	describe("\"set\" method", () => {

		describe("Happy Path", () => {
			it("Testing environment and config passed has arguments, should set the process variables", () => {
				const _envConfig = { port: 8080, secretKey: "secret" };

				config.set(
					process.env.NODE_ENV as Environment, 
					{ 
						prodConfig: {}, 
						testConfig: _envConfig 
					}
				);

				expect(nconf.get("port")).toBe(_envConfig.port);
				expect(nconf.get("secretKey")).toBe(_envConfig.secretKey);
			});

			it("Production environment and config passed has arguments, should set the process variables", () => {
				const _envConfig = { port: 4000, secretKey: "secret1" };

				config.set(Environment.PRODUCTION, { prodConfig: _envConfig });

				expect(nconf.get("port")).toBe(_envConfig.port);
				expect(nconf.get("secretKey")).toBe(_envConfig.secretKey);
			});

			it("Staging environment and config passed has arguments, should set the process variables", () => {
				const _envConfig = { port: 4000, secretKey: "secret1" };

				config.set(
					Environment.STAGING, 
					{ 
						prodConfig: {}, 
						stagingConfig: _envConfig 
					}
				);

				expect(nconf.get("port")).toBe(_envConfig.port);
				expect(nconf.get("secretKey")).toBe(_envConfig.secretKey);
			});

			it("Dev environment and config passed has arguments, should set the process variables", () => {
				const _envConfig = { port: 4000, secretKey: "secret1" };

				config.set(
					Environment.DEV, 
					{ 
						prodConfig: {}, 
						devConfig: _envConfig 
					}
				);

				expect(nconf.get("port")).toBe(_envConfig.port);
				expect(nconf.get("secretKey")).toBe(_envConfig.secretKey);
			});

			it("Unknown environment and config passed has arguments, should consider the dev environment as default and set the process variables", () => {
				const _envConfig = { port: 4000, secretKey: "secret1" };

				config.set(
					"some environment" as any, 
					{ 
						prodConfig: {}, 
						devConfig: _envConfig 
					}
				);

				expect(nconf.get("port")).toBe(_envConfig.port);
				expect(nconf.get("secretKey")).toBe(_envConfig.secretKey);
			});
		});
	});
});
