// AuthIndexView.tsx
import React from 'react';
import Divider from '@mui/material/Divider';
import { Alert } from '@mui/material';
import { FormContainer, Heading } from '../../../components/container/containerIndex';
import CircularButton from '../../../components/input/button/CircularButton';

interface AuthIndexViewProps {
    error: string;
    onCreateAccount: () => void;
    onGoogleSignUp: () => void;
    onSignIn: () => void;
}

const AuthIndexView: React.FC<AuthIndexViewProps> = ({
    error,
    onCreateAccount,
    onGoogleSignUp,
    onSignIn,
}) => {
  return (
        <FormContainer flexCenter>
            <div className='sm:px-6 sm:py-8 sm:mx-2 bg-gray-100 rounded-xl py-6 mx-1 mt-2'>
                <Heading children='みんなの知識がここに。' level={0} className='text-end mr-4'/>
            </div>
            
            <Heading children='今すぐ参加しよう' level={1} className='mt-10'/>
            <div className='mt-10 sm:w-96 w-64'>
                <div className='flex justify-center items-center'>
                    <CircularButton size="x4l" bgColor="main" onClick={onCreateAccount}>
                        アカウント<br/>を作成
                    </CircularButton>
                    <Divider orientation='vertical'>OR</Divider>
                    <CircularButton size="x4l" looks="frame" bgColor="main" onClick={onGoogleSignUp} >
                        Google<br/>で登録
                    </CircularButton>
                </div>

                <div className='flex justify-center items-center space-x-4 py-2 mt-10 rounded-lg bg-secondaryBase'>
                    <Heading children='アカウントをお持ちの場合' level={3} />
                    <CircularButton size="lg" looks="frame" bgColor="main" onClick={onSignIn}>
                        ログイン
                    </CircularButton>
                </div>
            </div>
            {error && <Alert severity='error'>{error}</Alert>}
        </FormContainer>
    )
};

export default AuthIndexView;
