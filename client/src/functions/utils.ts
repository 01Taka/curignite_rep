import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FormStateChangeEvent } from "../types/util/componentsTypes";
import { ComparisonOperator, StringNumber } from "../types/util/utilTypes";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const handleFormStateChange = <T>(
  event: FormStateChangeEvent,
  setFormState: React.Dispatch<React.SetStateAction<T>>,
) => {
  const { name, value, type } = event.target;
  const fieldValue = type === 'checkbox' ? (event.target as HTMLInputElement).checked : value;

  setFormState((prevState) => ({
    ...prevState,
    [name]: fieldValue,
  }));
};

export const performComparison = (
  a: number | string, 
  b: number | string, 
  operator: ComparisonOperator
): boolean => {
  // 数値として比較する必要があるかチェック
  if (isNumeric(a) && isNumeric(b)) {
    a = Number(a);
    b = Number(b);
  } else {
    // 数値として比較できない場合は文字列として比較
    a = String(a);
    b = String(b);
  }
  
  switch (operator) {
    case '>':
      return a > b;
    case '>=':
      return a >= b;
    case '<':
      return a < b;
    case '<=':
      return a <= b;
    case '==':
      return a == b;
    case '!=':
      return a != b;
    case '===':
      return a === b;
    case '!==':
      return a !== b;
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
}

export const isNumeric = (value: string | number): boolean => {
  return typeof value === "number" ? Number.isFinite(value) : !isNaN(Number(value));
}
