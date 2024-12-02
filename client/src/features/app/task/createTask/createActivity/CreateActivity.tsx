import { FC, useCallback } from 'react'
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import useFormState from '../../../../hooks/form/useFormState';
import useAsyncHandler from '../../../../hooks/form/useAsyncHandler';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import CreateActivityView from './CreateActivityView';
import { mergeRanges } from '../../../../../functions/utils/rangeUtils';
import { CategoryActivity } from '../../../../../types/firebase/db/task/taskSupplementTypes';
import { ProblemSetActivityWrite, ProblemSetCategoryRead, ProblemSetRead } from '../../../../../types/firebase/db/task/taskStructure';
import { CreateActivityFormState } from '../../shared/types/createTask/createActivityTypes';

interface CreateActivityProps {
  problemSet: ProblemSetRead | null;
  categories: ProblemSetCategoryRead[];
}

const CreateActivity: FC<CreateActivityProps> = ({ problemSet, categories }) => {
  const { uid } = useAppSelector(state => state.userSlice);
  const { formState, names, onChangeFormState, updateArrayField } = useFormState<CreateActivityFormState>({
    dueDateTime: null,
    categoryActivities: []
  });
  const { asyncStatus, callAsyncFunction } = useAsyncHandler<DocumentReference<ProblemSetActivityWrite, DocumentData>>();

  const handleCreateActivity = useCallback(async () => {
    if (uid && problemSet && problemSet.docId) {
      const activityService = serviceFactory.createProblemSetActivityService();
      const categoryActivities: CategoryActivity[] = formState.categoryActivities.map(activity => ({
        categoryId: activity.categoryId,
        problemIdsRange: mergeRanges(activity.problemRanges)
      }))
      callAsyncFunction([
        uid,
        problemSet.docId,
        formState.dueDateTime,
        categoryActivities
      ], activityService.createActivity.bind(activityService));
    } else {
      console.error('User is not authenticated or user data is missing.');
    }
  }, [uid, problemSet, formState, callAsyncFunction]);

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
