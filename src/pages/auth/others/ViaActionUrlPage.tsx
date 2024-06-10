import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ViaActionUrlView from './ViaActionUrlView';
import { actionNavigation, checkActionCode } from './handleViaActionUrl';
import { getEmailData, getPasswordData } from '../../../functions/localStorage/authData';
import { resendEmail } from '../../../firebase/auth/signUp';

const ViaActionUrlPage: React.FC = () => {
  const [isFailed, setIsFailed] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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
    const email = getEmailData();
    const password = getPasswordData();
    try {
      await resendEmail(email, password);
      setMessage('メールを再送信しました。')
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    }
    setResendDisabled(false);
  };

  // Function to handle account recreation
  const handleRecreateAccount = () => {
    navigate('/create-account');
  };

  return (
    <ViaActionUrlView 
      isFailed={isFailed}
      emailForSignIn={getEmailData()}
      error={error}
      message={message}
      resendDisabled={resendDisabled}
      onResendEmail={handleResendEmail}
      onRecreateAccount={handleRecreateAccount}
    />
  );
};

export default ViaActionUrlPage;
