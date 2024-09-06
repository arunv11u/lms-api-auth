/* eslint-disable @typescript-eslint/no-explicit-any */

import { GenericError, NumberValidatorImpl } from "../../../src/utils";



describe("Basic Input Validation", () => {
	const numberValidation = new NumberValidatorImpl();

	describe("\"Number Validation\" class", () => {
		describe("\"checkNumMaxVal\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(() =>
						numberValidation.checkNumMaxVal(undefined as any, 9)
					).toThrow(GenericError);
					expect(() =>
						numberValidation.checkNumMaxVal(undefined as any, 9)
					).toThrow("Input data is invalid, expected a number");
				});

				it("Passing array as an input data, should throw an error", () => {
					expect(
						() => numberValidation.checkNumMaxVal([] as any, 0)
					).toThrow(
						GenericError
					);
					expect(
						() => numberValidation.checkNumMaxVal([] as any, 0)
					).toThrow(
						"Input data is invalid, expected a number"
					);
				});

				it("Passing undefined as an input to maximum value, should throw an error", () => {
					expect(() =>
						numberValidation.checkNumMaxVal(10, undefined as any)
					).toThrow(GenericError);
					expect(() =>
						numberValidation.checkNumMaxVal(0, undefined as any)
					).toThrow("Maximum value input is invalid, expected a number");
				});
			});

			describe("Happy Path", () => {
				it("Input number is below the maximum value, should return true", () => {
					const isValidNum = numberValidation.checkNumMaxVal(10, 20);
					expect(isValidNum).toBe(true);
				});

				it("Input number is same as the maximum value, should return true", () => {
					const isValidNum = numberValidation.checkNumMaxVal(10, 10);
					expect(isValidNum).toBe(true);
				});

				it("Input number is above the maximum value, should return false", () => {
					const isValidNum = numberValidation.checkNumMaxVal(10, 6);
					expect(isValidNum).toBe(false);
				});
			});
		});

		describe("\"checkNumMinVal\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(() =>
						numberValidation.checkNumMinVal(undefined as any, 9)
					).toThrow(GenericError);
					expect(() =>
						numberValidation.checkNumMinVal(undefined as any, 9)
					).toThrow("Input data is invalid, expected a number");
				});

				it("Passing array as an input data, should throw an error", () => {
					expect(
						() => numberValidation.checkNumMinVal([] as any, 0)
					).toThrow(
						GenericError
					);
					expect(
						() => numberValidation.checkNumMinVal([] as any, 0)
					).toThrow(
						"Input data is invalid, expected a number"
					);
				});

				it("Passing undefined as an input to minimum value, should throw an error", () => {
					expect(() =>
						numberValidation.checkNumMinVal(10, undefined as any)
					).toThrow(GenericError);
					expect(() =>
						numberValidation.checkNumMinVal(0, undefined as any)
					).toThrow("Minimum value input is invalid, expected a number");
				});
			});

			describe("Happy Path", () => {
				it("Input number is above the minimum value, should return true", () => {
					const isValidNum = numberValidation.checkNumMinVal(6, 4);
					expect(isValidNum).toBe(true);
				});

				it("Input number is same as the minimum value, should return true", () => {
					const isValidNum = numberValidation.checkNumMinVal(5, 5);
					expect(isValidNum).toBe(true);
				});

				it("Input number is below the minimum value, should return false", () => {
					const isValidNum = numberValidation.checkNumMinVal(2, 5);
					expect(isValidNum).toBe(false);
				});
			});
		});
	});
});
