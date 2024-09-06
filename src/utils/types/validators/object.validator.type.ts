/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ObjectValidator {
  checkFieldExist(input: Record<string, any>, field: string): boolean;
  allowUndefinedField(input: any): boolean;
  allowFields(
	input: Record<string, any>, 
	fields: string[]
): { isValid: boolean, message?: string };
}
