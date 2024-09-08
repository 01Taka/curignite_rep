import React, { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { LevelInfo } from '../../../types/user/userLevelTypes';
import { getLevelAndRemainingXPFromLearningTime } from '../../../functions/user/userLevelUtils';
import { Box, Typography, LinearProgress } from '@mui/material';

interface UserLevelProps {
  username: string;
  small?: boolean;
}

const UserLevel: FC<UserLevelProps> = ({ username, small = false }) => {
  const { userData } = useAppSelector(state => state.userSlice);
  const [levelInfo, setLevelInfo] = useState<LevelInfo>({
    level: 0,
    remainingXP: 0,
    xpToNextLevel: 0,
    progress: 0,
  });

  useEffect(() => {
    if (userData) {
      try {
        const levelInfo = getLevelAndRemainingXPFromLearningTime(userData.totalLearningTime);
        setLevelInfo(levelInfo);
      } catch (error) {
        console.error(error);
      }
    }
  }, [userData]);

  return (
    <Box className="w-full">
      <Box className="flex items-center justify-between">
        <Box className="flex items-center">
          <Typography variant={`${small ? "body1" : "h6"}`} className="font-bold text-blue-800">
            Lv.{levelInfo.level}
          </Typography>
          <Typography variant={`${small ? "body2" : "body1"}`} className="pl-2">
            {username}
          </Typography>
        </Box>
        {!small && (
          <Typography variant="caption" className="text-gray-600">
            あと{levelInfo.xpToNextLevel}分
          </Typography>
        )}
      </Box>
      <Box className="flex items-center">
        <Box className="flex-1 mr-2">
          <LinearProgress
            variant="determinate"
            value={levelInfo.progress * 100}
            sx={{ height: small ? 10 : 15, borderRadius: 5 }}
          />
        </Box>
        {!small && (
          <Typography variant="body1" className="text-gray-600">
            {Math.round(levelInfo.progress * 100)}%
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default UserLevel;
