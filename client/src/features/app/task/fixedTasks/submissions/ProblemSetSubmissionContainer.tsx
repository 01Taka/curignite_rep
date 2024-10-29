import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { convertToDate, timeOmissionFormat } from '../../../../../functions/utils/dateTimeUtils';
import { format } from 'date-fns';
import { TaskData } from '../../../../../types/firebase/db/common/task/taskExpansionTypes';
import ActivityRangesDisplay from './ActivityRangesDisplay';

interface ProblemSetSubmissionContainerProps {
  activity: TaskData;
  onClickWorkOn: () => void;
}

const ProblemSetSubmissionContainer: React.FC<ProblemSetSubmissionContainerProps> = ({ activity, onClickWorkOn }) => {
  // collectionTaskFieldが存在しない場合はnullを返す
  const problemSetActivityField = activity.problemSetActivityField
  if (!problemSetActivityField) return null;

  // dueDateTimeのフォーマット
  const formattedDueDate = activity.dueDateTime
    ? format(convertToDate(activity.dueDateTime), 'M/dd')
    : "未定";

  // 各情報を取得
  const completionRateText = `完了率: ${problemSetActivityField.completionRate}`;
  const estimatedDurationText = `推定: ${timeOmissionFormat(activity.remainingEstimatedDuration)}`;

  return (
    <Box sx={{ border: 1, p: 2, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center'
          }}>
            <Typography variant="h6">{formattedDueDate}</Typography>
            <Button size='small' variant='outlined' onClick={onClickWorkOn}>
              始める
            </Button>
          </Box>

        </Grid>
        <Grid item xs={6}>
          <Box>
            <Box sx={{ display: 'flex' }}>
              <Typography sx={{ marginRight: 1 }}>
                範囲: 
              </Typography>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column'
              }}>
                <ActivityRangesDisplay activityStatuses={problemSetActivityField.activityStatus} />
              </Box>
            </Box>
            <Typography variant="body1">{completionRateText}</Typography>
            <Typography variant="body1">{estimatedDurationText}</Typography>
            {activity.taskNote && (
              <Typography variant="body1">メモ: {activity.taskNote}</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProblemSetSubmissionContainer;
