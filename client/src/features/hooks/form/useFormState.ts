import { useState, useCallback } from "react";
import { keyMirror } from "../../../functions/utils/dataStructureUtils/objectUtils";
import { ArrayFieldChangeAction, FormStateChangeAction } from "../../../types/app/formStateTypes";

const useFormState = <T extends Record<string, any>>(initialState: T) => {
  const [formState, setFormState] = useState<T>(initialState);
  const names = keyMirror(initialState);

  const onChangeFormState = useCallback((action: FormStateChangeAction) => {
    setFormState((prev) => ({
      ...prev,
      [action.name]: action.value
    }));
  }, []);

  const resetFormState = useCallback(() => {
    setFormState({ ...initialState });
  }, [initialState]);

  const onChangeArrayField = useCallback((action: ArrayFieldChangeAction) => {
      const { operation, name } = action;
      setFormState((prev) => {
        const prevData = prev[name];

        if (!Array.isArray(prevData)) {
          console.error(`Field ${String(name)} is not an array`);
          return prev;
        }

        const newData = [...prevData];

        switch (operation) {
          case "replace":
            if (action.index >= 0 && action.index < newData.length) {
              newData[action.index] = action.value;
            }
            break;
          case "delete":
            if (action.index >= 0 && action.index < newData.length) {
              newData.splice(action.index, 1);
            }
            break;
          case "push":
            newData.push(action.value);
            break;
        }

        return {
          ...prev,
          [name]: newData,
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
    onChangeArrayField,
    resetFormState,
  };
};

export default useFormState;
