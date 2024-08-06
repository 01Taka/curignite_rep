import React from 'react';
import { useNavigate } from 'react-router-dom';
import { rootPaths } from '../../types/path/appPaths';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className='flex justify-center items-center w-screen h-screen'>
      <div className='flex flex-col justify-center items-center bg-primaryBase w-2/3 h-1/3 rounded-lg'>
        <h2 className='text-4xl font-bold mb-8'>404 - Page Not Found</h2>
        <p className='text-xl'>Sorry, the page you are looking for does not exist.</p>
        <p className='flex text-xl'>
          Go back to <span className='font-bold mx-1 border-b-2 border-gray-500 hover:cursor-pointer' onClick={() => navigate(rootPaths.top)}>Home</span>.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
