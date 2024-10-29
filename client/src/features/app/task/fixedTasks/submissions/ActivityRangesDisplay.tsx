import React from 'react';
import { CategoryActivityStatus } from '../../../../../types/firebase/db/common/task/taskExpansionTypes';
import { Box, Typography } from '@mui/material';
import { rangesToString } from '../../../../../functions/utils/rangeUtils';

interface ActivityRangesDisplayProps {
  activityStatuses: CategoryActivityStatus[];
}

const ActivityRangesDisplay: React.FC<ActivityRangesDisplayProps> = ({ activityStatuses }) => {
  return (
    <Box>
      {activityStatuses.map(status => (
          <Box display={'flex'}>
            {activityStatuses.length > 1 &&
              <Typography>
                {status.category.name}
              </Typography>
            }
            <Typography>
              {rangesToString(status.problemIdsRange)}
            </Typography>
          </Box>
        ))}
    </Box>
  );
};

export default ActivityRangesDisplay;