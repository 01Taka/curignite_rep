import { SelectItem } from "../../types/util/componentsTypes";
import { seq } from "./dataStructureUtils/arrayUtils";


export const validateNumber = (value: any): number => {
  if (typeof value !== "number") {
    throw new Error(`Expected a number but received: ${value}`);
  }
  if (isNaN(value)) {
    throw new Error("The value is NaN (Not a Number).");
  }
  return value;
}

export const createNumberSelectItems = (
  start: number,
  stop?: number,
  step: number = 1,
  labelMag: number = 1,
  labelUnit: string = ''
): SelectItem<number>[] => {
  const numbers = seq(start, stop, step);
  return numbers.map(number => ({ label: `${number * labelMag}${labelUnit}`, value: number }));
}