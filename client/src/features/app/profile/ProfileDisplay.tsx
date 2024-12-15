import { Box, Typography } from '@mui/material';
import React from 'react';
import { UserProfile, UserStudyProfile } from './shared/types/profileTypes';
import StudyProfileDisplay from './StudyProfileDisplay';
import { commonStyles } from '../../../styles/mui/commonStyles';
import RecentHeatmap from './RecentHeatmap';
import UserProfileDisplay from './UserProfileDisplay';


interface ProfileDisplayProps {
  userProfile: UserProfile;
  userStudyProfile: UserStudyProfile;
}

const studyTimeColorMap: Record<number, string> = {
  0: '#f0f8ff',   // 0分 -> 薄い青 (アリスブルー)
  30: '#cce7ff',   // 30分 -> 淡い青
  60: '#99d1ff',   // 60分 -> 明るい青
  90: '#66bbff',   // 90分 -> 青
  120: '#339aff',  // 120分 -> 濃い青
  150: '#0077ff',  // 150分 -> 深い青
  180: '#0055cc',  // 180分 -> より濃い青
};

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ userProfile, userStudyProfile }) => {
  return (
    <Box sx={{ padding: 1 }}>
      <Box sx={{ display: "flex", gap: 1 }}>
        <UserProfileDisplay userProfile={userProfile} />
        <StudyProfileDisplay userStudyProfile={userStudyProfile} />
      </Box>
      <Box sx={{...commonStyles.cardShadow, mt: 1 }}>
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