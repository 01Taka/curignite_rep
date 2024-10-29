import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { FormStateChangeFunc, SelectFieldChange, SelectItem } from '../../../types/util/componentsTypes';
import { useMemo } from 'react';

// ジェネリック型に制約を追加
interface SelectFieldProps<T extends string | number> {
  label: string;
  name: string;
  selectItems: SelectItem<T>[];
  exceptValues?: (string | number)[];
  value: T;
  variant?: "standard" | "filled" | "outlined";
  onChange: FormStateChangeFunc;
}

// ジェネリック型 T を使用してコンポーネントを定義
const SelectField = <T extends string | number>({ label, name, selectItems, exceptValues = [], value, variant = "filled", onChange }: SelectFieldProps<T>) => {
  // 選択肢に一致する value があるかチェック
  const isValidValue = selectItems.some(item => item.value === value);
  const items = useMemo(() => {
    return selectItems.filter(item => !exceptValues.includes(item.value));
  }, [selectItems, exceptValues])

  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel id={`select-${label}-label`} htmlFor={`select-${label}`}>
        {label}
      </InputLabel>
      <Select
        variant={variant}
        labelId={`select-${label}-label`}
        id={`select-${label}`}
        type="select"
        name={name}
        value={isValidValue ? value : ''} // 無効な値の場合、空文字を設定
        onChange={onChange as SelectFieldChange}
      >
        {items.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectField;
