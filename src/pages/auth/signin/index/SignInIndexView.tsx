import React from 'react';
import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';
import { FormContainer, Heading } from '../../../../components/container/containerIndex';
import { EmailField } from '../../../../components/input/inputIndex';

interface SignInIndexViewProps {
    email: string;
    error: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onGoogleSignIn: () => void;
    onEmailSignIn: () => void;
}

const SignInIndexView: React.FC<SignInIndexViewProps> = ({
    email,
    error,
    onEmailChange,
    onGoogleSignIn,
    onEmailSignIn,
}) => {
  return (
        <FormContainer>
            <Heading children='ログインする' level={1} className='mt-16'/>
            <div className='mt-16 sm:w-80 w-64'>
                <div className='flex flex-col'>
                    <Button variant="outlined" size="large" onClick={onGoogleSignIn}>Googleでログイン</Button>
                </div>
            <div className='mt-10 w-full'>
                <Divider>または</Divider>
            </div>
            <div className='flex flex-col justify-center mt-8 mb-16 w-full'>
                <div className='flex flex-col bg-gray-50 px-3 py-4 rounded-xl'>
                    <Heading children='メールでログイン' level={4}/>
                    <EmailField email={email} onEmailChange={onEmailChange} />
                    <div className='flex flex-col mt-4'>
                        <Button children="次へ" variant="contained" size="large" onClick={onEmailSignIn} disabled={!email} />
                    </div>
                </div>
                <div className='flex flex-col mt-8'>
                    <Button children='パスワードを忘れた場合はこちら' variant='outlined' size='large' />
                </div>
            </div>
            </div>


            {error && <p className='text-red-500 text-lg mb-8'>{error}</p>}
        </FormContainer>
    )
};

export default SignInIndexView;
