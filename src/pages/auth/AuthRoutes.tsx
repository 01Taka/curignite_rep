import React, { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateAccount from './signup/createAccount/CreateAccount';
import CreateAccountEndPointPage from './signup/createAccount/CreateAccountEndPointPage';
import InitialSetup from './signup/userInitialSetup/InitialSetup';
import SignInIndex from './signin/index/SignInIndex';
import SignInWithEmail from './signin/withEmail/SignInWithEmail';
import AuthIndex from './index/AuthIndex';
import { authPaths } from '../../types/path/appPaths';

const AuthRoutes: FC = () => {
  return (
    <Routes>
      <Route path={authPaths.base} element={<AuthIndex />} />
      <Route path={authPaths.signIn} element={<SignInIndex />} />
      <Route path={authPaths.emailSignIn} element={<SignInWithEmail />} />
      <Route path={authPaths.createAccount} element={<CreateAccount />} />
      <Route path={authPaths.accountEndpoint} element={<CreateAccountEndPointPage />} />
      <Route path={authPaths.initialSetup} element={<InitialSetup />} />
    </Routes>
  );
};

export default AuthRoutes;