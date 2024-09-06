import { Request, Response, NextFunction } from "express";
import { setSecurityHeaders } from "../../../src/utils";


describe("Security header Module", () => {
	describe("\"setSecurityHeaders\" method", () => {
		describe("Happy Path", () => {
			it("Shout set security headers", () => {
				const mockSetHeader: jest.Mock = jest.fn();

				const mockRequest: Partial<Request> = {};
				const mockResponse: Partial<Response> = {
					setHeader: mockSetHeader
				};
				const mockNextFn: NextFunction = jest.fn();

				setSecurityHeaders(
					mockRequest as Request,
					mockResponse as Response,
					mockNextFn
				);

				expect(mockSetHeader).toHaveBeenNthCalledWith(1, "Content-Security-Policy", "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests");
				expect(mockSetHeader).toHaveBeenNthCalledWith(2, "Cross-Origin-Embedder-Policy", "require-corp");
				expect(mockSetHeader).toHaveBeenNthCalledWith(3, "Cross-Origin-Opener-Policy", "same-origin");
				expect(mockSetHeader).toHaveBeenNthCalledWith(4, "Cross-Origin-Resource-Policy", "same-origin");
				expect(mockSetHeader).toHaveBeenNthCalledWith(5, "Origin-Agent-Cluster", "?1");
				expect(mockSetHeader).toHaveBeenNthCalledWith(6, "Referrer-Policy", "no-referrer");
				expect(mockSetHeader).toHaveBeenNthCalledWith(7, "Strict-Transport-Security", "max-age=15552000; includeSubDomains");
				expect(mockSetHeader).toHaveBeenNthCalledWith(8, "X-Content-Type-Options", "nosniff");
				expect(mockSetHeader).toHaveBeenNthCalledWith(9, "X-DNS-Prefetch-Control", "off");
				expect(mockSetHeader).toHaveBeenNthCalledWith(10, "X-Download-Options", "noopen");
				expect(mockSetHeader).toHaveBeenNthCalledWith(11, "X-Frame-Options", "SAMEORIGIN");
				expect(mockSetHeader).toHaveBeenNthCalledWith(12, "X-Permitted-Cross-Domain-Policies", "none");
				expect(mockSetHeader).toHaveBeenNthCalledWith(13, "X-XSS-Protection", "1; mode=block");

				expect(mockNextFn).toHaveBeenCalled();
			});
		});
	});
});
