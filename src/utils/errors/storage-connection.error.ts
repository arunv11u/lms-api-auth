import { CustomError } from "@arunvaradharajalu/common.errors";
import { ErrorCodes, ErrorObject } from "../types";

export class StorageConnectionError extends CustomError<ErrorCodes> {
	statusCode = 500;
	code: ErrorCodes = ErrorCodes.storageConnection;

	constructor(public reason: string) {
		super(reason);

		// Only because extending from a built in class
		Object.setPrototypeOf(this, StorageConnectionError.prototype);
	}

	serializeErrors(): ErrorObject[] {
		return [{ code: this.code, message: this.reason }];
	}
}

