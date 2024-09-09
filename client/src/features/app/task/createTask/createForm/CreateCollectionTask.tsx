import React, { FC, useCallback, useEffect, useState } from 'react'
import CreateCollectionTaskView from './CreateCollectionTaskView'
import { handleFormStateChange } from '../../../../../functions/utils';
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import { toTimestamp } from '../../../../../functions/dateTimeUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { PathParam } from '../../../../../types/path/paths';
import SelectCollection from './SelectCollection';
import { taskPaths } from '../../../../../types/path/mainPaths';
import { mergeRanges, rangesToArray } from '../../../../../functions/objectUtils';
import { CreateCollectionTaskViewFormState } from '../../../../../types/app/task/taskForm';
import { TaskCollectionData } from '../../../../../types/firebase/db/common/task/taskStructure';
import { FormStateChangeEvent, Range } from '../../../../../types/util/componentsTypes';

const CreateCollectionTask: FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const collectionId = params[PathParam.CollectionId];
  const { uid, userData } = useAppSelector(state => state.userSlice);

  const [taskCollection, setTaskCollection] = useState<TaskCollectionData | null>(null);
  const [isInputTitle, setIsInputTitle] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [formState, setFormState] = useState<CreateCollectionTaskViewFormState>({
    title: "",
    dueDateTime: null,
    taskNote: "",
    priority: "medium",
    pagesInRange: [{ min: 0, max: 10 }],
  });
  const [loading, setLoading] = useState(false);

  const updateTaskCollection = useCallback(async () => {
    if (uid && id) {
      try {
        const collectionService = serviceFactory.createUserTaskManagementService().getTaskCollectionService();
        const taskCollections = await collectionService.getCollection(uid, id);
        setTaskCollection(taskCollections);
      } catch (error) {
        console.error('Error fetching task collection:', error);
      }
    }
  }, [uid, id]);

  useEffect(() => {
    updateTaskCollection();
  }, [updateTaskCollection]);

  useEffect(() => {
    const collectionIdParam = collectionId && collectionId !== `:${PathParam.CollectionId}` ? collectionId : null;
    setId(collectionIdParam);
  }, [collectionId]);

  const rangeToString = useCallback((ranges: Range[]): string => {
    const mergedRanges = mergeRanges(ranges);
    return mergedRanges.map(range => `${range.min}~${range.max}`).join(", ");
  }, []);

  useEffect(() => {
    if (!isInputTitle && taskCollection) {
      setFormState(prevState => ({
        ...prevState,
        title: `${taskCollection.collectionName} ${rangeToString(prevState.pagesInRange)}`
      }));
    }
  }, [taskCollection, formState.pagesInRange, isInputTitle, rangeToString]);

  const handleCreateCollectionTask = useCallback(async () => {
    if (uid && userData && id) {
      setLoading(true);
      try {
        const CollectionTaskService = serviceFactory.createUserTaskManagementService();
        await CollectionTaskService.getTaskCollectionTaskService().createTask(
          uid,
          id,
          formState.title,
          formState.dueDateTime ? toTimestamp(formState.dueDateTime) : null,
          formState.taskNote,
          formState.priority,
          formState.pagesInRange,
        );
        navigate(taskPaths.create);
        console.log('Collection task created successfully!');
      } catch (error) {
        console.error('Failed to create Collection task:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('User is not authenticated or user data is missing.');
    }
  }, [uid, userData, id, formState, navigate]);

  const onFormStateChange = useCallback((event: FormStateChangeEvent) => {
    if (event.target.name === "title") {
      setIsInputTitle(!!event.target.value);
    }
    handleFormStateChange(event, setFormState);
  }, []);

  return (
    <>
      {id ? (
        <CreateCollectionTaskView 
          formState={formState}
          rangeMax={200}
          onFormStateChange={onFormStateChange}
          onCreate={handleCreateCollectionTask}
          loading={loading}
        />
      ) : (
        <SelectCollection />
      )}
    </>
  );
};

export default CreateCollectionTask;
