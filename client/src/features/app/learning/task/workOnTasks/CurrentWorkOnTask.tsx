import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { IndividualTaskPreview, ProblemSetTaskPreviewById, TaskPreview } from '../../shared/types/task/taskPreviewTypes';
import { timeOmissionFormat } from '../../../../../functions/utils/timeFormatUtils';
import TaskTitle from './TaskTitle';

interface CurrentWorkOnTaskProps {
  currentTask: TaskPreview | null;
  onSetIndividualProgress: (task: IndividualTaskPreview, progress: number) => void;
  onSetProblemSetTaskCompleted: (task: ProblemSetTaskPreviewById, isCompleted: boolean) => void;
}

const CurrentWorkOnTask: React.FC<CurrentWorkOnTaskProps> = ({ currentTask, onSetProblemSetTaskCompleted }) => {
  return (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          bgcolor: currentTask?.isCompleted ? "greenyellow" : "white",
          borderRadius: 1,
          px: 2,
          py: 1
        }}>
          {currentTask &&
          <>
            {currentTask.isIndividual ? (
              <Typography variant='h6'>
                {currentTask.title}
              </Typography>
            ) : (
              <Box sx={{
                width: "100%",
                height: "100%"
              }}>
                <TaskTitle task={currentTask} />
                <Typography variant='h6'>
                  推定: {timeOmissionFormat(currentTask.estimatedDuration)}
                </Typography>
              </Box>
            )}
            <Button
              sx={{
                mt: 2,
              }}
              color={currentTask.isCompleted ? "success" : "error"}
              size='large'
              variant='contained'
              onClick={() => onSetProblemSetTaskCompleted(currentTask as ProblemSetTaskPreviewById, !currentTask.isCompleted)}
            >
              {currentTask.isCompleted ? "完了済み" : "未完了"}
            </Button>
          </>
        }
      </Box>
  );
};

export default CurrentWorkOnTask;