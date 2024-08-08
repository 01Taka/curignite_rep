import React, { ReactNode } from 'react';
import { cn } from '../../functions/utils';
import { useAppSelector } from '../../redux/hooks';

interface FormContainerProps {
  children: ReactNode;
  className?: string;
  flexCenter?: boolean;
}

const FormContainer: React.FC<FormContainerProps> = ({ children, className, flexCenter }) => {
  const { device } = useAppSelector(state => state.userSlice);

  return (
    <div className='flex justify-center items-center w-full h-full max-w-lg mx-auto'>
      <div className={
        cn(
          'w-full h-full p-6 bg-primaryBase overflow-y-auto',
          device === "desktop" && 'max-w-lg max-h-[calc(100vh-7rem)]  shadow-lg rounded-lg border-main border-2',
          flexCenter && 'flex flex-col items-center',
          className,
        )}>
        {children}
      </div>
    </div>
  );
}

export default FormContainer;
