import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ViaActionUrlView from './ViaActionUrlView';
import { actionNavigation, checkActionCode } from './handleViaActionUrl';
import { resendEmail } from '../../../firebase/auth/signUp';
import { authStorage } from '../../../functions/localStorage/storages';
import { AuthStorageProps } from '../../../types/app/localStorageTypes';
import { authPaths } from '../../../types/path/authPaths';

const ViaActionUrlPage: React.FC = () => {
  const [authData, setAuthData] = useState<Partial<AuthStorageProps>>();
  const [isFailed, setIsFailed] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const data = authStorage.getDataAllAtOnce();
    if (data) {
      setAuthData(data);
    }
  }, [])

  useEffect(() => {
    const handleTransition = async () => {
      const queryParams = new URLSearchParams(location.search);
      const modeParam = queryParams.get('mode');
      const actionCode = queryParams.get('oobCode');
      const lang = queryParams.get('lang') || 'en';

      const isValidCode = await checkActionCode(actionCode, lang);

      if (modeParam && isValidCode) {
        actionNavigation(modeParam, navigate);
      } else {
        setIsFailed(true);
      }
    };

    handleTransition();
  }, [location.search, navigate]);

  // Function to handle resend email action
  const handleResendEmail = async () => {
    setResendDisabled(true);
    setError('');
    setMessage('');
    const email = authData?.email;
    const password = authData?.password;
    if (password && email) {
      try {
        await resendEmail(email, password);
        setMessage('メールを再送信しました。')
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    } else {
      setError("パスワードとメールの情報が不足しています。")
    }

    setResendDisabled(false);
  };

  // Function to handle account recreation
  const handleRecreateAccount = () => {
    navigate(authPaths.createAccount);
  };

  return (
    <ViaActionUrlView 
      isFailed={isFailed}
      emailForSignIn={authData?.email || null}
      error={error}
      message={message}
      resendDisabled={resendDisabled}
      onResendEmail={handleResendEmail}
      onRecreateAccount={handleRecreateAccount}
    />
  );
};

export default ViaActionUrlPage;
