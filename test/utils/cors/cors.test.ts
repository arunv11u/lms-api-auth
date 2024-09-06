import { Request } from "express";
import { CorsOptions } from "cors";
import { Environment, ErrorCodes, GenericError, corsOptions } from "../../../src/utils";


describe("Config Module", () => {
	describe("\"corsOptions\" fn", () => {

		afterEach(() => {
			process.env.NODE_ENV = Environment.TEST;
		});

		describe("Exception Path", () => {
			it("Invalid environment, should throw error", () => {
				process.env.NODE_ENV = "dummy";

				const mockRequest: Partial<Request> = {};
				const mockCallback: jest.Mock = jest.fn();

				expect(() => corsOptions(
					mockRequest as Request,
					mockCallback
				)).toThrow(GenericError);
				expect(() => corsOptions(
					mockRequest as Request,
					mockCallback
				)).toThrow("Invalid Environment found in CORS Options.");
			});

			it("No input passed and the provided domain is not whitelisted for production environment, should throw an error", () => {
				process.env.NODE_ENV = Environment.PRODUCTION;

				const mockRequest: Partial<Request> = {};
				const mockCallback: jest.Mock = jest.fn(
					(error, corsOptions) => {
						corsOptions.origin("http://localhost:4201", (error: Error) => {
							expect(error).toStrictEqual(new GenericError({ code: ErrorCodes.invalidOrigin, error: new Error("Not allowed by CORS"), errorCode: 500 }));
						});
					});

				corsOptions(
					mockRequest as Request,
					mockCallback
				);

				expect(mockCallback).toHaveBeenCalled();
			});
		});

		describe("Happy Path", () => {
			it("Should skip cors option for test environment", () => {
				const _corsOptions: CorsOptions = {
					methods: [
						"POST",
						"GET",
						"PATCH",
						"DELETE",
						"PUT",
						"OPTIONS"
					],
					allowedHeaders: [
						"Content-Type",
						"Authorization"
					],
					credentials: true
				};
				const mockRequest: Partial<Request> = {};
				const mockCallback: jest.Mock = jest.fn();

				corsOptions(
					mockRequest as Request,
					mockCallback
				);

				expect(mockCallback).toHaveBeenCalledWith(null, _corsOptions);
			});

			it("Should skip cors option for dev environment", () => {
				process.env.NODE_ENV = Environment.DEV;

				const _corsOptions: CorsOptions = {
					methods: [
						"POST",
						"GET",
						"PATCH",
						"DELETE",
						"PUT",
						"OPTIONS"
					],
					allowedHeaders: [
						"Content-Type",
						"Authorization"
					],
					credentials: true
				};
				const mockRequest: Partial<Request> = {};
				const mockCallback: jest.Mock = jest.fn();

				corsOptions(
					mockRequest as Request,
					mockCallback
				);

				expect(mockCallback).toHaveBeenCalledWith(null, _corsOptions);
			});

			it.skip("No input passed in production environment, should set cors with origin option", () => {
				process.env.NODE_ENV = Environment.PRODUCTION;

				const mockRequest: Partial<Request> = {};
				const mockCallback: jest.Mock = jest.fn(
					(error, corsOptions) => {
						corsOptions.origin("", (error: Error, resp: boolean) => {
							expect(error).toBe(null);
							expect(resp).toBe(true);
						});
					});

				corsOptions(
					mockRequest as Request,
					mockCallback
				);

				expect(mockCallback).toHaveBeenCalled();
			});

			it.skip("No input passed in staging environment, should set cors with origin option", () => {
				process.env.NODE_ENV = Environment.STAGING;

				const mockRequest: Partial<Request> = {};
				const mockCallback: jest.Mock = jest.fn(
					(error, corsOptions) => {
						corsOptions.origin("", (error: Error, resp: boolean) => {
							expect(error).toBe(null);
							expect(resp).toBe(true);
						});
					});

				corsOptions(
					mockRequest as Request,
					mockCallback
				);

				expect(mockCallback).toHaveBeenCalled();
			});
		});
	});
});
