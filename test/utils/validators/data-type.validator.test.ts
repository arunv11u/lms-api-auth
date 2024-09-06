/* eslint-disable @typescript-eslint/no-explicit-any */

import { DataTypeValidatorImpl } from "../../../src/utils";



describe("Basic Input Validation", () => {
	const dataTypeValidation = new DataTypeValidatorImpl();
    
	describe("\"Data Type Validation\" class", () => {

		describe("\"checkFieldIsString\" method", () => {
			describe("Happy Path", () => {
				it("Input is a string, should return true", () => {
					const isString = dataTypeValidation
						.checkFieldIsString("Hello World!");

					expect(isString).toBe(true);
				});

				it("Input is undefined, should return false", () => {
					const isString = dataTypeValidation
						.checkFieldIsString(undefined as any);

					expect(isString).toBe(false);
				});

				it("Input is null, should return false", () => {
					const isString = dataTypeValidation
						.checkFieldIsString(null as any);

					expect(isString).toBe(false);
				});

				it("Input is empty string, should return true", () => {
					const isString = dataTypeValidation
						.checkFieldIsString("");

					expect(isString).toBe(false);
				});

				it("Input is a number, should return false", () => {
					const isString = dataTypeValidation
						.checkFieldIsString(9 as any);

					expect(isString).toBe(false);
				});

				it("Input is a boolean, should return false", () => {
					const isString = dataTypeValidation
						.checkFieldIsString(true as any);

					expect(isString).toBe(false);
				});

				it("Input is an object, should return false", () => {
					const isString = dataTypeValidation
						.checkFieldIsString({} as any);

					expect(isString).toBe(false);
				});

				it("Input is an array, should return false", () => {
					const isString = dataTypeValidation
						.checkFieldIsString([] as any);

					expect(isString).toBe(false);
				});
			});
		});

		describe("\"checkFieldIsNumber\" method", () => {

			describe("Happy Path", () => {
				it("Input is a number, should return true", () => {
					const isNumber = dataTypeValidation.checkFieldIsNumber(9);

					expect(isNumber).toBe(true);
				});

				it("Input is 0, should return true", () => {
					const isNumber = dataTypeValidation.checkFieldIsNumber(0);

					expect(isNumber).toBe(true);
				});

				it("Input is undefined, should return false", () => {
					const isNumber = dataTypeValidation
						.checkFieldIsNumber(undefined as any);

					expect(isNumber).toBe(false);
				});

				it("Input is null, should return false", () => {
					const isNumber = dataTypeValidation
						.checkFieldIsNumber(null as any);

					expect(isNumber).toBe(false);
				});

				it("Input is a string, should return false", () => {
					const isNumber = dataTypeValidation
						.checkFieldIsNumber("Hello World!" as any);

					expect(isNumber).toBe(false);
				});

				it("Input is a booelan, should return false", () => {
					const isNumber = dataTypeValidation
						.checkFieldIsNumber(true as any);

					expect(isNumber).toBe(false);
				});

				it("Input is an object, should return false", () => {
					const isNumber = dataTypeValidation
						.checkFieldIsNumber({} as any);

					expect(isNumber).toBe(false);
				});

				it("Input is an array, should return false", () => {
					const isNumber = dataTypeValidation
						.checkFieldIsNumber([] as any);

					expect(isNumber).toBe(false);
				});
			});
		});

		describe("\"checkFieldIsBoolean\" method", () => {

			describe("Happy Path", () => {
				it("Input is true, should return true", () => {
					const isBoolean = dataTypeValidation
						.checkFieldIsBoolean(true);

					expect(isBoolean).toBe(true);
				});

				it("Input is undefined, should return false", () => {
					const isBoolean = dataTypeValidation
						.checkFieldIsBoolean(undefined as any);

					expect(isBoolean).toBe(false);
				});

				it("Input is null, should return false", () => {
					const isBoolean = dataTypeValidation
						.checkFieldIsBoolean(null as any);

					expect(isBoolean).toBe(false);
				});

				it("Input is false, should return true", () => {
					const isBoolean = dataTypeValidation
						.checkFieldIsBoolean(false);

					expect(isBoolean).toBe(true);
				});

				it("Input is a string, should return false", () => {
					const isBoolean = dataTypeValidation
						.checkFieldIsBoolean("Hello World!" as any);

					expect(isBoolean).toBe(false);
				});

				it("Input is a number, should return false", () => {
					const isBoolean = dataTypeValidation
						.checkFieldIsBoolean(9 as any);

					expect(isBoolean).toBe(false);
				});

				it("Input is an object, should return false", () => {
					const isBoolean = dataTypeValidation
						.checkFieldIsBoolean({} as any);

					expect(isBoolean).toBe(false);
				});

				it("Input is an array, should return false", () => {
					const isBoolean = dataTypeValidation
						.checkFieldIsBoolean([] as any);

					expect(isBoolean).toBe(false);
				});
			});
		});

		describe("\"checkFieldIsObject\" method", () => {

			describe("Happy Path", () => {
				it("Input is an object, should return true", () => {
					const isObject = dataTypeValidation.checkFieldIsObject({});
					expect(isObject).toBe(true);
				});

				it("Input is undefined, should return false", () => {
					const isObject = dataTypeValidation
						.checkFieldIsObject(undefined as any);

					expect(isObject).toBe(false);
				});

				it("Input is null, should return false", () => {
					const isObject = dataTypeValidation
						.checkFieldIsObject(null as any);

					expect(isObject).toBe(false);
				});

				it("Input is a string, should return false", () => {
					const isObject = dataTypeValidation
						.checkFieldIsObject("Hello World!" as any);

					expect(isObject).toBe(false);
				});

				it("Input is a number, should return false", () => {
					const isObject = dataTypeValidation
						.checkFieldIsObject(9 as any);

					expect(isObject).toBe(false);
				});

				it("Input is a boolean, should return false", () => {
					const isObject = dataTypeValidation
						.checkFieldIsObject(true as any);

					expect(isObject).toBe(false);
				});

				it("Input is an array, should return false", () => {
					const isObject = dataTypeValidation
						.checkFieldIsObject([] as any);

					expect(isObject).toBe(false);
				});
			});
		});

		describe("\"checkFieldIsArray\" method", () => {

			describe("Happy Path", () => {
				it("Input is an array, should return true", () => {
					const isArray = dataTypeValidation.checkFieldIsArray([]);
					expect(isArray).toBe(true);
				});

				it("Input is undefined, should return false", () => {
					const isArray = dataTypeValidation
						.checkFieldIsArray(undefined as any);

					expect(isArray).toBe(false);
				});

				it("Input is a string, should return false", () => {
					const isArray = dataTypeValidation.checkFieldIsArray("Hello World!" as any);
					expect(isArray).toBe(false);
				});

				it("Input is a number, should return false", () => {
					const isArray = dataTypeValidation
						.checkFieldIsArray(10 as any);

					expect(isArray).toBe(false);
				});

				it("Input is a boolean, should return false", () => {
					const isArray = dataTypeValidation
						.checkFieldIsArray(true as any);

					expect(isArray).toBe(false);
				});

				it("Input is an object, should return false", () => {
					const isArray = dataTypeValidation
						.checkFieldIsArray({} as any);
						
					expect(isArray).toBe(false);
				});
			});
		});
	});
});