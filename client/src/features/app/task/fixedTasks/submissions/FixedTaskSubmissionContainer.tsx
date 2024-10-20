import React from 'react';
import { TaskData } from '../../../../../types/firebase/db/common/task/taskStructure';
import { Box, Button, Grid, Typography } from '@mui/material';
import { convertToDate, timeOmissionFormat } from '../../../../../functions/dateTimeUtils';
import { rangeToString } from '../../../../../functions/rangeUtils';
import { format } from 'date-fns';

interface FixedTaskSubmissionContainerProps {
  submission: TaskData;
  onClickWorkOn: () => void;
}

const FixedTaskSubmissionContainer: React.FC<FixedTaskSubmissionContainerProps> = ({ submission, onClickWorkOn }) => {
  // collectionTaskFieldが存在しない場合はnullを返す
  if (!submission.collectionTaskField) return null;

  // dueDateTimeのフォーマット
  const formattedDueDate = submission.dueDateTime
    ? format(convertToDate(submission.dueDateTime), 'M/dd')
    : "未定";

  // 各情報を取得
  const completionRateText = `完了率: ${submission.collectionTaskField.completionRate}`;
  const estimatedDurationText = `推定: ${timeOmissionFormat(submission.estimatedDuration)}`;

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
                {submission.collectionTaskField.pagesInRange.map(range => (
                  <Typography>
                    {rangeToString(range)}
                  </Typography>
                ))}
              </Box>
            </Box>
            <Typography variant="body1">{completionRateText}</Typography>
            <Typography variant="body1">{estimatedDurationText}</Typography>
            {submission.taskNote && (
              <Typography variant="body1">メモ: {submission.taskNote}</Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FixedTaskSubmissionContainer;
