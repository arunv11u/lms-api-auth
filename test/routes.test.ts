import request from "supertest";
import express, { Express } from "express";
import { routes } from "../src/routes";
import { Environment, ErrorCodes } from "../src/utils";


describe("Route Module", () => {
	let app: Express;

	beforeEach(() => {
		app = express();
	});

	describe("\"listen\" fn", () => {
		describe("Happy Path", () => {
			it("Express application passed as an argument, should register routes", () => {
				const isRoutesRegistered = routes.listen(app);

				expect(isRoutesRegistered).toBe(true);
			});
		});
	});

	describe("\"Health Check\" Endpoint", () => {
		describe("Happy Path", () => {
			it("Make health check request, should return status code 200", async () => {
				routes.listen(app);

				const response = await request(app).get("/health-check");

				expect(response.statusCode).toBe(200);
			});
		});
	});

	describe("\"API docs\" Endpoint", () => {
		describe("Happy Path", () => {
			it("Make health check request, should return status code 200", async () => {
				process.env.NODE_ENV = Environment.DEV;

				routes.listen(app);

				const response = await request(app).get("/api-docs");
				expect(response.body).toBeTruthy();

				process.env.NODE_ENV = Environment.TEST;
			});
		});
	});

	describe("\"No route\" handler", () => {
		describe("Happy Path", () => {
			it("Request to an unavailable API, should return no route error", async () => {
				routes.listen(app);

				const response = await request(app).get("/api/sample");

				expect(response.statusCode).toBe(404);
				expect(response.body).toStrictEqual({
					errors: [
						{
							code: ErrorCodes.noUseCase,
							message: "There is no use case to process your request."
						}
					]
				});
			});
		});
	});
});