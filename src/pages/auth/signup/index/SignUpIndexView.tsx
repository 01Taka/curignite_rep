// SignUpIndexView.tsx
import React from 'react';
import Divider from '@mui/material/Divider';
import { Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';



interface SignUpIndexViewProps {
    error: string;
    onCreateAccount: () => void;
    onGoogleSignUp: () => void;
}

const SignUpIndexView: React.FC<SignUpIndexViewProps> = ({
    error,
    onCreateAccount,
    onGoogleSignUp,
}) => {
  return (
    <div className='flex items-center justify-center w-screen h-screen bg-blue-50'>
        <div className='flex flex-col items-center w-2/5 h-5/6 bg-white'>
            <h1 className='text-6xl font-extrabold text-end w-96 mt-20'>みんなの知識がここに。</h1>
            <h2 className='text-4xl font-bold mt-16'>今すぐ参加しよう</h2>
            <div className='mt-10'>
                <Button variant="outlined" size="large" onClick={onGoogleSignUp}>Googleで登録</Button>
            </div>
            <div className='mt-4 w-3/5'>
                <Divider>または</Divider>
            </div>
            <div className='mt-4'>
                <Button variant="contained" size="large">
                    <Link to={'/create-account'} children='アカウントを作成'/>
                </Button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    </div>
  );
};

export default SignUpIndexView;
