/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericError } from "../errors";
import { ArrayValidator, ErrorCodes } from "../types";



export class ArrayValidatorImpl implements ArrayValidator {


	checkMaxLen(input: Array<any> | undefined, length: number) {
		if (!input || Object(input).constructor.name !== "Array")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected an array"),
				errorCode: 500,
			});
		if (!length || typeof length !== "number")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Maximum length input is invalid, expected a number"),
				errorCode: 500,
			});

		return input.length <= length;
	}

	checkMinLen(input: Array<any> | undefined, length: number) {
		if (!input || Object(input).constructor.name !== "Array")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected an array"),
				errorCode: 500,
			});
		if (!length || typeof length !== "number")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Minimum length input is invalid, expected a number"),
				errorCode: 500,
			});

		return input.length >= length;
	}

	checkArrOfStr(input: Array<string> | undefined) {
		if (!input || Object(input).constructor.name !== "Array")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected an array of strings"),
				errorCode: 500,
			});

		for (const ele of input)
			if (typeof ele !== "string")
				throw new GenericError({
					code: ErrorCodes.invalidInput,
					error: new Error(
						"Input data is invalid, expected an array of strings"
					),
					errorCode: 500,
				});

		return true;
	}

	checkArrOfNum(input: Array<number> | undefined) {
		if (!input || Object(input).constructor.name !== "Array")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected an array of numbers"),
				errorCode: 500,
			});

		for (const ele of input)
			if (typeof ele !== "number")
				throw new GenericError({
					code: ErrorCodes.invalidInput,
					error: new Error(
						"Input data is invalid, expected an array of numbers"
					),
					errorCode: 500,
				});

		return true;
	}

	checkArrOfBool = (input: Array<boolean> | undefined) => {
		if (!input || Object(input).constructor.name !== "Array")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error(
					"Input data is invalid, expected an array of booleans"
				),
				errorCode: 500,
			});

		for (const ele of input)
			if (typeof ele !== "boolean")
				throw new GenericError({
					code: ErrorCodes.invalidInput,
					error: new Error(
						"Input data is invalid, expected an array of booleans"
					),
					errorCode: 500,
				});

		return true;
	};
}
