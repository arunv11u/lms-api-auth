import { mockProcessExit } from "jest-mock-process";
import mockLoaderImpl, { mockLoad } from "./mocks/loader.mock";
import { App } from "../src/app";

jest.mock("../src/loader", () => {
	return {
		LoaderImpl: mockLoaderImpl
	};
});


jest.mock("../src/server", () => {
	return {
		server: {
			listen: jest.fn((port, cb) => cb())
		}
	};
});

const mockExit = mockProcessExit();

describe("App Module", () => {
	const app = new App();

	describe("\"main\" method", () => {
		describe("Happy Path", () => {
			it("If env is other than dev or staging, Should start up the server in the production environment", async () => {
				await app.main();

				expect(mockLoad).toHaveBeenCalled();
			});

			it("If env is dev, Should start up the server in the dev environment", async () => {
				process.env.NODE_ENV = "dev";

				await app.main();

				expect(mockLoad).toHaveBeenCalled();

				process.env.NODE_ENV = "test";
			});

			it("If env is staging, Should start up the server in the dev environment", async () => {
				process.env.NODE_ENV = "staging";

				await app.main();

				expect(mockLoad).toHaveBeenCalled();

				process.env.NODE_ENV = "test";
			});

			it("Error while loading modules, should exit the process", async () => {
				mockLoad.mockImplementation(() => { throw new Error(); });

				app.main();

				expect(mockLoad).toHaveBeenCalled();
				expect(mockExit).toHaveBeenCalled();
			});
		});
	});
});