import React, { FC, useCallback } from 'react'
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import { toTimestamp } from '../../../../../functions/utils/dateTimeUtils';
import useFormState from '../../../../hooks/form/useFormState';
import { ProblemSetActivityData, ProblemSetCategoryData, ProblemSetData } from '../../../../../types/firebase/db/task/taskStructure';
import useAsyncHandler from '../../../../hooks/form/useAsyncHandler';
import { DocumentData, DocumentReference } from 'firebase/firestore';
import CreateActivityView from './CreateActivityView';
import { CreateActivityFormState } from './createActivityTypes';
import { mergeRanges } from '../../../../../functions/utils/rangeUtils';
import { CategoryActivity } from '../../../../../types/firebase/db/task/taskSupplementTypes';

interface CreateActivityProps {
  problemSet: ProblemSetData | null;
  categories: ProblemSetCategoryData[];
}

const CreateActivity: FC<CreateActivityProps> = ({ problemSet, categories }) => {
  const { uid } = useAppSelector(state => state.userSlice);
  const { formState, names, onChangeFormState, updateArrayField } = useFormState<CreateActivityFormState>({
    dueDateTime: null,
    categoryActivities: []
  });
  const { asyncStatus, callAsyncFunction } = useAsyncHandler<DocumentReference<ProblemSetActivityData, DocumentData>>();

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
        formState.dueDateTime ? toTimestamp(formState.dueDateTime) : null,
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
