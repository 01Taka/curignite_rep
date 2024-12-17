import { Box, Typography } from '@mui/material';
import React from 'react';
import { commonStyles } from '../../../styles/mui/commonStyles';
import { mapValuesByRange } from '../../../functions/utils/dataStructureUtils/objectUtils';
import { HOURS_IN_MILLISECOND, MINUTES_IN_MILLISECOND } from '../../../constants/utils/dateTimeConstants';
import { msToTime } from '../../../functions/utils/timeFormatUtils';
import MobileTooltip from '../../../components/display/container/MobileTooltip';

interface RecentHeatmapProps {
  recentStudyTimes: number[];
  heatmap: Record<number, string>;
  labels?: string[];
  size?: number;
}

const RecentHeatmap: React.FC<RecentHeatmapProps> = ({ recentStudyTimes, heatmap, labels, size = 36 }) => {
  const colorMap = mapValuesByRange(recentStudyTimes.map(time => time / MINUTES_IN_MILLISECOND), heatmap, "#aa0000");

  return (
    <Box sx={{ ...commonStyles.flexBetween }}>
      {recentStudyTimes.map((time, index) => (
        <Box sx={commonStyles.flexColumnCenter}>
          <Box sx={{ bgcolor: colorMap[index], borderRadius: 2, width: size, height: size, ...commonStyles.flexCenter }}>
            <MobileTooltip title={msToTime(time)} buttonText={(time / HOURS_IN_MILLISECOND).toFixed(1)} />
          </Box>
          <Typography>
            {labels?.[index] ?? ""}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default RecentHeatmap;