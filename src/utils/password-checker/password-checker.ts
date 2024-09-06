import { GenericError } from "../errors";
import { ErrorCodes, PasswordChecker } from "../types";
import bcrypt from "bcrypt";

export class PasswordCheckerImpl implements PasswordChecker {

	async generateHash(password: string): Promise<string> {
		return await bcrypt.hash(password, 10);
	}

	async isMatch(password: string, hash: string): Promise<boolean> {
		return await bcrypt.compare(password, hash);
	}

	validate(password: string): void {
		const isValid = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+,\-.;:'"<>=/?[\]{|}~])(?=.*[0-9]).{8,}$/)
			.test(password);

		if (!isValid) throw new GenericError({
			code: ErrorCodes.invalidPassword,
			error: new Error("Password is invalid"),
			errorCode: 400
		});
	}
}