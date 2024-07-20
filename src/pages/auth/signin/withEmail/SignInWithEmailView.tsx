import React from 'react'
import { Alert, Button } from '@mui/material';
import { FormContainer, Heading } from '../../../../components/container/containerIndex';
import { EmailField, PasswordField } from '../../../../components/input/inputIndex';

interface SignInWithEmailViewProps {
    email: string;
    password: string;
    submitDisabled: boolean;
    error: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailSignIn: (e: React.FormEvent) => void;
}

const SignInWithEmailView: React.FC<SignInWithEmailViewProps> = ({
    email,
    password,
    submitDisabled,
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
                        disabled={submitDisabled}
                    />
                </div>
            </form>
            {error && <Alert severity='error'>{error}</Alert>}
        </FormContainer>
    )
}

export default SignInWithEmailView;