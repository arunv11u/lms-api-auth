


export abstract class PasswordChecker {
	abstract generateHash(password: string): Promise<string>;
	abstract isMatch(password: string, hash: string): Promise<boolean>;
	abstract validate(password: string): void;
}