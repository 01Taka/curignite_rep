// SignUpIndexView.tsx
import React from 'react';
import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';
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
            <div className='px-6 py-12 mx-2 mt-4 bg-gray-100 rounded-xl'>
                <Heading children='みんなの知識がここに。' level={0} className='text-end mr-4'/>
            </div>
            
            <Heading children='今すぐ参加しよう' level={1} className='mt-8'/>
            <div className='mt-8'>
                <Button variant="outlined" size="large" onClick={onGoogleSignUp}>Googleで登録</Button>
            </div>
            <div className='mt-4 w-3/5'>
                <Divider>または</Divider>
            </div>
            <div className='mt-4'>
                <Button onClick={onCreateAccount} variant="contained" size="large">
                    アカウントを作成
                </Button>
            </div>
            <div className='flex flex-col justify-center mt-16 mb-12'>
                <Heading children='アカウントをお持ちの場合' level={3} className='mb-1'/>
                <Button onClick={onSignIn} variant="outlined" size="large">
                    ログイン
                </Button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </FormContainer>
    )
};

export default SignUpIndexView;
