import React, { useEffect } from 'react';
import { TextField } from '@mui/material';
import { FormStateChangeFunc } from '../../../types/util/componentsTypes';

interface NumberFieldProps {
  value: number | string;
  label: string;
  name?: string;
  initialValue?: number;
  min?: number;
  max?: number;
  onChange: FormStateChangeFunc;
}

const NumberField: React.FC<NumberFieldProps> = ({
  value,
  label,
  name = label,
  initialValue,
  min = -Infinity,
  max = Infinity,
  onChange,
}) => {
  useEffect(() => {
    if (initialValue !== undefined && value === '') {
      onChange({
        target: {
          name,
          value: initialValue.toString(),
          type: 'number',
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [initialValue, value, name, onChange]);

  const clampValue = (num: number) => Math.min(Math.max(num, min), max);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue)) {
      e.target.value = clampValue(inputValue).toString();
    }
    onChange(e);
  };
  
  const getDisplayValue = (val: number | string): string => {
    const numValue = parseFloat(val.toString());
    return !isNaN(numValue) ? numValue.toString() : '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isNaN(parseFloat(e.target.value))) {
      onChange({
        target: {
          name,
          value: initialValue || min !== -Infinity ? min.toString() : max !== Infinity ? max.toString() : '0',
          type: 'number',
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <TextField
      className="w-full h-14"
      id={name}
      name={name}
      label={label}
      variant="filled"
      type="number"
      value={getDisplayValue(value)}
      onChange={handleValueChange}
      onBlur={handleBlur}
      inputProps={{ min, max }}
      fullWidth
    />
  );
};

export default NumberField;
