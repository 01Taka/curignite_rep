import React from 'react';
import { Subject } from '../../types/firebase/db/common/commonTypes';
import { subjectColors, subjectLabels } from '../../constants/label/subjectLabels';
import { Box, SxProps, Typography } from '@mui/material';
import { commonStyles } from '../../styles/mui/commonStyles';

interface SubjectIconProps {
  subject: Subject;
  sx?: SxProps;
}

const SubjectIcon: React.FC<SubjectIconProps> = ({ subject, sx }) => {
  return (
    <Box
      sx={{
        ...commonStyles.flexCenter,
        width: 64,
        height: 32,
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
