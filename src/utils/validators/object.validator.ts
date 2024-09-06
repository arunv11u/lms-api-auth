/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericError } from "../errors";
import { ErrorCodes, ObjectValidator } from "../types";



export class ObjectValidatorImpl implements ObjectValidator {


	checkFieldExist(input: Record<string, any>, field: string): boolean {
		if (input.constructor.name !== "Object")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected an object"),
				errorCode: 500,
			});

		// eslint-disable-next-line no-prototype-builtins
		return Object(input).hasOwnProperty(field);
	}

	allowUndefinedField(input: any): boolean {
		return input === undefined;
	}

	allowFields(input: Record<string, any>, fields: string[]) {
		if (!input)
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected an object"),
				errorCode: 500,
			});
		if (input.constructor.name !== "Object")
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error("Input data is invalid, expected an object"),
				errorCode: 500,
			});

		if (!fields)
			throw new GenericError({
				code: ErrorCodes.invalidInput,
				error: new Error(
					"Fields input is invalid, expected an array of strings"
				),
				errorCode: 500,
			});

		fields.forEach((field) => {
			if (typeof field !== "string")
				throw new GenericError({
					code: ErrorCodes.invalidInput,
					error: new Error(
						"Fields input is invalid, expected an array of strings"
					),
					errorCode: 500,
				});
		});

		const forbiddenFields: string[] = [];
		for (const key in input) {
			if (!fields.some((field) => field === key)) {
				forbiddenFields.push(key);
				break;
			}
		}

		const validationRes: { isValid: boolean, message?: string } = { 
			isValid: true 
		};
		if (forbiddenFields.length) {
			validationRes.isValid = false;
			validationRes.message = `${forbiddenFields[0]} is forbidden`;
		}

		return validationRes;
	}
}
