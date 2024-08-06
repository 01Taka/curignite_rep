import React, { FormEvent } from 'react'
import { Alert, Button } from '@mui/material';
import { FormContainer, Heading } from '../../../../components/container/containerIndex';
import { EmailField, PasswordField, UserNameField } from '../../../../components/input/inputIndex';
import { FormStateChangeFunc } from '../../../../types/util/componentsTypes';

export interface CreateAccountFormState {
    username: string;
    email: string;
    password: string;
}

interface CreateAccountViewProps {
    formState: CreateAccountFormState;
    error: string;
    submitDisabled: boolean;
    onFormStateChange: FormStateChangeFunc
    onEmailSignUp: (e: FormEvent) => void;
}
  
  const CreateAccountView: React.FC<CreateAccountViewProps> = ({
    formState,
    error,
    submitDisabled,
    onFormStateChange,
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
                    <EmailField email={formState.email} onEmailChange={onFormStateChange} />
                    <UserNameField username={formState.username} onUserNameChange={onFormStateChange} />
                    <PasswordField password={formState.password} onPasswordChange={onFormStateChange} />
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
                {error && <Alert severity='error'>{error}</Alert>}
        </ FormContainer>
    )
}

export default CreateAccountView;