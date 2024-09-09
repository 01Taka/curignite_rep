import React, { FC } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import UserLevel from './UserLevel';
import { UserWithSupplementary } from '../../../types/firebase/db/user/userStructure';
import { cn } from '../../../functions/utils';

interface UserProfileCardProps {
  userData: UserWithSupplementary | null;
  shadow?: boolean;
}

const UserProfileCard: FC<UserProfileCardProps> = ({ userData, shadow }) => {
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
    <div className={cn("flex justify-center items-center w-full", shadow && "bg-white p-4 rounded-lg shadow-md")}>
      <Box className="flex flex-col items-center justify-center mr-2">
        <Avatar
          src={userData.avatarIconUrl}
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
