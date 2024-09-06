/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTypeValidator } from "../types";



export class DataTypeValidatorImpl implements DataTypeValidator {


	checkFieldIsString(input: string | undefined): boolean {
		return (!!input && typeof input === "string");
	}

	checkFieldIsNumber(input: number | undefined): boolean {
		return (input === 0 || (!!input && typeof input === "number"));
	}

	checkFieldIsBoolean(input: boolean | undefined): boolean {
		return (input === false || (!!input && typeof input === "boolean"));
	}

	checkFieldIsObject(input: Record<string, any> | undefined): boolean {
		return (!!input && Object(input).constructor.name === "Object");
	}

	checkFieldIsArray(input: Array<any> | undefined): boolean {
		return (!!input && Object(input).constructor.name === "Array");
	}
}
