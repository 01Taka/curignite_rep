import React from 'react';
import GoalDetails from './GoalDetails';
import { TaskData } from '../../../../types/firebase/db/common/task/taskStructure';

interface GoalSettingFormProps {
  task: TaskData;
}

const GoalSettingForm: React.FC<GoalSettingFormProps> = ({ task }) => {
  const collectionTaskField = task.collectionTaskField?.completionRate;
  

  return (
    <div>
      <GoalDetails target={task.title} timeMs={1000000} extent={50} extentUnit='ページ'/>
    </div>
  );
};

export default GoalSettingForm;