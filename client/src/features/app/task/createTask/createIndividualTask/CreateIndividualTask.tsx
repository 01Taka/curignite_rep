import { FC } from 'react'
import CreateIndividualTaskView from './CreateIndividualTaskView'
import { CreateIndividualTaskViewFormState } from '../../../../../types/app/task/taskForm';
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { MINUTES_IN_MILLISECOND } from '../../../../../constants/utils/dateTimeConstants';
import useFormState from '../../../../hooks/form/useFormState';
import useAsyncHandler from '../../../../hooks/form/useAsyncHandler';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import { IndividualTaskWrite } from '../../../../../types/firebase/db/task/taskStructure';

const CreateIndividualTask: FC = () => {
  const navigate = useNavigate();
  const { uid } = useAppSelector(state => state.userSlice);
  const { formState, onChangeFormState } = useFormState<CreateIndividualTaskViewFormState>({
    title: "",
    dueDateTime: null,
    taskNote: "",
    priority: "medium",
    estimatedDuration: 10,
  });
  const { callAsyncFunction } = useAsyncHandler<DocumentReference<IndividualTaskWrite, DocumentData>>();

  const handleCreateIndividualTask = async () => {
    if (uid) {
      const individualTaskService = serviceFactory.createIndividualTaskService();
        callAsyncFunction([
          uid,
          formState.title,
          formState.dueDateTime,
          formState.taskNote,
          formState.estimatedDuration * MINUTES_IN_MILLISECOND
        ], individualTaskService.createTask.bind(individualTaskService))
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