import winston from "winston";
import {
	Environment,
	GenericError,
	Logger,
	WinstonLogger
} from "../../../src/utils";



describe("Winston logger module", () => {
	let winstonLogger: Logger;
	let combinedLogPath: string;
	let errorLogPath: string;

	beforeEach(() => {
		winstonLogger = new WinstonLogger();
		combinedLogPath = "./logs/combined.log";
		errorLogPath = "./logs/error.log";
	});

	describe("\"winston\" getter", () => {
		describe("Happy Path", () => {
			it("Should return winston", () => {
				expect(winstonLogger.winston)
					.toStrictEqual(winston);
			});
		});
	});

	describe("\"start\"", () => {

		describe("Exception Path", () => {

			it("If log path is not provided for production environment, should throw error", () => {
				expect(
					() => winstonLogger.start(Environment.PRODUCTION)
				).toThrow(GenericError);

				expect(
					() => winstonLogger.start(Environment.PRODUCTION)
				).toThrow(`Log path is required for ${Environment.PRODUCTION} environment.`);
			});

			it("If log path is not provided for staging environment, should throw error", () => {
				expect(
					() => winstonLogger.start(Environment.STAGING)
				).toThrow(GenericError);

				expect(
					() => winstonLogger.start(Environment.STAGING)
				).toThrow(`Log path is required for ${Environment.STAGING} environment.`);
			});
		});

		describe("Happy Path", () => {

			it("If log path is not provided for dev environment, should log the messages", () => {
				const spyAdd = jest.spyOn(winston, "add");

				winstonLogger.start(
					Environment.DEV
				);

				expect(spyAdd).toHaveBeenCalled();
			});

			it("If environment is dev, should start the logger to log the messages in console", () => {
				const spyAdd = jest.spyOn(winston, "add");

				winstonLogger.start(
					Environment.DEV
				);

				expect(spyAdd).toHaveBeenCalled();
			});

			it("If environment is test, should start the logger to log the messages in console", () => {
				const spyAdd = jest.spyOn(winston, "add");

				winstonLogger.start(
					Environment.TEST,
					{
						combinedLogPath,
						errorLogPath
					}
				);

				expect(spyAdd).toHaveBeenCalled();
			});

			it("If environment is staging, should start the logger to log the messages in file", () => {
				const spyAdd = jest.spyOn(winston, "add");

				winstonLogger.start(
					Environment.STAGING,
					{
						combinedLogPath,
						errorLogPath
					}
				);

				expect(spyAdd).toHaveBeenCalled();
			});

			it("If environment is production, should start the logger to log the messages in file", () => {
				const spyAdd = jest.spyOn(winston, "add");

				winstonLogger.start(
					Environment.PRODUCTION,
					{
						combinedLogPath,
						errorLogPath
					}
				);

				expect(spyAdd).toHaveBeenCalled();
			});

			it("If object is passed along with message, should able to print the whole object in string", () => {
				winstonLogger.start(
					Environment.PRODUCTION,
					{
						combinedLogPath,
						errorLogPath
					}
				);

				winstonLogger.winston.error(
					"Something went wrong",
					new Error("Sample error")
				);
			});
		});
	});
});