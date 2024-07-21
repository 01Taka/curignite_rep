import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Timestamp } from "firebase/firestore";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const handleFormStateChange = <T>(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    setFormState: React.Dispatch<React.SetStateAction<T>>,
  ) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
};
