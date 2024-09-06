import { GenericError, PasswordChecker, PasswordCheckerImpl } from "../../../src/utils";



describe("Password Checker module", () => {
	let passwordChecker: PasswordChecker;

	beforeEach(() => {
		passwordChecker = new PasswordCheckerImpl();
	});

	describe("\"generateHash\" method", () => {
		describe("Happy path", () => {

			it("If provide password return the hash", () => {
				const password = "Password@2";
				const hash = passwordChecker.generateHash(password);
				expect(hash).toBeDefined();
			});

		});
	});

	describe("\"isMatch\" method", () => {
		describe("Happy path", () => {

			it("if password and the hash match return true", async () => {
				const password = "Password@2";
				const hash = await passwordChecker.generateHash(password);
				const response =
                    await passwordChecker.isMatch(password, hash);
				expect(response).toBeTruthy();
			});
		});
		describe("Exception path", () => {

			it("If the password and hash not match", async () => {
				const password = "Password@2";
				const invalidPassword = "Password@1";
				const hash = await passwordChecker.generateHash(password);
				const response =
                    await passwordChecker.isMatch(invalidPassword, hash);
				expect(response).toBeFalsy();
			});
		});
	});

	describe("\"validate\" method", () => {
		describe("Exception Path", () => {
			it("If password has less than 8 characters, should throw error", () => {
				expect(() => passwordChecker.validate("Du!1"))
					.toThrow(GenericError);
				expect(() => passwordChecker.validate("Du!1"))
					.toThrow("Password is invalid");
			});

			it("If password has no lower case character, should throw error", () => {
				expect(() => passwordChecker.validate("D123456!"))
					.toThrow(GenericError);
				expect(() => passwordChecker.validate("D123456!"))
					.toThrow("Password is invalid");
			});

			it("If password has no upper case character, should throw error", () => {
				expect(() => passwordChecker.validate("d123456!"))
					.toThrow(GenericError);
				expect(() => passwordChecker.validate("d123456!"))
					.toThrow("Password is invalid");
			});

			it("If password has no special character, should throw error", () => {
				expect(() => passwordChecker.validate("Du123456"))
					.toThrow(GenericError);
				expect(() => passwordChecker.validate("Du123456"))
					.toThrow("Password is invalid");
			});

			it("If password has no digit, should throw error", () => {
				expect(() => passwordChecker.validate("Dummy!&^"))
					.toThrow(GenericError);
				expect(() => passwordChecker.validate("Dummy!&^"))
					.toThrow("Password is invalid");
			});
		});

		describe("Happy Path", () => {
			it("If password has minimum 8 characters, 1 upper case character, 1 lower case character, 1 digit, 1 special character, should not throw error", () => {
				expect(() => passwordChecker.validate("Dummy!12"))
					.not
					.toThrow(GenericError);
			});
		});
	});
});