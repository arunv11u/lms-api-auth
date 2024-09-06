/* eslint-disable @typescript-eslint/no-explicit-any */

import { unhandledErrorHandler } from "../../../src/utils";



describe("\"Unhandled Errors\" Module", () => {

	afterEach(() => {
		jest.restoreAllMocks();
	});


	it("should handle uncaughtException", () => {
		const mockError = new Error("Server internal error");
		jest.spyOn(process, "on").mockImplementation((event, handler): any => {
			if (event === "uncaughtException") handler(mockError);
		});
		jest.spyOn(console, "error").mockReturnValueOnce();

		unhandledErrorHandler();

		expect(process.on).toHaveBeenCalledWith(
			"uncaughtException",
			expect.any(Function)
		);
		// eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalledWith(mockError);
	});

	it("should handle unhandledRejection", () => {
		const mockError = new Error("Sample Unhandled Promise rejection");
		jest.spyOn(process, "on").mockImplementation((event, handler): any => {
			if (event === "unhandledRejection") handler(mockError);
		});
		jest.spyOn(console, "error").mockReturnValueOnce();

		unhandledErrorHandler();

		expect(process.on).toHaveBeenCalledWith(
			"unhandledRejection",
			expect.any(Function)
		);
		// eslint-disable-next-line no-console
		expect(console.error).toHaveBeenCalledWith(mockError);
	});
});
