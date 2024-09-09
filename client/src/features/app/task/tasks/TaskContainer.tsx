import React, { FC } from 'react';
import { Typography, Checkbox } from '@mui/material';
import { TaskContainerComponentProps } from '../../../../types/app/task/taskTypes';
import OverViewInfo from './OverViewInfo';
import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';

const TaskContainer: FC<TaskContainerComponentProps> = ({ task, size }) => {
  const { estimatedDuration, title, taskNote, collectionTaskField } = task;

  const formatEstimatedDuration = (durationInMs: number) => {
    const totalMinutes = durationInMs / MINUTES_IN_MILLISECOND;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours ? `${hours}時間 ` : ''}${minutes}分`;
  };

  return (
    <div className="m-4 shadow-lg w-full max-w-lg rounded-lg bg-secondaryBase">
      <div className='p-2'>
        <div className='flex justify-between'>
          <div className='flex flex-col justify-center'>
            <Typography variant='h5' className='flex items-center'>
              <Checkbox />
              {title}
            </Typography>
            <Typography className='pl-4 max-h-12 max-w-72 overflow-y-hidden'>
              {taskNote}
            </Typography>
            <div className='flex pl-4 space-x-4'>
              {collectionTaskField && (
                <Typography>残り: {collectionTaskField.remainingPages.length}p</Typography>
              )}
              <Typography>
                推定: {formatEstimatedDuration(estimatedDuration)}
              </Typography>
            </div>
          </div>
          <OverViewInfo task={task} size={size} />
        </div>
      </div>
    </div>
  );
};

export default TaskContainer;
