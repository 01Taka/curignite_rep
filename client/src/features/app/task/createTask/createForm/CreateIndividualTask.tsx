import React, { FC, useState } from 'react'
import CreateIndividualTaskView from './CreateIndividualTaskView'
import { handleFormStateChange } from '../../../../../functions/utils';
import { CreateIndividualTaskViewFormState } from '../../../../../types/app/task/taskForm';
import { MINUTES_IN_MILLISECOND } from '../../../../../types/util/dateTimeTypes';
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import { toTimestamp } from '../../../../../functions/dateTimeUtils';
import { useNavigate } from 'react-router-dom';
import { taskPaths } from '../../../../../types/path/mainPaths';

const CreateIndividualTask: FC = () => {
  const navigate = useNavigate();
  const { uid, userData } = useAppSelector(state => state.userSlice);
  const [formState, setFormState] = useState<CreateIndividualTaskViewFormState>({
    title: "",
    dueDateTime: null,
    taskNote: "",
    priority: "medium",
    estimatedDuration: 10,
  });

  const handleCreateIndividualTask = async () => {
    if (uid && userData) {
      try {
        const individualTaskService = serviceFactory.createUserTaskManagementService();
        await individualTaskService.getIndividualTaskService().createTask(
          uid,
          uid,
          formState.title,
          formState.dueDateTime ? toTimestamp(formState.dueDateTime) : formState.dueDateTime,
          formState.taskNote,
          formState.priority,
          formState.estimatedDuration * MINUTES_IN_MILLISECOND
        );
        navigate(taskPaths.home);
        console.log('Individual task created successfully!'); // 成功メッセージ
      } catch (error) {
        console.error('Failed to create individual task:', error);
      }
    } else {
      console.error('User is not authenticated or user data is missing.'); // 認証エラー
    }
  };

  return <CreateIndividualTaskView 
    formState={formState}
    onFormStateChange={(e) => handleFormStateChange(e, setFormState)}
    onCreate={handleCreateIndividualTask}
  />
}

export default CreateIndividualTask