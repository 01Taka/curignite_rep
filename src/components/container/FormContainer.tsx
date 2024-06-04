import React, { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-blue-50 p-4'>
      <div className='flex flex-col items-center w-full max-w-lg bg-white shadow-lg p-6 my-4 rounded-lg overflow-y-auto'>
        {children}
      </div>
    </div>
  );
}

export default FormContainer;
