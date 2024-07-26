import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectFieldChange, SelectItem } from '../../../types/componentsTypes';

// ジェネリック型に制約を追加
interface SelectFieldProps<T extends string | number> {
  label: string;
  name: string;
  selectItems: SelectItem<T>[];
  value: T;
  onChange: SelectFieldChange;
}

// ジェネリック型 T を使用してコンポーネントを定義
const SelectField = <T extends string | number>({ label, name, selectItems, value, onChange }: SelectFieldProps<T>) => {
  // 選択肢に一致する value があるかチェック
  const isValidValue = selectItems.some(item => item.value === value);

  return (
    <FormControl variant="standard" fullWidth>
      <InputLabel id={`select-${label}-label`} htmlFor={`select-${label}`}>
        {label}
      </InputLabel>
      <Select
        variant="filled"
        labelId={`select-${label}-label`}
        id={`select-${label}`}
        type="select"
        name={name}
        value={isValidValue ? value : ''} // 無効な値の場合、空文字を設定
        onChange={onChange}
      >
        {selectItems.map((item, index) => (
          <MenuItem key={index} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectField;
