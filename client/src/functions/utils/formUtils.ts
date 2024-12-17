import { CustomHTMLElement, FormStateChangeEvent, FormStateChangeFunc, SelectItem } from "../../types/util/componentsTypes";
import { seq } from "./dataStructureUtils/arrayUtils";


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

export const handleCallOnChange = <T, K extends CustomHTMLElement>(value: T, name: string, onChange: FormStateChangeFunc) => {
  const event: FormStateChangeEvent = {
    target: {
      name,
      value,
      type: typeof value
    },
  } as unknown as React.ChangeEvent<K>;
  onChange(event);
}


export const validateNumber = (value: any): number => {
  if (typeof value !== "number") {
    throw new Error(`Expected a number but received: ${value}`);
  }
  if (isNaN(value)) {
    throw new Error("The value is NaN (Not a Number).");
  }
  return value;
}

export const updateFiledByEvent = <T>(base: T, event: FormStateChangeEvent) => {
  return { ...base, [event.target.name]: event.target.value as T };
}

export const updateArrayByEvent = <T>(base: T[], index: number, event: FormStateChangeEvent): T[] => {
  if (!Array.isArray(base)) {
    console.error('データが配列型ではありません: ', base);
    return base;
  }
  
  if (index < 0 || index >= base.length) {
    console.error('存在しないインデックスです。: ', base, index);
    return base;
  }

  // 配列のコピーを作成し、指定のインデックスを更新
  const updatedArray = [...base];
  updatedArray[index] = event.target.value as T; // 明示的にT型にキャスト

  return updatedArray;
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