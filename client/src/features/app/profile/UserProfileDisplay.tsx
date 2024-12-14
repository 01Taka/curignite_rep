import { Box, Card, Typography, LinearProgress, CardMedia } from '@mui/material';
import React from 'react';
import { commonStyles } from '../../../styles/mui/commonStyles';
import { UserProfile } from './shared/types/profileTypes';

interface UserProfileDisplayProps {
  userProfile: UserProfile;
}

const UserProfileDisplay: React.FC<UserProfileDisplayProps> = ({ userProfile }) => {
  return (
    <Box sx={{ ...commonStyles.flexColumnCenter, gap: 1, width: '80%' }}>
      <Card sx={{ display: "flex", flexDirection: "column", width: '100%', height: '250%', padding: 1 }}>
        <Box sx={{ ...commonStyles.flexColumnCenter, width: '100%' }}>
          <Typography variant="h6" sx={{ alignSelf: 'start' }}>
            {userProfile.username}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <Typography>
              Lv.{userProfile.level}
            </Typography>
            <LinearProgress
              sx={{ width: '100%' }}
              variant="determinate"
              value={userProfile.levelProgress * 100}
            />
          </Box>
        </Box>

        <CardMedia
          component="img"
          sx={{
            height: 120, // 高さを指定
            objectFit: "scale-down", // 画像を縦に合わせる
          }}
          image={userProfile.iconUrl}
          alt="ユーザーのプロフィール画像"
        />
      </Card>

      <Box
        sx={{
          bgcolor: 'white',
          boxShadow: 1,
          borderRadius: 2,
          width: "100%",
          height: '100%',
          padding: 1,
        }}
      >
        <Typography>直近の称号</Typography>
        <Box sx={{
          gap: 0.5,
          width: 100,
          overflow: 'auto',
          whiteSpace: 'nowrap',
        }}>
          <Box sx={{ display: "flex", gap: 0.5, width: "fit-content" }}>
            <Box sx={{ borderRadius: 999, height: 32, width: 32, bgcolor: 'gold' }} />
            <Box sx={{ borderRadius: 999, height: 32, width: 32, bgcolor: 'gold' }} />
            <Box sx={{ borderRadius: 999, height: 32, width: 32, bgcolor: 'gold' }} />
            <Box sx={{ borderRadius: 999, height: 32, width: 32, bgcolor: 'gold' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserProfileDisplay;
