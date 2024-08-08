import React, { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateAccount from './signup/createAccount/CreateAccount';
import CreateAccountEndPointPage from './signup/createAccount/CreateAccountEndPointPage';
import InitialSetup from './signup/userInitialSetup/InitialSetup';
import SignInIndex from './signin/index/SignInIndex';
import SignInWithEmail from './signin/withEmail/SignInWithEmail';
import AuthIndex from './index/AuthIndex';
import { relativeAuthPaths } from '../../types/path/authPaths';

const AuthRoutes: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthIndex />} />
      <Route path={relativeAuthPaths.signIn} element={<SignInIndex />} />
      <Route path={relativeAuthPaths.emailSignIn} element={<SignInWithEmail />} />
      <Route path={relativeAuthPaths.createAccount} element={<CreateAccount />} />
      <Route path={relativeAuthPaths.accountEndpoint} element={<CreateAccountEndPointPage />} />
      <Route path={relativeAuthPaths.initialSetup} element={<InitialSetup />} />
    </Routes>
  );
};

export default AuthRoutes;