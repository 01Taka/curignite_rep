import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { FormStateChangeFunc, SelectItem } from '../../../types/util/componentsTypes';

interface RadioGroupFieldProps<T extends string | number> {
  label: string;
  name: string;
  selectItems: SelectItem<T>[];
  value: T;
  onChange: FormStateChangeFunc;
}

const RadioGroupField = <T extends string | number>({
  label,
  name,
  selectItems,
  value,
  onChange,
}: RadioGroupFieldProps<T>) => {
  // 選択肢に一致する value があるかチェック
  const isValidValue = selectItems.some(item => item.value === value);

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel id={`radio-${name}-label`}>{label}</FormLabel>
      <RadioGroup
        aria-labelledby={`radio-${name}-label`}
        name={name}
        value={isValidValue ? value : ''}
        onChange={onChange}
      >
        {selectItems.map((item, index) => (
          <FormControlLabel
            key={index}
            value={item.value}
            control={<Radio />}
            label={item.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioGroupField;
