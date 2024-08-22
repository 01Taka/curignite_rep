import React from 'react'
import CircularButton from '../../components/input/button/CircularButton';
import { Typography } from '@mui/material';

interface TopPageViewProps {
    onSignUp: () => void;
}

const TopPageView: React.FC<TopPageViewProps> = ({
    onSignUp
}) => {
    return (
        <div className='w-full h-full bg-primaryBase'>
            <div className='flex justify-center pt-32'>
                <div className='flex flex-col items-center space-y-4 max-w-md w-full'>
                <Typography variant='h4'>
                    CURIGNITEへようこそ
                </Typography>
                <Typography variant='body1'>
                    CURIGNITEは学生間のコミュニティを活発化させ、より協力意識をもって勉強に取り組める環境を提供するため、開発が続けられています。
                </Typography>
                </div>
                <div className='flex flex-col items-center px-8'>
                    <CircularButton onClick={onSignUp} size="x8l" textSize="x4l" bgColor="main">
                        CURIGNITE<br/>に登録する
                    </CircularButton>
                </div>
            </div>
            <div>
                その他補足情報
            </div>
        </div>
    )
}

export default TopPageView