import React, { FC, useMemo } from 'react';
import { Typography, Box, Divider, LinearProgress, Button } from '@mui/material';
import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';
import { differenceInDays } from 'date-fns';
import { convertToDate, formatDateDifference, getMidnightDate } from '../../../../functions/dateTimeUtils';
import { CollectionTaskField, TaskData } from '../../../../types/firebase/db/common/task/taskStructure';
import MiniValueIcon from '../../../../components/display/container/MiniValueIcon';
import { AccessTime } from '@mui/icons-material';
import { rangesToString } from '../../../../functions/rangeUtils';

export interface TaskContainerProps {
  task: TaskData;
}

const TaskContainer: FC<TaskContainerProps> = ({ task }) => {
  const { estimatedDuration, title, collectionTaskField } = task;

  // 所要時間のフォーマット
  const formatEstimatedDuration = useMemo(() => {
    const minutes = Math.floor(estimatedDuration / MINUTES_IN_MILLISECOND);
    const hours = (minutes / 60).toFixed(1);
    const unit = minutes >= 60 ? 'h' : 'min';
    const value = minutes >= 60 ? hours : minutes;
    return `${value}${unit}`;
  }, [estimatedDuration]);

  const formatRemainingDays = task.dueDateTime ? formatDateDifference(convertToDate(task.dueDateTime), '残りd日') : ''

  const fullTitle = collectionTaskField ? `${title} (${rangesToString(collectionTaskField.pagesInRange)})` : title; 

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        border: 1,
        borderColor: 'black',
        borderRadius: 2,
      }}
    >
      <Header title={fullTitle} remainingDays={formatRemainingDays} />
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        paddingX: 1,
        marginTop: 0.5 ,
        marginBottom: collectionTaskField ? 0 : 0.5
      }}>
        <ProgressSection task={task} formatEstimatedDuration={formatEstimatedDuration} collectionTaskField={collectionTaskField} />
        <Button
          variant='outlined'
          size='small'
          sx={{
            marginLeft: 1,
            width: 90,
            height: 35
          }}
        >
          始める
        </Button>
      </Box>
    </Box>
  );
};

// ヘッダーコンポーネント
const Header: FC<{ title: string; remainingDays: string }> = ({ title, remainingDays }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      height: 40,
      bgcolor: '#ccc',
      padding: 1,
      borderRadius: 2,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0
    }}
  >
    <Typography>{title}</Typography>
    <Divider variant='fullWidth' orientation='horizontal' />
    <Typography>{remainingDays}</Typography>
  </Box>
);

// プログレスセクションコンポーネント
const ProgressSection: FC<{ task: TaskData; formatEstimatedDuration: string, collectionTaskField?: CollectionTaskField }> = ({
  task,
  formatEstimatedDuration,
  collectionTaskField
}) => {
  const completionRate = collectionTaskField?.completionRate ?? `${task.completed ? 1 : 0}/1`;

  return (
    <Box sx={{
      display: 'flex',
    flexDirection: 'column',
    width: '100%',
    }}>
      {formatEstimatedDuration && (
        <MiniValueIcon icon={<AccessTime />} value={formatEstimatedDuration} tooltipText='所要時間' />
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <LinearProgress
          value={task.progress}
          variant="determinate"
          sx={{
            width: '100%',
            height: 6,
            marginRight: 1,
            borderRadius: 1,
          }}
        />
        <Typography>
          {completionRate}
        </Typography>
      </Box>
    </Box>
  )
};

export default TaskContainer;
