import { useState } from "react"
import { FormStateChangeEvent } from "../../types/util/componentsTypes";
import { handleFormStateChange } from "../../functions/utils";
import { keyMirror } from "../../functions/objectUtils";

const useFormState = <T extends Record<string, any>>(initialState: T) => {
  const [formState, setFormState] = useState<T>(initialState);
  const names = keyMirror(initialState);
  
  const onChange = (event: FormStateChangeEvent) => {
    handleFormStateChange(event, setFormState);
  }

  const resetFormState = () => {
    setFormState({ ...initialState });
  }

  const updateField = (fieldName: keyof T, value: any) => {
    setFormState((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  return { formState, names, setFormState, onChange, resetFormState, updateField };
}

export default useFormState;