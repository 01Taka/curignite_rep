import React, { useEffect, useState } from 'react';
import { authStorage } from '../../../../functions/localStorage/storages';

const CreateAccountEndPointPage: React.FC = () => {
  const [email, setEmail] = useState('@Emails');

  useEffect(() => {
    const emailForSignIn = authStorage.getData("email");
    if (emailForSignIn) {
      setEmail(emailForSignIn);
    }
  }, []);

  return (
    <div className="sm:p-8 sm:mx-32 my-32 bg-blue-50 rounded-xl  p-4 mx-8">
      <div className="flex md:flex-row flex-col text-2xl">
        <p className='text-blue-600'>{email}</p><p>に認証用のメールを送信しました。</p>
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
