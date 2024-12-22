import { FC } from 'react'
import { useAppSelector } from '../../../../../redux/hooks';
import CreateProblemSetView from './CreateProblemSetView';
import { CreateProblemSetFormState } from '../../shared/types/createTask/createProblemSetTypes';
import useFormState from '../../../../hooks/form/useFormState';
import useCreateProblemSetAndCategoriesHandler from '../../shared/hooks/problemSet/crud/useCreateProblemSetAndCategoriesHandler';

interface CreateProblemSetProps {
  onSuccessProblemSet: () => void;
}

const CreateProblemSet: FC<CreateProblemSetProps> = ({ onSuccessProblemSet }) => {
  const { uid } = useAppSelector(state => state.userSlice);
  const { formState, names, onChangeFormState, onChangeArrayField } = useFormState<CreateProblemSetFormState>({
    name: "",
    subject: "notSelected",
    description: "",
    activityManagementMethod: 'page',
    categories: []
  });

  const { isLoading, handleCreateProblemSet } = useCreateProblemSetAndCategoriesHandler(formState, uid, onSuccessProblemSet);

  return <CreateProblemSetView
    formState={formState}
    names={names}
    isDisabledCreate={isLoading}
    onChangeFormState={onChangeFormState}
    onChangeArrayField={onChangeArrayField}
    onCreate={handleCreateProblemSet}
  />
}

export default CreateProblemSet
