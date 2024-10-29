import { useState, useCallback } from "react";
import { FormStateChangeEvent } from "../../../types/util/componentsTypes";
import { keyMirror } from "../../../functions/utils/objectUtils";
import { UpdateArrayFieldArgs } from "./AsyncHandlerTypes";
import { handleFormStateChange } from "../../../functions/utils/formUtils";

const useFormState = <T extends Record<string, any>>(initialState: T) => {
  const [formState, setFormState] = useState<T>(initialState);
  const names = keyMirror(initialState);

  const onChangeFormState = useCallback(
    (event: FormStateChangeEvent) => handleFormStateChange(event, setFormState),
    []
  );

  const resetFormState = useCallback(() => {
    setFormState({ ...initialState });
  }, [initialState]);

  const updateField = useCallback(
    (fieldName: keyof T, value: any) => {
      setFormState((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    },
    []
  );

  const updateArrayField = useCallback(
    ({ fieldName, index, data, deleteItem }: UpdateArrayFieldArgs<T>) => {
      setFormState((prevState) => {
        const prevData = prevState[fieldName];
        if (!Array.isArray(prevData)) {
          console.error(`Field ${String(fieldName)} is not an array`);
          return prevState;
        }

        const newData = [...prevData]; // Create an immutable copy

        if (deleteItem && index !== 'push' && index >= 0 && index < newData.length) {
          newData.splice(index, 1);
        }

        if (data === undefined) {
          console.error('delete以外の操作ではdataの入力が必須です。');
          return prevState;
        }

        if (index === "push") {
          newData.push(data);
        } else if (index >= 0 && index < newData.length) {
          newData[index] = data;
        }

        return {
          ...prevState,
          [fieldName]: newData,
        };
      });
    },
    []
  );

  return {
    formState,
    names,
    setFormState,
    onChangeFormState,
    resetFormState,
    updateField,
    updateArrayField,
  };
};

export default useFormState;
