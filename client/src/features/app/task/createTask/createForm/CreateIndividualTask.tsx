import React, { FC, useState } from 'react'
import CreateIndividualTaskView from './CreateIndividualTaskView'
import { CreateIndividualTaskViewFormState } from '../../../../../types/app/task/taskForm';
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import { toTimestamp } from '../../../../../functions/utils/dateTimeUtils';
import { useNavigate } from 'react-router-dom';
import { taskPaths } from '../../../../../types/path/mainPaths';
import { MINUTES_IN_MILLISECOND } from '../../../../../constants/utils/dateTimeConstants';
import useFormState from '../../../../hooks/form/useFormState';

const CreateIndividualTask: FC = () => {
  const navigate = useNavigate();
  const { uid, userData } = useAppSelector(state => state.userSlice);
  const { formState, onChangeFormState } = useFormState<CreateIndividualTaskViewFormState>({
    title: "",
    dueDateTime: null,
    taskNote: "",
    priority: "medium",
    estimatedDuration: 10,
  });

  const handleCreateIndividualTask = async () => {
    if (uid && userData) {
      try {
        const individualTaskService = serviceFactory.createIndividualTaskService();
        await individualTaskService.createTask(
          uid,
          uid,
          formState.title,
          formState.dueDateTime ? toTimestamp(formState.dueDateTime) : formState.dueDateTime,
          formState.taskNote,
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
    onFormStateChange={onChangeFormState}
    onCreate={handleCreateIndividualTask}
  />
}

export default CreateIndividualTask