import {
	Request,
	Response,
	NextFunction
} from "express";
import { faker } from "@faker-js/faker";
import { RateLimiter, RateLimiterImpl } from "../../../src/utils";



describe("Rate Limiter Module", () => {
	const rateLimiter: RateLimiter = new RateLimiterImpl();
	let mockRequest: Partial<Request> = {};
	let mockResponse: Partial<Response> = {};
	const mockNextFn: jest.Mock = jest.fn();
	const mockStatus: jest.Mock = jest.fn();
	const mockSend: jest.Mock = jest.fn();

	beforeEach(() => {
		mockRequest = {
			ip: faker.internet.ip()
		};
		mockResponse = {
			setHeader: jest.fn(),
			status: mockStatus,
			send: mockSend
		};
	});

	describe("\"limitRequests\" method", () => {
		const requestLimit = 2;
		const windowMs = 60_000;

		rateLimiter.maxRequests = requestLimit;
		rateLimiter.windowMs = windowMs;

		describe("Exception Path", () => {
			it("If more requests come from the same IP, next function should call with error", async () => {
				const limitRequests = rateLimiter.limitRequests();
				limitRequests(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFn as NextFunction
				);
				limitRequests(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFn as NextFunction
				);
				limitRequests(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFn as NextFunction
				);

				await new Promise(
					(resolve) => setTimeout(resolve, 300)
				);

				expect(mockNextFn).toHaveBeenCalled();
			});
		});

		describe("Happy Path", () => {
			it("If request, response, next fn provided, should call the next function without arguments", async () => {
				const limitRequests = rateLimiter.limitRequests();
				limitRequests(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFn as NextFunction
				);

				await new Promise(
					(resolve) => setTimeout(resolve, 300)
				);

				expect(mockNextFn).toHaveBeenCalled();
			});
		});
	});
});

