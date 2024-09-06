/* eslint-disable @typescript-eslint/no-explicit-any */

import { GenericError, ObjectValidatorImpl } from "../../../src/utils";



describe("Basic Input Validation", () => {
	const objectValidation = new ObjectValidatorImpl();

	describe("\"Object Validation\" class", () => {
		describe("\"checkFieldExist\" method", () => {
			describe("Exception Path", () => {
				it("Passing array as an input, should throw an error", () => {
					expect(() =>
						objectValidation
							.checkFieldExist([{ test: "value" }], "someField")
					).toThrow(GenericError);
					expect(() =>
						objectValidation
							.checkFieldExist([{ test: "value" }], "someField")
					).toThrow("Input data is invalid, expected an object");
				});
			});

			describe("Happy Path", () => {
				it("Passing the existing field as an input, should return true", () => {
					const isExist = objectValidation.checkFieldExist(
						{ car: "honda", bike: "hero" },
						"car"
					);
					expect(isExist).toBe(true);
				});

				it("Passing the non existing field as an input, should return false", () => {
					const isExist = objectValidation.checkFieldExist(
						{ car: "honda", bike: "hero" },
						"van"
					);
					expect(isExist).toBe(false);
				});
			});
		});

		describe("\"allowUndefinedField\" method", () => {
			describe("Happy Path", () => {
				it("Passing undefined as an input, should return true", () => {
					expect(
						objectValidation.allowUndefinedField(undefined)
					).toBe(true);
				});

				it("Passing other than undefined as an input, should return false", () => {
					expect(objectValidation.allowUndefinedField("Hello World!")).toBe(
						false
					);
					expect(objectValidation.allowUndefinedField(1)).toBe(false);
					expect(
						objectValidation.allowUndefinedField(true)
					).toBe(false);
					expect(
						objectValidation.allowUndefinedField({})
					).toBe(false);
					expect(
						objectValidation.allowUndefinedField([])
					).toBe(false);
					expect(objectValidation.allowUndefinedField("")).toBe(false);
					expect(objectValidation.allowUndefinedField(0)).toBe(false);
					expect(
						objectValidation.allowUndefinedField(false)
					).toBe(false);
				});
			});
		});

		describe("\"allowFields\" method", () => {
			describe("Exception Path", () => {
				it("Passing undefined as an input data, should throw an error", () => {
					expect(() =>
						objectValidation.allowFields(undefined as any, [])
					).toThrow(GenericError);
					expect(() =>
						objectValidation.allowFields(undefined as any, [])
					).toThrow("Input data is invalid, expected an object");
				});

				it("Passing array as an input data, should throw an error", () => {
					expect(
						() => objectValidation.allowFields([] as any, [])
					).toThrow(
						GenericError
					);
					expect(
						() => objectValidation.allowFields([] as any, [])
					).toThrow(
						"Input data is invalid, expected an object"
					);
				});

				it("Passing undefined for fields input, should throw an error", () => {
					expect(() =>
						objectValidation.allowFields({}, undefined as any)
					).toThrow(GenericError);
					expect(() =>
						objectValidation.allowFields({}, undefined as any)
					).toThrow("Fields input is invalid, expected an array of strings");
				});

				it("Passing other than array of strings for fields input, should throw an error", () => {
					expect(() =>
						objectValidation.allowFields({}, [9 as any, 10 as any])
					).toThrow(GenericError);
					expect(() =>
						objectValidation.allowFields({}, [9 as any, 10 as any])
					).toThrow("Fields input is invalid, expected an array of strings");
					expect(() =>
						objectValidation.allowFields({}, [{} as any, {} as any])
					).toThrow("Fields input is invalid, expected an array of strings");
					expect(() =>
						objectValidation.allowFields({}, [{} as any, {} as any])
					).toThrow("Fields input is invalid, expected an array of strings");
					expect(() =>
						objectValidation
							.allowFields({}, [true as any, false as any])
					).toThrow("Fields input is invalid, expected an array of strings");
					expect(() =>
						objectValidation
							.allowFields({}, [true as any, false as any])
					).toThrow("Fields input is invalid, expected an array of strings");
				});
			});

			describe("Happy Path", () => {
				it("Passing valid input data and fields, should return true", () => {
					expect(
						objectValidation.allowFields({ car: "honda", bike: "Hero" }, [
							"car",
							"bike",
						])
					).toStrictEqual({ isValid: true });
				});

				it("Passing extra fields to an input data, should return false", () => {
					expect(
						objectValidation.allowFields({ car: "honda", bike: "Hero" }, [
							"car"
						])
					).toStrictEqual({ isValid: false, message: "bike is forbidden" });
				});
			});
		});
	});
});
