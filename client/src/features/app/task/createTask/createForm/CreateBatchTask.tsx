import React, { FC, useEffect, useState } from 'react'
import CreateBatchTaskView from './CreateBatchTaskView'
import { handleFormStateChange } from '../../../../../functions/utils';
import { CreateBatchTaskViewFormState } from '../../../../../types/app/task/taskForm';
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import { toTimestamp } from '../../../../../functions/dateTimeUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { PathParam } from '../../../../../types/path/paths';
import SelectCollection from './SelectCollection';
import { taskPaths } from '../../../../../types/path/mainPaths';
import { rangesToArray } from '../../../../../functions/objectUtils';

const CreateBatchTask: FC= () => {
  const params = useParams();
  const navigate = useNavigate();
  const collectionId = params[PathParam.CollectionId];
  const [id, setId] = useState<string | null>(null);

  const { uid, userData } = useAppSelector(state => state.userSlice);
  const [formState, setFormState] = useState<CreateBatchTaskViewFormState>({
    title: "",
    dueDateTime: null,
    taskNote: "",
    priority: "medium",
    pagesInRange: [{ min: 0, max: 10 }],
  });

  useEffect(() => {
    const id = (!collectionId || collectionId === `:${PathParam.CollectionId}`) ? null : collectionId;
    setId(id);
  }, [collectionId])

  const handleCreateBatchTask = async () => {
    if (uid && userData && id) {
      try {
        const batchTaskService = serviceFactory.createTaskCollectionBatchTaskService();
        await batchTaskService.createBatchTask(
          userData.metaData.taskListId,
          id,
          uid,
          formState.title,
          formState.dueDateTime ? toTimestamp(formState.dueDateTime): null,
          formState.taskNote,
          formState.priority,
          rangesToArray(formState.pagesInRange),
        );
        navigate(taskPaths.create);
        console.log('Batch task created successfully!'); // 成功メッセージ
      } catch (error) {
        console.error('Failed to create batch task:', error);
      }
    } else {
      console.error('User is not authenticated or user data is missing.'); // 認証エラー
    }
  };

  return (
    <>
      {id !== null ? (
        <CreateBatchTaskView 
          formState={formState}
          rangeMax={200}
          onFormStateChange={(e) => handleFormStateChange(e, setFormState)}
          onCreate={handleCreateBatchTask}
        />
      ) : (
        <SelectCollection />
      )}
    </>
  )
}

export default CreateBatchTask