import React, { FC, useState } from 'react'
import CreateTaskCollectionView from './CreateTaskCollectionView'
import { handleFormStateChange } from '../../../../../functions/utils';
import { CreateTaskCollectionViewFormState } from '../../../../../types/app/task/taskForm';
import { MINUTES_IN_MILLISECOND } from '../../../../../types/util/dateTimeTypes';
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { taskPaths } from '../../../../../types/path/mainPaths';

const CreateTaskCollection: FC = () => {
  const navigate = useNavigate();
  const { uid, userData } = useAppSelector(state => state.userSlice);
  const [formState, setFormState] = useState<CreateTaskCollectionViewFormState>({
    name: "",
    totalPages: 200,
    timePerPage: 10,
    description: "",
  });

  const handleCreate = async () => {
    if (uid && userData) {
      try {
        const collectionService = serviceFactory.createUserTaskManagementService();
        await collectionService.getTaskCollectionService().createCollection(
          uid,
          uid,
          formState.name,
          formState.description,
          formState.totalPages,
          formState.timePerPage * MINUTES_IN_MILLISECOND
        );
        navigate(taskPaths.create);
      } catch (error) {
        console.error("Error creating task collection:", error);
      }
    } else {
      console.error("User ID is not available.");
    }
  }

  return <CreateTaskCollectionView
    formState={formState}
    onFormStateChange={(e) => handleFormStateChange(e, setFormState)}
    onCreate={handleCreate}
  />
}

export default CreateTaskCollection
