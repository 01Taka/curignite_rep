import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { SelectItem } from '../../../types/util/componentsTypes';
import { FormStateChangeAction } from '../../../types/app/formStateTypes';

interface RadioGroupFieldProps<T extends string | number> {
  label: string;
  name: string;
  selectItems: SelectItem<T>[];
  value: T;
  onChangeFormState: (action: FormStateChangeAction) => void;
}

const RadioGroupField = <T extends string | number>({
  label,
  name,
  selectItems,
  value,
  onChangeFormState,
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
        onChange={(e) => onChangeFormState({ name: e.target.name, value: e.target.value })}
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
