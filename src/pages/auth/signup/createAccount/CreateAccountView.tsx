import React, { useState } from 'react'
import { Button, TextField } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
interface CreateAccountViewProps {
    name: string;
    email: string;
    password: string;
    error: string;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailSignUp: (e: React.FormEvent) => void;
  }
  
  const CreateAccountView: React.FC<CreateAccountViewProps> = ({
    name,
    email,
    error,
    onNameChange,
    onEmailChange,
    onEmailSignUp,
  }) => {
    const [showPassword, setShowPassword] = useState(false);
    const switchShowPassword = () => {
        setShowPassword(!showPassword);
    }
  return (
    <div>
        <div className='flex items-center justify-center w-screen h-screen bg-blue-50'>
            <div className='flex flex-col items-center w-2/5 h-5/6 bg-white'>
                <h1 className='text-4xl font-bold mt-20'>アカウントを作成</h1>
                <form>
                    <div className='my-4'>
                        <TextField 
                            className='w-full'
                            id="standard-basic"
                            label="Email"
                            variant="standard"
                            type="email"
                            value={email}
                            onChange={onEmailChange}
                        />
                    </div>
                    <div className='my-4'>
                        <TextField 
                            className='w-full'
                            id="standard-basic"
                            label="UserName"
                            variant="standard"
                            type="text"
                            value={name}
                            onChange={onNameChange}
                        />
                    </div>
                    <div>
                    <FormControl variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                        <Input
                            id="standard-adornment-password"
                            type={showPassword ? 'text' : 'password'}
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
                    </div>
                    <div className='my-16'>
                        <Button
                            size="large"
                            variant="contained"
                            className='w-full'
                            children="次へ"
                            onClick={onEmailSignUp}
                            onMouseDown={onEmailSignUp}
                        />
                    </div>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    </div>
  )
}

export default CreateAccountView;