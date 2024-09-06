/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ArrayValidator {
  checkMaxLen(input: Array<any> | undefined, length: number): boolean;
  checkMinLen(input: Array<any> | undefined, length: number): boolean;
  checkArrOfStr(input: Array<string> | undefined): boolean;
  checkArrOfNum(input: Array<number> | undefined): boolean;
  checkArrOfBool(input: Array<boolean> | undefined): boolean;
}
