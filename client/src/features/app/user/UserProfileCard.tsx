import React, { FC } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import UserLevel from './UserLevel';
import { UserData } from '../../../types/firebase/db/user/userStructure';

interface UserProfileCardProps {
  userData: UserData | null;
}

const UserProfileCard: FC<UserProfileCardProps> = ({ userData }) => {
  if (!userData) {
    return (
      <Box className="p-4 bg-red-100 text-red-800 rounded-md shadow-md">
        <Typography variant="body1">
          ユーザー情報が見つかりませんでした
        </Typography>
      </Box>
    );
  }

  return (
    <div className="flex justify-center items-center p-4 bg-white rounded-lg shadow-md">
      <Box className="flex flex-col items-center justify-center mr-2">
        <Avatar
          src={userData.iconUrl}
          alt="自分のユーザーアイコン"
          sx={{ width: 48, height: 48 }}
        >
          {userData.username[0]} {/* アイコンがない場合の代替テキスト */}
        </Avatar>
      </Box>
      <Box className="w-11/12">
        <UserLevel username={userData.username}/>
      </Box>
    </div>
  );
}

export default UserProfileCard;
