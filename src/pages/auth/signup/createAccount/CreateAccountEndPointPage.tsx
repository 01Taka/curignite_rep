import React, { useEffect, useState } from 'react';
import { getEmailForSignUp } from '../../../../firebase/auth/signUp';

const CreateAccountEndPointPage: React.FC = () => {
  const [email, setEmail] = useState('@Emails');

  useEffect(() => {
    const emailForSignIn = getEmailForSignUp();
    if (emailForSignIn) {
      setEmail(emailForSignIn);
    }
  }, []);

  return (
    <div className="m-32 p-8 bg-blue-50 rounded-xl">
      <div className="flex text-2xl">
        <span className='text-blue-600'>{email}</span>に認証用のメールを送信しました。
      </div>
      <p className="text-lg text-gray-600 mt-5">
        メールのリンクをクリックして、サインアップを完了してください。
      </p>
      <p className="text-lg text-gray-600">
        メールが届くまでには数分かかる場合があります。
      </p>
    </div>
  );
};

export default CreateAccountEndPointPage;
