import React from 'react';
import FormContainer from '../../../components/container/FormContainer';
import Heading from '../../../components/container/Heading';
import { Alert, Box, CircularProgress, Divider, Typography } from '@mui/material';
import CircularButton from '../../../components/input/button/CircularButton';

// ロード中のコンポーネント
const LoadingComponent: React.FC = () => (
  <Box className="flex justify-center items-center my-64">
    <CircularProgress />
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
    <div className="flex flex-col items-center space-y-6">
      <Typography variant="h5" className="text-center">
        <span className="text-blue-600">{emailForSignIn}</span>に
        <br />
        認証用メールを再送信しますか？
      </Typography>
      <div className="flex justify-center items-center sm:space-x-4 space-x-1">
        <CircularButton size="x4l" mobileSize='xl' bgColor="main" onClick={onResendEmail} invalidation={resendDisabled}>
          メールを<br />再送信
        </CircularButton>
        <Divider orientation="vertical" flexItem>OR</Divider>
        <CircularButton size="x4l" mobileSize='xl' textSize="xl" bgColor="main" looks="frame" onClick={onRecreateAccount} disabled={resendDisabled}>
          アカウント作成<br />をやり直す
        </CircularButton>
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
    <div className="flex flex-col items-center space-y-6">
      <Typography variant="h5" className="mt-3 mb-6 text-center sm:w-72 w-full">
        もう一度アカウント作成をやり直してください。
      </Typography>
      <CircularButton size="x4l" bgColor="main" onClick={onRecreateAccount}>
      やり直す
      </CircularButton>
    </div>
  );
};

// 条件分岐用のコンポーネント
interface AuthFailureProps {
  emailForSignIn: string | null;
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
    <div className="flex flex-col items-center text-xl my-16 space-y-6">
      <Typography variant="h6" className="text-center">
        認証に失敗しました。
      </Typography>
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
  emailForSignIn: string | null;
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
          <Heading level={1} className="mt-16 text-center">
            認証失敗
          </Heading>
          <AuthFailure
            emailForSignIn={emailForSignIn}
            resendDisabled={resendDisabled}
            onResendEmail={onResendEmail}
            onRecreateAccount={onRecreateAccount}
          />
        </>
      )}
      {message && <Typography className="text-green-500 text-lg text-center mb-8">{message}</Typography>}
      {error && <Alert severity="error" className="text-center">{error}</Alert>}
    </FormContainer>
  );
};

export default ViaActionUrlView;
