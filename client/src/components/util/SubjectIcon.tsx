import React from 'react';
import { Subject } from '../../types/firebase/db/common/commonTypes';
import { subjectColors, subjectLabels } from '../../constants/label/subjectLabels';
import { Box, SxProps, Typography } from '@mui/material';
import { commonStyles } from '../../styles/mui/commonStyles';

interface SubjectIconProps {
  subject: Subject;
  size?: "small" | "medium";
  sx?: SxProps;
}

const SubjectIcon: React.FC<SubjectIconProps> = ({ subject, sx, size = "medium" }) => {
  return (
    <Box
      sx={{
        ...commonStyles.flexCenter,
        width: size === "medium" ? 64 : 40,
        height: size === "medium" ? 32 : 24,
        borderRadius: 1,
        ...sx,
        backgroundColor: subjectColors[subject],
      }}
    >
      <Typography variant="body2" sx={{ color: 'white' }}>
        {subjectLabels[subject]}
      </Typography>
    </Box>
  );
};

export default SubjectIcon;
