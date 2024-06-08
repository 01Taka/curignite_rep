import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/tailwind.css';
import { NotFound } from './pages/error/errorIndex';
import { CreateAccountEndpointPage, CreateAccountPage, SignInPage, SignInWithEmailPage, SignUpPage, UserInitialSetupPage, ViaActionUrlPage } from './pages/auth/authIndex';
import Home from './pages/app/home/Home';
import TopPage from './pages/app/top/TopPage';

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<TopPage />}/>
        <Route path='home' element={<Home />}/>
        <Route path='signin' element={<SignInPage />}/>
        <Route path='signin-email' element={<SignInWithEmailPage />}/>
        <Route path='signup' element={<SignUpPage />}/>
        <Route path='create-account' element={<CreateAccountPage />}/>
        <Route path='create-account-endpoint' element={<CreateAccountEndpointPage />}/>
        <Route path='via-action-url' element={<ViaActionUrlPage />}/>
        <Route path='user-initial-setup' element={<UserInitialSetupPage />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
