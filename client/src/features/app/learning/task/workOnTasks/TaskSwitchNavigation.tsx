import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import { commonStyles } from '../../../../../styles/mui/commonStyles';
import TaskTitle from './TaskTitle';
import { TaskPreview } from '../../shared/types/task/taskPreviewTypes';

interface TaskSwitchNavigationProps {
  nextTask: TaskPreview | null;
  incrementCurrentTaskIndex: (amount?: number) => void;
}

const TaskSwitchNavigation: React.FC<TaskSwitchNavigationProps> = ({ nextTask, incrementCurrentTaskIndex }) => {
  return (
    <Box sx={{ ...commonStyles.flexBetween, width: "100%" }}>
      <IconButton size='large' onClick={() => incrementCurrentTaskIndex(-1)}>
        <ArrowBackIosNew />
      </IconButton>
      <Box sx={{ ...commonStyles.flexCenter }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "end" }}>
          <Typography variant="caption" >next</Typography>
          {nextTask ? (
            <TaskTitle task={nextTask} fontSize={0.75} />
          ) : 
            <Typography variant="caption" >
              なし
            </Typography>
          }
        </Box>
        <IconButton size='large' onClick={() => incrementCurrentTaskIndex(1)}>
          <ArrowForwardIos />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TaskSwitchNavigation;