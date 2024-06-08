import React from 'react'
import { Button } from '@mui/material';
import { FormContainer, Heading } from '../../../../components/container/containerIndex';
import { EmailField, PasswordField, UserNameField } from '../../../../components/input/inputIndex';

interface CreateAccountViewProps {
    username: string;
    email: string;
    password: string;
    error: string;
    submitDisabled: boolean;
    onUserNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailSignUp: (e: React.FormEvent) => void;
  }
  
  const CreateAccountView: React.FC<CreateAccountViewProps> = ({
    username,
    email,
    password,
    error,
    submitDisabled,
    onUserNameChange,
    onEmailChange,
    onPasswordChange,
    onEmailSignUp,
  }) => {
    const handleSubmit = (e: React.FormEvent<Element>) => {
        e.preventDefault();
        onEmailSignUp(e);
    };

    return (
            <FormContainer>
                <Heading children='アカウントを作成' level={1} className='mt-20'/>
                <form onSubmit={handleSubmit} className='flex flex-col items-center w-64 mt-12'>
                    <EmailField email={email} onEmailChange={onEmailChange} />
                    <UserNameField username={username} onUserNameChange={onUserNameChange} />
                    <PasswordField password={password} onPasswordChange={onPasswordChange} />
                    <div className='w-full my-16'>
                        <Button
                            disabled={submitDisabled}
                            type='submit'
                            size="large"
                            variant="contained"
                            className='w-full'
                            children="登録する"
                        />
                    </div>
                </form>
                {error && <p className='text-red-500 text-lg mb-8'>{error}</p>}
        </ FormContainer>
    )
}

export default CreateAccountView;