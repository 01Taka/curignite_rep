import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface MultilineFieldProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  rows: number;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
}

const MultilineField: React.FC<MultilineFieldProps> = ({ label, rows, disabled, required, errorMessage, ...props }) => {
  return (
    <TextField
      {...props}
      label={label}
      disabled={disabled}
      required={required}
      multiline
      rows={rows}
      variant="filled"
      error={!!errorMessage}
      helperText={errorMessage}
      fullWidth
    />
  );
};

export default MultilineField;
