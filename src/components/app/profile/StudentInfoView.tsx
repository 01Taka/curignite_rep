import { Avatar } from '@mui/material';
import React from 'react';

interface StudentInfoViewProps {
    iconUrl: string;
    username: string;
    grade: number;
    classNumber: number;
    joinedAt: number;
    onIconChange: () => void;
}

const StudentInfoView: React.FC<StudentInfoViewProps> = ({
    iconUrl,
    username,
    grade,
    classNumber,
    joinedAt,
    onIconChange,
}) => {
    // joinedAtから年と月を抽出
    const joinedDate = new Date(joinedAt);
    const joinedYear = joinedDate.getFullYear();
    const joinedMonth = joinedDate.getMonth() + 1; // getMonth()は0ベースなので、1を加える

    return (
        <div className="flex flex-col space-x-4 p-4 bg-white shadow rounded-lg">
            <Avatar
                src={iconUrl}
                alt="アイコン"
                sx={{ width: 125, height: 125 }}
                className='hover:cursor-pointer'
                onClick={onIconChange}
            />
            <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                    <p className="text-xl font-bold">{grade}年</p>
                    <p className="text-xl font-bold">{classNumber}組</p>
                </div>
                <div>
                    <p className="text-lg">{username}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">{`${joinedYear}年${joinedMonth}月`}</p>
                </div>
            </div>
        </div>
    );
}

export default StudentInfoView;
