
import { CustomError } from "@arunvaradharajalu/common.errors";
import {
	StorageConnectionError
} from "./storage-connection.error";



describe("Error Module", () => {
	describe("\"StorageConnectionError\" class", () => {
		describe("Happy Path", () => {
			it("Need a class which extended built-in CustomError class, DatabaseConnectionError class should extend CustomError class", () => {
				expect(StorageConnectionError.prototype)
					.toBeInstanceOf(CustomError);
			});

			it("Storage Connection Error Object should be an instance of a Custom Error", () => {
				const storageConnectionError = new StorageConnectionError("Error, connecting to the cloud storage");
				expect(storageConnectionError)
					.toBeInstanceOf(CustomError);
			});
		});
	});

	describe("\"serializeErrors\" fn", () => {
		describe("Happy Path", () => {
			it("No arguments passed, should return structured error message", () => {
				const storageConnectionError = new StorageConnectionError("Error, connecting to the cloud storage");
				const _errorMessage = storageConnectionError.serializeErrors();

				const _message = "Error, connecting to the cloud storage";
				expect(_errorMessage)
					.toMatchObject([{ message: _message }]);
				expect(storageConnectionError.message)
					.toBe(_message);
			});
		});
	});
});
