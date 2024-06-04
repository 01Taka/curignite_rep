import React from 'react'
import { Button, TextField } from '@mui/material';
import { FormContainer, Heading } from '../../../../components/container/containerIndex';
import { EmailField, PasswordField, UserNameField } from '../../../../components/input/inputIndex';

interface CreateAccountViewProps {
    name: string;
    email: string;
    password: string;
    error: string;
    submitDisabled: boolean;
    onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onEmailSignUp: (e: React.FormEvent) => void;
  }
  
  const CreateAccountView: React.FC<CreateAccountViewProps> = ({
    name,
    email,
    password,
    error,
    submitDisabled,
    onNameChange,
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
                    <UserNameField username={name} onUserNameChange={onNameChange} />
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
        </ FormContainer>
    )
}

export default CreateAccountView;