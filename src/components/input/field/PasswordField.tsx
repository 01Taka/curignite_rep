import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface PasswordFieldProps {
  password: string;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ password, onPasswordChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className='flex items-center'>
        <TextField
            className='w-full'
            id="standard-basic"
            label="Password"
            variant="standard"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={onPasswordChange}
        />
        <InputAdornment
            position="end"
            className='pt-4'
        >
            <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={(event) => event.preventDefault()}
            >
            {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
        </InputAdornment>
    </div>
    );
};

export default PasswordField;
