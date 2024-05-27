import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/tailwind.css';
import { NotFound } from './pages/error/errorIndex';
import { SignInPage, SignUpPage, TopPage } from './pages/auth/authIndex';

const App: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<TopPage />}/>
        <Route path='signin' element={<SignInPage />}/>
        <Route path='signup' element={<SignUpPage />}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
