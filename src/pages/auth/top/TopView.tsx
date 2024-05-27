import React from 'react'
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const TopPageView: React.FC = () => {
  return (
    <div className='w-full h-full'>
        <div className=' bg-blue-50'>
            <div className='flex flex-col items-center pt-32'>
                <h1 className='text-4xl font-bold'>CURIGNITEへようこそ</h1>
                <p className=' w-2/5 pt-8'>
                    CURIGNITEは学生間のコミュニティを活発化させ、より協力意識をもって勉強に取り組める環境を提供するため、開発が続けられています。
                </p>
            </div>

            <div className='flex flex-col items-center py-32 '>
                <Button variant="contained">
                    <Link to={'/signup'} children='CURIGNITEに登録する'/>
                </Button>
            </div>
        </div>
        <div>
            その他補足情報
        </div>
    </div>
  )
}

export default TopPageView;