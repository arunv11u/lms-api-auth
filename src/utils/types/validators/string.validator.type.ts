export interface StringValidator {
  checkStrMaxLen(input: string | undefined, length: number): boolean;
  checkStrMinLen(input: string | undefined, length: number): boolean;
  checkValidEmail(input: string | undefined): boolean;
  allowEmptyStr(input: string | undefined): boolean;
  checkRegexMatch(input: string | undefined, regexPattern: RegExp): boolean;
}
