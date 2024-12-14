import { Box, Button, Card, CardMedia, LinearProgress, Typography } from '@mui/material';
import React from 'react';
import { UserProfile, UserStudyProfile } from './shared/types/profileTypes';
import StudyProfileDisplay from './StudyProfileDisplay';
import { commonStyles } from '../../../styles/mui/commonStyles';
import useToggle from '../../hooks/useToggle';
import RecentHeatmap from './RecentHeatmap';
import UserProfileDisplay from './UserProfileDisplay';


interface ProfileDisplayProps {
  userProfile: UserProfile;
  userStudyProfile: UserStudyProfile;
}

const studyTimeColorMap: Record<number, string> = {
  0: '#f0f0f0',   // 0分 -> グレー
  30: '#ffcccc',   // 30分 -> 薄い赤
  60: '#ff9999',   // 60分 -> 赤
  90: '#ff6666',   // 90分 -> 明るい赤
  120: '#ff3333',  // 120分 -> 濃い赤
  150: '#ff0000',  // 150分 -> 深い赤
  180: '#cc0000',  // 180分 -> より濃い赤
};

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ userProfile, userStudyProfile }) => {
  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <UserProfileDisplay userProfile={userProfile} />
        <StudyProfileDisplay userStudyProfile={userStudyProfile} />
      </Box>
      <Box sx={{ mt: 1 }}>
        <Typography color="GrayText" sx={{ textAlign: "end" }}>
          直近7日の学習時間{`(h)`}
        </Typography>
        <RecentHeatmap
          recentStudyTimes={userStudyProfile.recentStudyTimesMs}
          heatmap={studyTimeColorMap}
          labels={["月", "火", "水", "木", "金", "土", "日"]}
        />
      </Box>
    </Box>
  );
};

export default ProfileDisplay;