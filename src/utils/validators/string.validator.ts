import { GenericError } from "../errors";
import { ErrorCodes, StringValidator } from "../types";



export class StringValidatorImpl implements StringValidator {

	checkStrMaxLen(input: string | undefined, length: number): boolean {
		if (!input || typeof input !== "string")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected a string"),
				errorCode: 500
			});
		if (!length || typeof length !== "number")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Maximum length input is invalid, expected a number"),
				errorCode: 500
			});

		if (input.length <= length) return true;

		return false;
	}

	checkStrMinLen(input: string | undefined, length: number): boolean {
		if (!input || typeof input !== "string")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected a string"),
				errorCode: 500
			});
		if (!length || typeof length !== "number")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Minimum length input is invalid, expected a number"),
				errorCode: 500
			});

		if (input.length >= length) return true;

		return false;
	}

	checkValidEmail(input: string | undefined): boolean {
		if (!input || typeof input !== "string")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected a string"),
				errorCode: 500
			});

		return !!String(input)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	}

	allowEmptyStr(input: string | undefined): boolean {
		if ((input !== "" && !input) || typeof input !== "string")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected a string"),
				errorCode: 500
			});

		return true;
	}

	checkRegexMatch(input: string | undefined, regexPattern: RegExp): boolean {
		if (!input || typeof input !== "string")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected a string"),
				errorCode: 500
			});

		return !!String(input).match(regexPattern);
	}
}
