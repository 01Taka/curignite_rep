import React from 'react';
import Divider from '@mui/material/Divider';
import { Button } from '@mui/material';
import { FormContainer, Heading } from '../../../../components/container/containerIndex';

interface SignInIndexViewProps {
    error: string;
    onGoogleSignIn: () => void;
    onEmailSignIn: () => void;
}

const SignInIndexView: React.FC<SignInIndexViewProps> = ({
    error,
    onGoogleSignIn,
    onEmailSignIn,
}) => {
  return (
        <FormContainer>
            <Heading children='ログインする' level={1} className='mt-20'/>
            <div className='mt-16'>
                <Button variant="outlined" size="large" onClick={onGoogleSignIn}>Googleでログイン</Button>
            </div>
            <div className='mt-4 w-3/5'>
                <Divider>または</Divider>
            </div>
            <div className='mt-4 mb-16'>
                <Button onClick={onEmailSignIn} variant="contained" size="large">
                    メールでログイン
                </Button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </FormContainer>
    )
};

export default SignInIndexView;
