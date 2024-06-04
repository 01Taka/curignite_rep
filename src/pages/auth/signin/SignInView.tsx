import React from 'react'
import { Button, TextField } from '@mui/material';
import { FormContainer, Heading } from '../../../components/container/containerIndex';
import { EmailField, PasswordField } from '../../../components/input/inputIndex';

interface SignInViewProps {
    email: string;
    password: string;
    error: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailSignIn: (e: React.FormEvent) => void;
}

const SignInView: React.FC<SignInViewProps> = ({
    email,
    password,
    error,
    onEmailChange,
    onPasswordChange,
    onEmailSignIn,
}) => {
    const handleSubmit = (e: React.FormEvent<Element>) => {
        e.preventDefault();
        onEmailSignIn(e);
    }

    return (
        <FormContainer>
            <Heading children='ログインする' level={1} className='mt-20'/>
            <form onSubmit={handleSubmit} className='w-64 mt-12'>
                <EmailField email={email} onEmailChange={onEmailChange} />
                <PasswordField password={password} onPasswordChange={onPasswordChange} />
                <div className='w-full my-16'>
                    <Button
                        type='submit'
                        size="large"
                        variant="contained"
                        className='w-full'
                        children="ログイン"
                    />
                </div>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </FormContainer>
    )
}

export default SignInView;