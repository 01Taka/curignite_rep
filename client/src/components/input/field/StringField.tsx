import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface StringFieldProps extends Omit<TextFieldProps, 'variant'> {
  label: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
}

const StringField: React.FC<StringFieldProps> = ({ label, disabled, required, errorMessage, ...props }) => {
  return (
    <TextField
      {...props}
      label={label}
      disabled={disabled}
      required={required}
      variant="filled"
      error={!!errorMessage}
      helperText={errorMessage}
      fullWidth
    />
  );
};

export default StringField;
