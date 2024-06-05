import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface PasswordFieldProps {
  password: string;
  label?: string;
  name?: string;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    password,
    label = 'Password',
    name = 'password',
    onPasswordChange
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const switchShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <FormControl variant="standard" className='w-full h-14'>
            <InputLabel htmlFor={name}>{label}</InputLabel>
            <Input
                id={name}
                name={name}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={onPasswordChange}
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={switchShowPassword}
                        onMouseDown={switchShowPassword}
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
                }
            />
        </FormControl>
    );
};

export default PasswordField