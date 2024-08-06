import React, { ReactNode } from 'react';
import { cn, isMobileMode } from '../../functions/utils';

interface FormContainerProps {
  children: ReactNode;
  className?: string;
  flexCenter?: boolean;
}

const FormContainer: React.FC<FormContainerProps> = ({ children, className, flexCenter }) => {
  return (
    <div className='flex justify-center items-center w-full h-full max-w-lg mx-auto'>
      <div className={
        cn(
          'w-full h-full p-6 bg-primaryBase overflow-y-auto',
          !isMobileMode() && 'max-w-lg max-h-[calc(100vh-7rem)]  shadow-lg rounded-lg border-main border-2',
          flexCenter && 'flex flex-col items-center',
          className,
        )}>
        {children}
      </div>
    </div>
  );
}

export default FormContainer;
