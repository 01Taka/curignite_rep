import React from 'react';
import FormContainer from '../../../components/container/FormContainer';
import Heading from '../../../components/container/Heading';
import { Box, Button, CircularProgress, Divider } from '@mui/material';

// ロード中のコンポーネント
const LoadingComponent: React.FC = () => (
  <Box>
    <div className='my-64'>
      <CircularProgress />
    </div>
  </Box>
);

interface ResendEmailProps {
  emailForSignIn: string;
  resendDisabled: boolean;
  onResendEmail: () => void;
  onRecreateAccount: () => void;
}

// Emailが見つかった場合のコンポーネント(メール再送信)
const ResendEmail: React.FC<ResendEmailProps> = ({ emailForSignIn, resendDisabled, onResendEmail, onRecreateAccount }) => {
  return (
    <div className='flex flex-col'>
        <div className='mt-3'>
            <span className='text-blue-600'>{emailForSignIn}</span>に認証用メールを再送信しますか？
        </div>
        <div className='flex flex-col mt-10'>
            <Button children='メールを再送信' variant="contained" onClick={onResendEmail} disabled={resendDisabled} />
        </div>
        <div className='mt-5 w-full'>
        <Divider>または</Divider>
        <div className='flex flex-col mt-5'>
            <Button children='アカウント作成をやり直す' variant="outlined" onClick={onRecreateAccount} />
        </div>
        </div>
    </div>
  );
};

interface RecreateAccountProps {
  onRecreateAccount: () => void;
}

// Emailがない場合のコンポーネント(アカウント作成やり直し)
const RecreateAccount: React.FC<RecreateAccountProps> = ({ onRecreateAccount }) => {
  return (
    <div className='flex flex-col'>
      <div className='mt-3 mb-6'>
        もう一度アカウント作成をやり直してください。
      </div>
      <Button children='やり直す' variant="contained" onClick={onRecreateAccount} />
    </div>
  );
};

// 条件分岐用のコンポーネント
interface AuthFailureProps {
  emailForSignIn: string;
  resendDisabled: boolean;
  onResendEmail: () => void;
  onRecreateAccount: () => void;
}

const AuthFailure: React.FC<AuthFailureProps> = ({
  emailForSignIn,
  resendDisabled,
  onResendEmail,
  onRecreateAccount,
}) => {
  return (
    <div className='flex flex-col text-xl my-16'>
      認証に失敗しました。
      {emailForSignIn ? (
        <ResendEmail
        emailForSignIn={emailForSignIn}
        resendDisabled={resendDisabled}
        onResendEmail={onResendEmail}
        onRecreateAccount={onRecreateAccount}
      />
      ) : (
        <RecreateAccount onRecreateAccount={onRecreateAccount} />
      )}
    </div>
  );
};

interface ViaActionUrlViewProps {
  isFailed: boolean;
  emailForSignIn: string;
  error: string;
  message: string;
  resendDisabled: boolean;
  onResendEmail: () => void;
  onRecreateAccount: () => void;
}

// メインコンポーネント
const ViaActionUrlView: React.FC<ViaActionUrlViewProps> = ({
  isFailed,
  emailForSignIn,
  error,
  message,
  resendDisabled,
  onResendEmail,
  onRecreateAccount,
}) => {
  return (
    <FormContainer>
      {!isFailed ? (
        <LoadingComponent />
      ) : (
        <>
          <Heading children='認証失敗' level={1} className='mt-16' />
          <AuthFailure
            emailForSignIn={emailForSignIn}
            resendDisabled={resendDisabled}
            onResendEmail={onResendEmail}
            onRecreateAccount={onRecreateAccount}
          />
        </>
      )}
      {message && <p className='text-green-500 text-lg mb-8'>{message}</p>}
      {error && <p className='text-red-500 text-lg mb-8'>{error}</p>}
    </FormContainer>
  );
}

export default ViaActionUrlView;
