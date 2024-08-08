import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FormStateChangeEvent } from "../types/util/componentsTypes";

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

export type KeyMirrorObject<T> = { [K in keyof T]: K };

export const keyMirror = <T extends object>(obj: T): KeyMirrorObject<T> => {
  const mirrored = {} as KeyMirrorObject<T>;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      mirrored[key] = key;
    }
  }
  return mirrored;
};

// nullとundefinedを取り除く
export const removeNullAndUndefined = <T>(array: (T | null | undefined)[]): T[] => {
  return array.filter((item): item is T => item !== null && item !== undefined);
}

// 一意なデータを取得する関数
export const uniqueByProperty = <T, K extends keyof T>(array: T[], key: K): T[] => {
  // 特定のプロパティで重複を排除するために Map を使用
  const uniqueMap = new Map<T[K], T>(
    array.map(item => [item[key], item])
  );

  // Map の値を配列に変換して返す
  return Array.from(uniqueMap.values());
};
