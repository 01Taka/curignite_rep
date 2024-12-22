import { FC } from 'react'
import CreateActivityView from './CreateActivityView';
import { ProblemSetCategoryRead, ProblemSetRead } from '../../../../../types/firebase/db/task/taskStructure';
import useCreateActivityHandler from '../../shared/hooks/problemSet/crud/useCreateActivityHandler';
import { useAppSelector } from '../../../../../redux/hooks';
import useFormState from '../../../../hooks/form/useFormState';
import { CreateActivityFormState } from '../../shared/types/createTask/createActivityTypes';

interface CreateActivityProps {
  problemSet: ProblemSetRead;
  categories: ProblemSetCategoryRead[];
  onSuccessCreate: () => void;
}

const CreateActivity: FC<CreateActivityProps> = ({ problemSet, categories, onSuccessCreate }) => {
  const { uid } = useAppSelector(state => state.userSlice);
  const { formState, names, onChangeFormState, onChangeArrayField } = useFormState<CreateActivityFormState>({
    dueDateTime: null,
    informStartDaysBeforeDue: null,
    categoryActivities: []
  });

  const {
    asyncStatus,
    handleCreateActivity
  } = useCreateActivityHandler(formState, uid, problemSet?.docId ?? null, onSuccessCreate);

  return (
    <CreateActivityView
      problemSetName={problemSet?.name ?? ''}
      managementMethod ={problemSet?.activityManagementMethod ?? 'page'}
      names={names}
      formState={formState}
      categories={categories}
      onChangeFormState={onChangeFormState}
      onChangeArrayField={onChangeArrayField}
      onCreate={handleCreateActivity}
      loading={asyncStatus === 'loading'}
    />
  );
};

export default CreateActivity;
