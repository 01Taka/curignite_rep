import React, { FC, useEffect, useState } from 'react'
import CreateCollectionTaskView from './CreateCollectionTaskView'
import { handleFormStateChange } from '../../../../../functions/utils';
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import { toTimestamp } from '../../../../../functions/dateTimeUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { PathParam } from '../../../../../types/path/paths';
import SelectCollection from './SelectCollection';
import { taskPaths } from '../../../../../types/path/mainPaths';
import { rangesToArray } from '../../../../../functions/objectUtils';
import { CreateCollectionTaskViewFormState } from '../../../../../types/app/task/taskForm';

const CreateCollectionTask: FC= () => {
  const params = useParams();
  const navigate = useNavigate();
  const collectionId = params[PathParam.CollectionId];
  const [id, setId] = useState<string | null>(null);

  const { uid, userData } = useAppSelector(state => state.userSlice);
  const [formState, setFormState] = useState<CreateCollectionTaskViewFormState>({
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

  const handleCreateCollectionTask = async () => {
    if (uid && userData && id) {
      try {
        const CollectionTaskService = serviceFactory.createUserTaskManagementService();
        await CollectionTaskService.getTaskCollectionTaskService().createTask(
          userData.metaData.taskListId,
          id,
          uid,
          formState.title,
          formState.dueDateTime ? toTimestamp(formState.dueDateTime) : null,
          formState.taskNote,
          formState.priority,
          rangesToArray(formState.pagesInRange),
        );
        navigate(taskPaths.create);
        console.log('Collection task created successfully!'); // 成功メッセージ
      } catch (error) {
        console.error('Failed to create Collection task:', error);
      }
    } else {
      console.error('User is not authenticated or user data is missing.'); // 認証エラー
    }
  };

  return (
    <>
      {id !== null ? (
        <CreateCollectionTaskView 
          formState={formState}
          rangeMax={200}
          onFormStateChange={(e) => handleFormStateChange(e, setFormState)}
          onCreate={handleCreateCollectionTask}
        />
      ) : (
        <SelectCollection />
      )}
    </>
  )
}

export default CreateCollectionTask