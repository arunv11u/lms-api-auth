/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArrayValidatorImpl, GenericError } from "../../../src/utils";



describe("Basic Input Validation", () => {
	const arrayValidation = new ArrayValidatorImpl();

	describe("\"Array Validation\" class", () => {
		describe("\"checkArrMaxLen\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(() =>
						arrayValidation.checkMaxLen(undefined as any, 9)
					).toThrow(GenericError);
					expect(() =>
						arrayValidation.checkMaxLen(undefined as any, 9)
					).toThrow("Input data is invalid, expected an array");
				});

				it("Passing object as an input data, should throw an error", () => {
					expect(
						() => arrayValidation.checkMaxLen({} as any, 0)
					).toThrow(
						GenericError
					);
					expect(
						() => arrayValidation.checkMaxLen({} as any, 0)
					).toThrow(
						"Input data is invalid, expected an array"
					);
				});

				it("Passing undefined as an input to maximum limit, should throw an error", () => {
					expect(() =>
						arrayValidation.checkMaxLen([], undefined as any)
					).toThrow(GenericError);
					expect(() =>
						arrayValidation.checkMaxLen([], undefined as any)
					).toThrow("Maximum length input is invalid, expected a number");
				});

				it("Passing array as an input to maximum limit, should throw an error", () => {
					expect(
						() => arrayValidation.checkMaxLen([], [] as any)
					).toThrow(
						GenericError
					);
					expect(
						() => arrayValidation.checkMaxLen([], [] as any)
					).toThrow(
						"Maximum length input is invalid, expected a number"
					);
				});
			});

			describe("Happy Path", () => {
				it("Input array length is below the maximum length, should return true", () => {
					const isValidArr = arrayValidation.checkMaxLen([4], 6);
					expect(isValidArr).toBe(true);
				});

				it("Input array length is same as the maximum length, should return true", () => {
					const isValidArr = arrayValidation.checkMaxLen([4, 5], 2);
					expect(isValidArr).toBe(true);
				});

				it("Input array length is above the maximum length, should return false", () => {
					const isValidArr =
						arrayValidation.checkMaxLen([4, 5, 6], 2);

					expect(isValidArr).toBe(false);
				});
			});
		});

		describe("\"checkArrMinLen\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(() =>
						arrayValidation.checkMinLen(undefined as any, 9)
					).toThrow(GenericError);
					expect(() =>
						arrayValidation.checkMinLen(undefined as any, 9)
					).toThrow("Input data is invalid, expected an array");
				});

				it("Passing object as an input data, should throw an error", () => {
					expect(
						() => arrayValidation.checkMinLen({} as any, 0)
					).toThrow(
						GenericError
					);
					expect(
						() => arrayValidation.checkMinLen({} as any, 0)
					).toThrow(
						"Input data is invalid, expected an array"
					);
				});

				it("Passing undefined as an input to minimum length, should throw an error", () => {
					expect(() =>
						arrayValidation.checkMinLen([], undefined as any)
					).toThrow(GenericError);
					expect(() =>
						arrayValidation.checkMinLen([], undefined as any)
					).toThrow("Minimum length input is invalid, expected a number");
				});

				it("Passing array as an input to minimum length, should throw an error", () => {
					expect(
						() => arrayValidation.checkMinLen([], [] as any)
					).toThrow(
						GenericError
					);
					expect(
						() => arrayValidation.checkMinLen([], [] as any)
					).toThrow(
						"Minimum length input is invalid, expected a number"
					);
				});
			});

			describe("Happy Path", () => {
				it("Input array length is above the minimum length, should return true", () => {
					const isValidArr =
						arrayValidation.checkMinLen([2, 3, 4], 2);

					expect(isValidArr).toBe(true);
				});

				it("Input array length is same as the minimum length, should return true", () => {
					const isValidArr = arrayValidation.checkMinLen([2, 3], 2);

					expect(isValidArr).toBe(true);
				});

				it("Input array length is below the minimum length, should return false", () => {
					const isValidArr = arrayValidation.checkMinLen([2, 3], 5);
					expect(isValidArr).toBe(false);
				});
			});
		});

		describe("\"checkArrOfStr\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(
						() => arrayValidation.checkArrOfStr(undefined as any)
					).toThrow(
						GenericError
					);
					expect(
						() => arrayValidation.checkArrOfStr(undefined as any)
					).toThrow(
						"Input data is invalid, expected an array of strings"
					);
				});

				it("Passing array of numbers as an input data, should throw an error", () => {
					expect(
						() => arrayValidation.checkArrOfStr([9 as any])
					).toThrow(
						GenericError
					);
					expect(
						() => arrayValidation.checkArrOfStr([10 as any])
					).toThrow(
						"Input data is invalid, expected an array of strings"
					);
				});
			});

			describe("Happy Path", () => {
				it("Passing array of strings as an input data, should return true", () => {
					expect(arrayValidation.checkArrOfStr(["data", "car"])).toBe(true);
				});
			});
		});

		describe("\"checkArrOfNum\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(
						() => arrayValidation.checkArrOfNum(undefined as any)
					).toThrow(
						GenericError
					);
					expect(
						() => arrayValidation.checkArrOfNum(undefined as any)
					).toThrow(
						"Input data is invalid, expected an array of numbers"
					);
				});

				it("Passing array of strings as an input data, should throw an error", () => {
					expect(() => arrayValidation.checkArrOfNum(["data" as any])).toThrow(
						GenericError
					);
					expect(() => arrayValidation.checkArrOfNum(["data" as any])).toThrow(
						"Input data is invalid, expected an array of numbers"
					);
				});
			});

			describe("Happy Path", () => {
				it("Passing array of numbers as an input data, should return true", () => {
					expect(arrayValidation.checkArrOfNum([3, 4])).toBe(true);
				});
			});
		});

		describe("\"checkArrOfBool\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(() =>
						arrayValidation.checkArrOfBool(undefined as any)
					).toThrow(GenericError);
					expect(() =>
						arrayValidation.checkArrOfBool(undefined as any)
					).toThrow("Input data is invalid, expected an array of booleans");
				});

				it("Passing array of numbers as an input data, should throw an error", () => {
					expect(
						() => arrayValidation.checkArrOfBool([9 as any])
					).toThrow(
						GenericError
					);
					expect(
						() => arrayValidation.checkArrOfBool([9 as any])
					).toThrow(
						"Input data is invalid, expected an array of booleans"
					);
				});
			});

			describe("Happy Path", () => {
				it("Passing array of booleans as an input data, should return true", () => {
					expect(
						arrayValidation.checkArrOfBool([true, false, true])
					).toBe(
						true
					);
				});
			});
		});
	});
});
