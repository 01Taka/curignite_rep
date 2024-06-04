import React from 'react'
import { TextField } from '@mui/material';

interface StringFieldProps {
    text: string;
    label: string;
    onTextChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const StringField: React.FC<StringFieldProps> = ({
    text,
    label,
    onTextChange,
}) => {
  return (
    <TextField
        className='w-full h-14'
        id={label}
        name={label}
        label={label}
        variant="standard"
        type="text"
        value={text}
        onChange={onTextChange}
    />
  )
}

export default StringField