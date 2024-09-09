import React, { FC } from 'react';
import { TaskCollectionData, TaskData } from '../../../../types/firebase/db/common/task/taskStructure';
import OverViewInfo from '../tasks/OverViewInfo';
import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';

interface CollectionTaskViewProps {
  tasks: TaskData[];
  collection: TaskCollectionData;
}

const CollectionTaskView: FC<CollectionTaskViewProps> = ({ tasks }) => {
  return (
    <>
      {tasks?.map(task => (
        <div className="flex justify-between items-center w-36 h-12 p-2 shadow-lg rounded-lg bg-secondaryBase">
          <OverViewInfo task={task} size='sm' displayTitle={false} />
          <span className='text-xs'>推定<br/>{task.estimatedDuration / MINUTES_IN_MILLISECOND}分</span>
        </div>
      ))}
    </>
  );
};

export default CollectionTaskView;
