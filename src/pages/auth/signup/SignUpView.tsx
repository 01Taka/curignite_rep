// SignUpView.tsx
import React from 'react';
import { Button, TextField } from '@mui/material';
import { PasswordField } from '../../../components/input/inputIndex';

interface SignUpViewProps {
  name: string;
  email: string;
  password: string;
  error: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailSignUp: (e: React.FormEvent) => void;
  onGoogleSignUp: () => void;
}

const SignUpView: React.FC<SignUpViewProps> = ({
  name,
  email,
  password,
  error,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onEmailSignUp,
  onGoogleSignUp,
}) => {
  return (
    <div className='flex items-center justify-center w-screen h-screen bg-blue-50'>
        <div className='flex flex-col items-center w-2/5 h-5/6 bg-white'>
          <h2 className='text-4xl font-bold mt-16 my-8'>Sign Up</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={onEmailSignUp}>
          <div className='my-4'>
              <TextField 
                className='w-full'
                id="standard-basic"
                label="User Name"
                variant="standard"
                type="text"
                value={name}
                onChange={onNameChange}
              />
            </div>
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
              <PasswordField
                password={password}
                onPasswordChange={onPasswordChange}
              />
            </div>
            <div className='my-16'>
              <Button
                size="large"
                variant="contained"
                className='w-full'
                children="Sign up"
              />
            </div>
          </form>
          <button onClick={onGoogleSignUp}>Sign Up with Google</button>
        </div>
    </div>
  );
};

export default SignUpView;
