import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Input, { InputProps } from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

interface PasswordFieldProps extends InputProps {
  label?: string;
  password: string,
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
    label = 'Password',
    password,
    onPasswordChange,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const switchShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <FormControl variant="filled" className='w-full h-14'>
            <InputLabel htmlFor={"password"}>{label}</InputLabel>
            <Input
                {...props}
                id="password"
                name="password"
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