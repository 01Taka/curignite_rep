import React from 'react';
import { TextField } from '@mui/material';

interface NumberFieldProps {
  value: number | string;
  label: string;
  initialValue?: number;
  min?: number;
  max?: number;
  onValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({ value, label, min = -Infinity, max = Infinity, onValueChange }) => {
    const clamp = (value: number, min: number, max: number): number => {
        return Math.min(Math.max(value, min), max);
    }

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!!e.target.value) {
            const inputValue = parseFloat(e.target.value);
            const clampedValue = clamp(inputValue, min, max);
            e.target.value = clampedValue.toString();
            
        }

        onValueChange(e);
    }

    const setValue = (value: string | number): string => {
        value = parseFloat(value.toString());
        if (value) {
            return value.toString();
        }
        return "";
    }

    return (
        <TextField
        className='w-full h-14'
        id={label}
        name={label}
        label={label}
        variant="standard"
        type="number"
        value={setValue(value)}
        onChange={handleValueChange}
        fullWidth
        />
    );
};

export default NumberField;
