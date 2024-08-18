import React, { FC } from 'react'
import GradientCircle from '../../../../../components/app/task/GradientCircle'
import { dueDateColors, progressColors } from './gradientColors'
import { dateTimeToString, getMidnightDate, isMidnight } from '../../../../../functions/dateTimeUtils'
import { BaseTaskData } from '../../../../../types/firebase/db/todo/TodoTypes'
import { differenceInDays } from 'date-fns'
import { GradientCircleSize } from '../../../../../types/app/task/taskTypes'
import { cn } from '../../../../../functions/utils'

interface OverViewInfoProps {
  task: BaseTaskData;
  size: GradientCircleSize;
  displayTitle?: boolean;
}

const OverViewInfo: FC<OverViewInfoProps> = ({ task, size, displayTitle = true }) => {
  const remainingDays = task.dueDateTime ? differenceInDays(getMidnightDate(task.dueDateTime), getMidnightDate()) : NaN;

  return (
      <div className='flex space-x-2'>
      {task.dueDateTime && 
        <GradientCircle title={displayTitle ? "提出日" : undefined} colors={dueDateColors} value={remainingDays >= 0 ? remainingDays : "~over"} size={size}>
          <span className={cn(isMidnight(task.dueDateTime) ? "text-lg" : "text-base")}>{dateTimeToString(task.dueDateTime, {isAbsolute: true, format: "M/d"})}</span>
          {!isMidnight(task.dueDateTime) &&
            <span>{dateTimeToString(task.dueDateTime, {isAbsolute: true, format: "H:mm"})}</span>
          }
        </GradientCircle>
      }
      <GradientCircle title={displayTitle ? "完了率" : undefined} colors={progressColors} value={task.progress} size={size} useUpper>
        <span>{Math.floor(task.progress * 100)}%</span>
      </GradientCircle>
    </div>
  )
}

export default OverViewInfo