import React from 'react'
import { TextField } from '@mui/material';

interface EmailFieldProps {
    email: string;
    onEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmailField: React.FC<EmailFieldProps> = ({
    email,
    onEmailChange,
}) => {
  return (
    <TextField 
        className='w-full h-14'
        id="email"
        name="email"
        label="Email"
        variant="filled"
        type="email"
        value={email}
        onChange={onEmailChange}
    />
  )
}

export default EmailField