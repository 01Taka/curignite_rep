import { FC } from 'react'
import CreateIndividualTaskView from './CreateIndividualTaskView'
import { useAppSelector } from '../../../../../redux/hooks';
import useFormState from '../../../../hooks/form/useFormState';
import { CreateIndividualTaskFormState } from '../../shared/types/createTask/createIndividualTaskTypes';
import useCreateIndividualTaskHandler from '../../shared/hooks/individualTask/crud/useCreateIndividualTaskHandler';

interface CreateIndividualTaskProps {
  onSuccessCreate: () => void;
}

const CreateIndividualTask: FC<CreateIndividualTaskProps> = ({ onSuccessCreate }) => {
  const { uid } = useAppSelector(state => state.userSlice);
  const { formState, onChangeFormState } = useFormState<CreateIndividualTaskFormState>({
    title: "",
    subject: "notSelected",
    dueDateTime: null,
    informStartDaysBeforeDue: null,
    taskNote: "",
    estimatedDuration: 10,
  });
  const { handleCreateIndividualTask } = useCreateIndividualTaskHandler(formState, uid, onSuccessCreate);

  return <CreateIndividualTaskView 
    formState={formState}
    onChangeFormState={onChangeFormState}
    onCreate={handleCreateIndividualTask}
  />
}

export default CreateIndividualTask