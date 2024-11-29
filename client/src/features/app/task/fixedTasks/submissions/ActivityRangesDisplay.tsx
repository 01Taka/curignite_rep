import React from 'react';
import { CategoryActivityStatus } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { Box, Typography } from '@mui/material';
import { rangesToString } from '../../../../../functions/utils/rangeUtils';

interface ActivityRangesDisplayProps {
  activityStatuses: CategoryActivityStatus[];
}

const ActivityRangesDisplay: React.FC<ActivityRangesDisplayProps> = ({ activityStatuses }) => {
  return (
    <Box>
      {activityStatuses.map(status => (
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ mr: 1 }}>
              {status.categoryName}:
            </Typography>
            <Typography>
              {rangesToString(status.problemIdsRange)}
            </Typography>
          </Box>
        ))}
    </Box>
  );
};

export default ActivityRangesDisplay;