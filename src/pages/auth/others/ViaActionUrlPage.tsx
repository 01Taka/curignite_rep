import React, { useEffect, useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEmailForAuth, verifyActionCode } from '../../../firebase/auth/signUp';
import ViaActionUrlView from './ViaActionUrlView';

const ViaActionUrlPage: React.FC = () => {
    const [isFailed, setIsFailed] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
  
    const handleNavigation = useCallback((action: string) => {
      switch (action) {
        case 'resetPassword':
          navigate('/reset-password');
          break;
        case 'verifyEmail':
          navigate('/user-initial-setup');
          break;
      }
    }, [navigate]);

    const checkActionCode = async (actionCode: string | null, lang: string): Promise<boolean> => {
      if (!actionCode) {
        console.error('アクションコードが取得できませんでした。');
        return false;
      }

      const result = await verifyActionCode(actionCode, lang);
      if (result.errorMessage) {
        console.error(result.errorMessage);
      }
      return result.isValid;
    }

    const handleTransition = async () => {
      const query = new URLSearchParams(location.search);
      
      const modeParam = query.get('mode');
      const actionCode = query.get('oobCode');
      const lang = query.get('lang') || 'en';

      const isValidCode = await checkActionCode(actionCode, lang);
      console.log(modeParam, isValidCode);
      
      if (modeParam && isValidCode) {
        handleNavigation(modeParam);
      } else {
        setIsFailed(true);
      }
    }
  
    useEffect(() => {
      handleTransition();
    }, [location.search]);


    // 認証失敗時用の関数
    const onResendEmail = () => {
      
    }

    const onRecreateAccount = () => {
      navigate('/create-account');
    }
  
    return <ViaActionUrlView 
      isFailed={isFailed}
      emailForSignIn={getEmailForAuth()}
      onResendEmail={onResendEmail}
      onRecreateAccount={onRecreateAccount}
    />;
}

export default ViaActionUrlPage;
