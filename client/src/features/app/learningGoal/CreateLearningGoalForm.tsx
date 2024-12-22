import React, { FC } from 'react'
import { Subject } from '../../../types/firebase/db/common/commonTypes';
import useAsyncHandler from '../../hooks/form/useAsyncHandler';
import { startLearningGoal } from '../../../services/learning/learningGoalActionService';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { Alert, Box, Typography } from '@mui/material';
import { NumberField, StringField } from '../../../components/input/inputIndex';
import SelectField from '../../../components/input/field/SelectField';
import { keyMirror } from '../../../functions/utils/dataStructureUtils/objectUtils';
import { subjectSelectItems } from '../../../constants/selectItems/subjectSelectItems';
import CircularButton from '../../../components/input/button/CircularButton';
import { MINUTES_IN_MILLISECOND } from '../../../constants/utils/dateTimeConstants';
import useFormState from '../../hooks/form/useFormState';
import { FormStateChangeAction } from '../../../types/app/formStateTypes';


interface CreateLearningGoalFormState {
  objectives: string;
  subject: Subject;
  targetDurationMin: number;
}

interface CreateLearningGoalFormProps {
  onCreated: () => void;
}

const CreateLearningGoalForm: FC<CreateLearningGoalFormProps> = ({ onCreated }) => {
  const dispatch = useAppDispatch();
  const uid = useAppSelector(state => state.userSlice.uid);

  const { formState, onChangeFormState } = useFormState<CreateLearningGoalFormState>({
    objectives: "",
    subject: "notSelected",
    targetDurationMin: 25,
  });

  const { errorMessage, callAsyncFunction, reset } = useAsyncHandler();
  const names = keyMirror(formState);

  const handleStartLearningGoal = async () => {
    if (uid) {
      const success = await callAsyncFunction(
        startLearningGoal,
        [
          uid,
          formState.objectives,
          formState.subject,
          formState.targetDurationMin * MINUTES_IN_MILLISECOND,
          dispatch
        ],
        "学習の開始に失敗しました"
      )

      if (success) onCreated()
    }
  }

  const formStateChangeHandler = (action: FormStateChangeAction) => {
    onChangeFormState(action);
    reset();
  };

  return (
    <div>
      <Box className='space-y-6 shadow-md p-4 rounded-lg'>
        <Typography variant='h5'>
          学習目標を設定。
        </Typography>
        <StringField
          label="目標"
          value={formState.objectives}
          name={names.objectives}
          onChange={(e) => formStateChangeHandler({ ...e.target })}
        />
        <SelectField
          label='教科'
          value={formState.subject}
          name={names.subject}
          selectItems={subjectSelectItems}
          onChange={(e) => onChangeFormState({ name: e.target.name, value: e.target.value })}
        />
        <NumberField
          label='目標時間 (分)'
          value={formState.targetDurationMin}
          name={names.targetDurationMin}
          onChangeFormState={formStateChangeHandler}
          max={180}
        />
      </Box>
      <Box className="flex flex-col w-full pr-2 mt-2">
        {errorMessage && (
          <Alert severity="error" className='mt-2'>{errorMessage}</Alert>
        )}
        <div className='self-end mt-2'>
          <CircularButton bgColor="main" size="xl" textSize="lg" onClick={handleStartLearningGoal}>
            学習を<br/>を開始
          </CircularButton>
        </div>
      </Box>
    </div>
  )
}

export default CreateLearningGoalForm