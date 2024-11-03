import React from 'react';
import { CategoryActivityStatus } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { Box, Typography } from '@mui/material';
import { rangesToString } from '../../../../../functions/utils/rangeUtils';

interface ActivityRangesDisplayProps {
  activityStatuses: CategoryActivityStatus[];
}

const ActivityRangesDisplay: React.FC<ActivityRangesDisplayProps> = ({ activityStatuses }) => {
  console.log(activityStatuses);
  
  return (
    <Box>
      {activityStatuses.map(status => (
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ mr: 1 }}>
              {status.category.name}:
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