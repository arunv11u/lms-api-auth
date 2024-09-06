/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DataTypeValidator {
  checkFieldIsString(input: string | undefined): boolean;
  checkFieldIsNumber(input: number | undefined): boolean;
  checkFieldIsBoolean(input: boolean | undefined): boolean;
  checkFieldIsObject(input: Record<string, any> | undefined): boolean;
  checkFieldIsArray(input: Array<any> | undefined): boolean;
}
