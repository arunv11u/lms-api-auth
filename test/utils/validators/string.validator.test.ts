/* eslint-disable @typescript-eslint/no-explicit-any */

import { GenericError, StringValidatorImpl } from "../../../src/utils";



describe("Basic Input Validation", () => {
	const stringValidator = new StringValidatorImpl();

	describe("\"String Validation\" class", () => {
		describe("\"checkStrMaxLen\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(() =>
						stringValidator.checkStrMaxLen(undefined as any, 9)
					).toThrow(GenericError);
					expect(() =>
						stringValidator.checkStrMaxLen(undefined as any, 9)
					).toThrow("Input data is invalid, expected a string");
				});

				it("Passing array as an input data, should throw an error", () => {
					expect(
						() => stringValidator.checkStrMaxLen([] as any, 0)
					).toThrow(
						GenericError
					);
					expect(
						() => stringValidator.checkStrMaxLen([] as any, 0)
					).toThrow(
						"Input data is invalid, expected a string"
					);
				});

				it("Passing undefined as an input to maximum limit, should throw an error", () => {
					expect(() =>
						stringValidator
							.checkStrMaxLen("Hello World!", undefined as any)
					).toThrow(GenericError);
					expect(() =>
						stringValidator
							.checkStrMaxLen("Hello World!", undefined as any)
					).toThrow("Maximum length input is invalid, expected a number");
				});

				it("Passing array as an input to maximum limit, should throw an error", () => {
					expect(() =>
						stringValidator.checkStrMaxLen("Hello World!", [] as any)
					).toThrow(GenericError);
					expect(() =>
						stringValidator.checkStrMaxLen("Hello World!", [] as any)
					).toThrow("Maximum length input is invalid, expected a number");
				});
			});

			describe("Happy Path", () => {
				it("Input string length is below the maximum string length, should return true", () => {
					const isMaxValidStr = stringValidator.
						checkStrMaxLen("Hello", 6);

					expect(isMaxValidStr).toBe(true);
				});

				it("Input string length is same as the maximum string length, should return true", () => {
					const isMaxValidStr = stringValidator
						.checkStrMaxLen("Hello", 5);

					expect(isMaxValidStr).toBe(true);
				});

				it("Input string length is above the maximum string length, should return false", () => {
					const isMaxValidStr = stringValidator.checkStrMaxLen(
						"Hello There!",
						6
					);
					expect(isMaxValidStr).toBe(false);
				});
			});
		});

		describe("\"checkStrMinLen\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(() =>
						stringValidator.checkStrMinLen(undefined as any, 9)
					).toThrow(GenericError);
					expect(() =>
						stringValidator.checkStrMinLen(undefined as any, 9)
					).toThrow("Input data is invalid, expected a string");
				});

				it("Passing array as an input data, should throw an error", () => {
					expect(
						() => stringValidator.checkStrMinLen([] as any, 0)
					).toThrow(
						GenericError
					);
					expect(
						() => stringValidator.checkStrMinLen([] as any, 0)
					).toThrow(
						"Input data is invalid, expected a string"
					);
				});

				it("Passing undefined as an input to minimum limit, should throw an error", () => {
					expect(() =>
						stringValidator
							.checkStrMinLen("Hello World!", undefined as any)
					).toThrow(GenericError);
					expect(() =>
						stringValidator
							.checkStrMinLen("Hello World!", undefined as any)
					).toThrow("Minimum length input is invalid, expected a number");
				});

				it("Passing array as an input to minimum limit, should throw an error", () => {
					expect(() =>
						stringValidator
							.checkStrMinLen("Hello World!", [] as any)
					).toThrow(GenericError);
					expect(() =>
						stringValidator
							.checkStrMinLen("Hello World!", [] as any)
					).toThrow("Minimum length input is invalid, expected a number");
				});
			});

			describe("Happy Path", () => {
				it("Input string length is above the minimum string length, should return true", () => {
					const isMinValidStr = stringValidator
						.checkStrMinLen("Hello", 4);

					expect(isMinValidStr).toBe(true);
				});

				it("Input string length is same as the minimum string length, should return true", () => {
					const isMinValidStr = stringValidator
						.checkStrMinLen("Hello", 5);

					expect(isMinValidStr).toBe(true);
				});

				it("Input string length is below the minimum string length, should return false", () => {
					const isMinValidStr = stringValidator
						.checkStrMinLen("Hi", 5);

					expect(isMinValidStr).toBe(false);
				});
			});
		});

		describe("\"checkValidEmail\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(() =>
						stringValidator.checkValidEmail(undefined as any)
					).toThrow(GenericError);
					expect(() =>
						stringValidator.checkValidEmail(undefined as any)
					).toThrow("Input data is invalid, expected a string");
				});

				it("Passing array as an input data, should throw an error", () => {
					expect(
						() => stringValidator.checkValidEmail([] as any)
					).toThrow(
						GenericError
					);
					expect(
						() => stringValidator.checkValidEmail([] as any)
					).toThrow(
						"Input data is invalid, expected a string"
					);
				});
			});

			describe("Happy Path", () => {
				it("Input string is valid email address, should return true", () => {
					const isValidEmail = stringValidator
						.checkValidEmail("test@gmail.com");

					expect(isValidEmail).toBe(true);
				});

				it("Input string is invalid email address, should return false", () => {
					expect(stringValidator.checkValidEmail("test@.com.")).toBe(false);
					expect(stringValidator.checkValidEmail("test@")).toBe(false);
					expect(stringValidator.checkValidEmail("test@gmail.com.")).toBe(
						false
					);
					expect(stringValidator.checkValidEmail("test")).toBe(false);
					expect(stringValidator.checkValidEmail("test@gmail")).toBe(false);
					expect(stringValidator.checkValidEmail("TEST@GMAIL>COM")).toBe(
						false
					);
				});
			});
		});

		describe("\"allowEmptyStr\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(() =>
						stringValidator.allowEmptyStr(undefined as any)
					).toThrow(GenericError);
					expect(() =>
						stringValidator.allowEmptyStr(undefined as any)
					).toThrow("Input data is invalid, expected a string");
				});

				it("Passing array as an input data, should throw an error", () => {
					expect(
						() => stringValidator.allowEmptyStr([] as any)
					).toThrow(
						GenericError
					);
					expect(
						() => stringValidator.allowEmptyStr([] as any)
					).toThrow(
						"Input data is invalid, expected a string"
					);
				});
			});

			describe("Happy Path", () => {
				it("Input is an empty string, should return true", () => {
					expect(
						stringValidator.allowEmptyStr("")
					).toBe(true);
				});

				it("Input is a string, should return true", () => {
					expect(
						stringValidator.allowEmptyStr("Hello World!")
					).toBe(true);
				});
			});
		});

		describe("\"checkRegexMatch\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(() =>
						stringValidator
							.checkRegexMatch(undefined as any, new RegExp(""))
					).toThrow(GenericError);
					expect(() =>
						stringValidator
							.checkRegexMatch(undefined as any, new RegExp(""))
					).toThrow("Input data is invalid, expected a string");
				});

				it("Passing array as an input data, should throw an error", () => {
					expect(
						() => stringValidator
							.checkRegexMatch([] as any, new RegExp(""))
					).toThrow(
						GenericError
					);
					expect(
						() => stringValidator
							.checkRegexMatch([] as any, new RegExp(""))
					).toThrow(
						"Input data is invalid, expected a string"
					);
				});
			});

			describe("Happy Path", () => {
				const regexPattern = new RegExp(/^\d+$/);
				it("Invalid string that does not match regex, should return false", () => {
					expect(
						stringValidator
							.checkRegexMatch("4345a", regexPattern)
					).toBe(false);
				});

				it("Valid string that matches string, should return true", () => {
					expect(
						stringValidator
							.checkRegexMatch("98765", regexPattern)
					).toBe(true);
				});
			});
		});
	});
});
