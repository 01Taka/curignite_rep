import React, { FC } from 'react'
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import CreateProblemSetView from './CreateProblemSetView';
import { CreateProblemSetStateTypes, CreateProblemSetViewFormState } from './createProblemSetTypes';
import useFormState from '../../../../hooks/form/useFormState';
import useMultipleAsyncHandler from '../../../../hooks/form/useMultipleAsyncHandler';
import { MINUTES_IN_MILLISECOND } from '../../../../../constants/utils/dateTimeConstants';

const CreateProblemSet: FC = () => {
  const navigate = useNavigate();
  const { uid } = useAppSelector(state => state.userSlice);
  const { callAsyncFunction } = useMultipleAsyncHandler<CreateProblemSetStateTypes>();
  const { formState, names, onChangeFormState, updateField } = useFormState<CreateProblemSetViewFormState>({
    name: "",
    description: "",
    activityManagementMethod: 'page',
    categories: []
  })

  const handleCreate = async () => {
    if (uid) {
      const problemSetService = serviceFactory.createProblemSetService();
      const categoryService = serviceFactory.createProblemSetCategoryService();
      const problemSetData = await callAsyncFunction('createProblemSet', [
        uid,
        formState.name,
        formState.description,
        formState.activityManagementMethod
      ], problemSetService.createProblemSet.bind(problemSetService));

      if (problemSetData) {
        formState.categories.map(category => {
          callAsyncFunction('createCategory', [
            uid,
            problemSetData.id,
            category.name,
            category.timePerProblem * MINUTES_IN_MILLISECOND,
            category.totalProblemNumber
          ], categoryService.createCategory.bind(categoryService))
        })
      }
    } else {
      console.error("User ID is not available.");
    }
  }

  return <CreateProblemSetView
    formState={formState}
    names={names}
    onFormStateChange={onChangeFormState}
    updateField={updateField}
    onCreate={handleCreate}
  />
}

export default CreateProblemSet
