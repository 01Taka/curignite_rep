// SignUpIndexView.tsx
import React from 'react';
import Divider from '@mui/material/Divider';
import { Alert, Button } from '@mui/material';
import { FormContainer, Heading } from '../../../../components/container/containerIndex';

interface SignUpIndexViewProps {
    error: string;
    onCreateAccount: () => void;
    onGoogleSignUp: () => void;
    onSignIn: () => void;
}

const SignUpIndexView: React.FC<SignUpIndexViewProps> = ({
    error,
    onCreateAccount,
    onGoogleSignUp,
    onSignIn,
}) => {
  return (
        <FormContainer>
            <div className='sm:px-6 sm:py-12 sm:mx-2 sm:mt-4 bg-gray-100 rounded-xl  sm:3 py-6 mx-1 mt-2'>
                <Heading children='みんなの知識がここに。' level={0} className='text-end mr-4'/>
            </div>
            
            <Heading children='今すぐ参加しよう' level={1} className='mt-10'/>
            <div className='mt-10 sm:w-80 w-64'>
                <div className='flex flex-col w-full'>
                    <Button variant="outlined" size="large" onClick={onGoogleSignUp} children="Googleで登録" />
                </div>
                <div className='mt-5 w-full'>
                    <Divider>または</Divider>
                </div>
                <div className='flex flex-col mt-5 w-full'>
                    <Button onClick={onCreateAccount} variant="contained" size="large" children="アカウントを作成" />
                </div>
                <div className='flex flex-col items-center mt-16 mb-12 w-full'>
                    <Heading children='アカウントをお持ちの場合' level={3} className='mb-1'/>
                    <div>

                    </div>
                    <div className='flex flex-col w-full'>
                        <Button onClick={onSignIn} variant="outlined" size="large" children="ログイン" />
                    </div>
                </div>
            </div>
            {error && <Alert severity='error'>{error}</Alert>}
        </FormContainer>
    )
};

export default SignUpIndexView;
