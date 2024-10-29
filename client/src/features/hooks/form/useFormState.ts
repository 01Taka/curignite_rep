import { useState } from "react"
import { FormStateChangeEvent } from "../../../types/util/componentsTypes";
import { keyMirror } from "../../../functions/utils/objectUtils";
import { UpdateArrayFieldArgs } from "./AsyncHandlerTypes";
import { handleFormStateChange } from "../../../functions/utils/formUtils";

const useFormState = <T extends Record<string, any>>(initialState: T) => {
  const [formState, setFormState] = useState<T>(initialState);
  const names = keyMirror(initialState);
  
  const onChangeFormState = (event: FormStateChangeEvent) => {
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

  const updateArrayField = (
    args: UpdateArrayFieldArgs<T>
  ) => {
    const { fieldName, index, data, deleteItem } = args;
    const prevData = formState[fieldName];
  
    if (!Array.isArray(prevData)) {
      console.error(`Field ${String(fieldName)} is not an array`);
      return;
    }
  
    // イミュータブルなコピーを作成
    const newData = [...prevData];
  
    // 項目の追加
    if (index === "push") {
      if (data !== undefined) {
        newData.push(data);
        updateField(fieldName, newData);
      }
      return;
    }
  
    // 項目の削除
    if (deleteItem) {
      if (index >= 0 && index < newData.length) {
        newData.splice(index, 1);
        updateField(fieldName, newData);
      }
      return;
    }
  
    // 項目の更新
    if (data !== undefined && index >= 0 && index < newData.length) {
      newData[index] = data;
      updateField(fieldName, newData);
    }
  };  

  return { formState, names, setFormState, onChangeFormState, resetFormState, updateField, updateArrayField };
}

export default useFormState;