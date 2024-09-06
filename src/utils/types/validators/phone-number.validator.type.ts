


export interface PhoneNumberValidator {
	isValidNumber(number: string): boolean;
	getRegionCode(number: string): string;
}