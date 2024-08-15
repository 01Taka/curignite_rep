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