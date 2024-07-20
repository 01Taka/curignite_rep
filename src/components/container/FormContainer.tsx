import React, { ReactNode } from 'react';
import { cn } from '../../functions/utils';

interface FormContainerProps {
  children: ReactNode;
  className?: string;
  flexCenter?: boolean;
}

const FormContainer: React.FC<FormContainerProps> = ({ children, className, flexCenter }) => {
  return (
    <div className='flex items-center justify-center w-full max-w-lg mx-auto'>
      <div className={
        cn(
          'w-full max-w-lg h-screen max-h-[calc(100vh-7rem)] p-6 bg-primaryBase shadow-lg rounded-lg overflow-y-auto border-main border-2',
          flexCenter && 'flex flex-col items-center',
          className,
        )}>
        {children}
      </div>
    </div>
  );
}

export default FormContainer;
