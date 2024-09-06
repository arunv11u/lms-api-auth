
export interface NumberValidator {
    checkNumMaxVal(input: number | undefined, maxValue: number): boolean;
    checkNumMinVal(input: number | undefined, minValue: number): boolean;
}
