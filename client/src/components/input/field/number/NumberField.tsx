import React, { useEffect } from 'react';
import { SxProps, TextField } from '@mui/material';
import { FormStateChangeAction } from '../../../../types/app/formStateTypes';

interface NumberFieldProps {
  value: number | string;
  name: string;
  label?: string;
  initialValue?: number;
  min?: number;
  max?: number;
  onChangeFormState: (action: FormStateChangeAction) => void;
  fullWidth?: boolean;
  sx?: SxProps;
}

const NumberField = ({
  value,
  name,
  label = name,
  initialValue,
  min = -Infinity,
  max = Infinity,
  onChangeFormState,
  fullWidth = true,
  sx
}: NumberFieldProps) => {
  useEffect(() => {
    if (initialValue !== undefined && value === '') {
      onChangeFormState({ name, value: initialValue.toString() });
    }
  }, [initialValue, value, name, onChangeFormState]);

  const clampValue = (num: number) => Math.min(Math.max(num, min), max);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = parseFloat(e.target.value);
    if (!isNaN(inputValue)) {
      e.target.value = clampValue(inputValue).toString();
    }
    onChangeFormState({ ...e.target });
  };
  
  const getDisplayValue = (val: number | string): string => {
    const numValue = parseFloat(val.toString());
    return !isNaN(numValue) ? numValue.toString() : '';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isNaN(parseFloat(e.target.value))) {
      onChangeFormState({ name, value: initialValue || min !== -Infinity ? min.toString() : max !== Infinity ? max.toString() : '0' })
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
      fullWidth={fullWidth}
      sx={sx}
    />
  );
};

export default NumberField;
