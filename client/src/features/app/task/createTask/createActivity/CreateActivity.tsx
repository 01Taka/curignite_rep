import { FC } from 'react'
import CreateActivityView from './CreateActivityView';
import { ProblemSetCategoryRead, ProblemSetRead } from '../../../../../types/firebase/db/task/taskStructure';
import useCreateActivityHandler from '../../shared/hooks/problemSet/crud/useCreateActivityHandler';

interface CreateActivityProps {
  problemSet: ProblemSetRead;
  categories: ProblemSetCategoryRead[];
}

const CreateActivity: FC<CreateActivityProps> = ({ problemSet, categories }) => {
  const {
    names,
    formState,
    asyncStatus,
    onChangeFormState,
    updateArrayField,
    handleCreateActivity
  } = useCreateActivityHandler(problemSet?.docId ?? null);

  return (
    <CreateActivityView
      problemSetName={problemSet?.name ?? ''}
      managementMethod ={problemSet?.activityManagementMethod ?? 'page'}
      names={names}
      formState={formState}
      categories={categories}
      onFormStateChange={onChangeFormState}
      updateArrayField={updateArrayField}
      onCreate={handleCreateActivity}
      loading={asyncStatus === 'loading'}
    />
  );
};

export default CreateActivity;
