import React, { FC } from 'react';
import { Typography, Checkbox } from '@mui/material';
import { dateTimeToString } from '../../../../../functions/dateTimeUtils';
import { TaskContainerComponentProps } from '../../../../../types/app/task/taskTypes';
import OverViewInfo from './OverViewInfo';


const TaskContainer: FC<TaskContainerComponentProps> = ({ task, estimatedDuration, remainingPages, size }) => {
  return (
    <div className="m-4 shadow-lg max-w-lg rounded-lg bg-secondaryBase ">
      <div className='p-2'>
        <div className='flex justify-between'>
          <div className='flex flex-col justify-center'>
            <Typography variant='h5' className='flex items-center'>
              <Checkbox />
              {task.title}
            </Typography>
            <Typography className='pl-4 max-h-12 max-w-72 overflow-y-hidden'>
              {task.taskNote}
            </Typography>
            <div className='flex pl-4 space-x-4'>
              {remainingPages &&
                <Typography>残り: {remainingPages}p</Typography>
              }
              {estimatedDuration && 
                <Typography>
                  推定: {dateTimeToString(estimatedDuration, {
                    isAbsolute: false,
                    countUpTime: true,
                    conversion: {
                      maxConvertTimeSizeUnit: "minutes",
                      minTruncateTimeSizeUnit: "minutes"
                    }})}
                </Typography>
              }
            </div>
          </div>
          <OverViewInfo task={task} size={size} />
        </div>
      </div>
    </div>
  );
}

export default TaskContainer;
