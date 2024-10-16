import React, { FC } from 'react';
import { Typography, Box } from '@mui/material';
import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';
import GradientIcon from '../../../../components/display/container/GradientIcon';
import MiniIcon from '../../../../components/display/container/MiniIcon';
import { differenceInDays, format } from 'date-fns';
import { convertToDate, getMidnightDate, isMidnight } from '../../../../functions/dateTimeUtils';
import { dueDateColorsGradient, progressColorsGradient } from '../../../../constants/components/gradientColors';
import { TaskData } from '../../../../types/firebase/db/common/task/taskStructure';

export interface TaskContainerProps {
  task: TaskData;
}

const TaskContainer: FC<TaskContainerProps> = ({ task }) => {
  const { estimatedDuration, title, collectionTaskField } = task;

  const formatEstimatedDuration = (durationInMs: number) => {
    const totalMinutes = durationInMs / MINUTES_IN_MILLISECOND;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours ? `${hours}時間 ` : ''}${minutes}分`;
  };

  const remainingDays = task.dueDateTime ? differenceInDays(getMidnightDate(task.dueDateTime), getMidnightDate()) : NaN;

  return (
    <Box>
      <Typography>
        {title}
      </Typography>
      <Box>
        <MiniIcon title='推定時間' color='#eee'>
          {formatEstimatedDuration(estimatedDuration)}
        </MiniIcon>
        {task.dueDateTime &&
          <GradientIcon
            title="提出日"
            colors={dueDateColorsGradient}
            value={remainingDays >= 0 ? remainingDays : "~over"}
            errorColor='#bbb'
          >
            <Typography
              variant={isMidnight(task.dueDateTime) ? 'subtitle1' : 'body1'}
            >
              {format(convertToDate(task.dueDateTime), "M/d")}
              {!isMidnight(task.dueDateTime) && 
                <Typography>
                  {format(convertToDate(task.dueDateTime), "H:mm")}
                </Typography>
              }
            </Typography>
          </GradientIcon>
        }

        <GradientIcon
          title='完了率'
          colors={progressColorsGradient}
          errorColor='#bbb'
          value={task.progress}
          useUpper
        >
          <Typography>{Math.floor(task.progress * 100)}%</Typography>
        </GradientIcon>

        {collectionTaskField && 
          <Typography>
            {`${collectionTaskField.completedPages.length}/${collectionTaskField.pagesInRange.length}`}
          </Typography>
        }
      </Box>
    </Box>
  );
};

export default TaskContainer;
