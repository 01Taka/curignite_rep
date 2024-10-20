import React, { FC, useCallback, useState } from 'react'
import CreateCollectionTaskView from './CreateCollectionTaskView'
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import { toTimestamp } from '../../../../../functions/dateTimeUtils';
import { CreateCollectionTaskViewFormState } from '../../../../../types/app/task/taskForm';
import { TaskCollectionData } from '../../../../../types/firebase/db/common/task/taskStructure';
import useFormState from '../../../../hooks/useFormState';

interface CreateCollectionTaskProps {
  collection: TaskCollectionData | null;
}

const CreateCollectionTask: FC<CreateCollectionTaskProps> = ({ collection }) => {
  const { uid, userData } = useAppSelector(state => state.userSlice);
  const { formState, onChange } = useFormState<CreateCollectionTaskViewFormState>({
    title: "",
    dueDateTime: null,
    taskNote: "",
    priority: "medium",
    pagesInRange: [{ min: 0, max: 10 }],
  })

  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const collectionIdParam = collectionId && collectionId !== `:${PathParam.CollectionId}` ? collectionId : null;
  //   setId(collectionIdParam);
  // }, [collectionId]);

  // useEffect(() => {
  //   if (!isInputTitle && collection) {
  //     setFormState(prevState => ({
  //       ...prevState,
  //       title: `${collection.collectionName} ${rangesToString(mergeRanges(prevState.pagesInRange))}`
  //     }));
  //   }
  // }, [collection, formState.pagesInRange, isInputTitle]);

  const handleCreateCollectionTask = useCallback(async () => {
    if (uid && userData && collection && collection.docId) {
      setLoading(true);
      try {
        const CollectionTaskService = serviceFactory.createUserTaskManagementService();
        await CollectionTaskService.getTaskCollectionTaskService().createTask(
          uid,
          collection.docId,
          formState.title,
          formState.dueDateTime ? toTimestamp(formState.dueDateTime) : null,
          formState.taskNote,
          formState.priority,
          formState.pagesInRange,
        );
        // navigate(taskPaths.create);
        console.log('Collection task created successfully!');
      } catch (error) {
        console.error('Failed to create Collection task:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('User is not authenticated or user data is missing.');
    }
  }, [uid, userData, collection, formState]);

  return (
    <CreateCollectionTaskView 
      collectionName={collection?.collectionName ?? ''}
      formState={formState}
      rangeMax={200}
      onFormStateChange={onChange}
      onCreate={handleCreateCollectionTask}
      loading={loading}
    />
  );
};

export default CreateCollectionTask;
