import { Box, Typography } from '@mui/material'
import React, { FC, useState } from 'react'
import RadioGroupField from '../../../../components/input/field/RadioGroupField'
import { SelectItem } from '../../../../types/util/componentsTypes';
import CircularButton from '../../../../components/input/button/CircularButton';
import { endLearningGoal } from '../../../../services/learning/learningGoalActionService';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { LearningGoalStatus } from '../../../../types/firebase/db/user/userSupplementTypes';
import { useLearningTimer } from './LearningTimerProvider';

type LearningGoalFinishStatus = "cancel" | "procrastinate" | "complete";

const learningFinishStatusSelectItems: SelectItem<LearningGoalFinishStatus>[] = [
  { label: "完了する", value: "complete" },
  { label: "別の機会に続ける", value: "procrastinate" },
  { label: "この学習デ－タを消す", value: "cancel" },
]

interface FinishLearningGoalFormProps {
  onEnter: (status: LearningGoalFinishStatus) => void;
}

const FinishLearningGoalForm: FC<FinishLearningGoalFormProps> = ({ onEnter }) => {
  const dispatch = useAppDispatch();
  const { resetTimer } = useLearningTimer();
  const uid = useAppSelector(state => state.userSlice.uid);
  const [learningState, setLearningState] = useState<LearningGoalFinishStatus>("complete");

  const handleEndLearningGoal = async (status: LearningGoalStatus) => {
    if (uid) {
      await endLearningGoal(uid, dispatch, status);
      resetTimer();
    }
  }

  const handleEnter = () => {
    onEnter(learningState);
    switch (learningState) {
      case "complete":
        handleEndLearningGoal("achieved");
      break;
      case "procrastinate":
          handleEndLearningGoal("procrastinate")
        break;
      case "cancel":
          handleEndLearningGoal("canceled")
        break;
    }
  }

  return (
    <div>
      <Typography>
        学習を終了する
      </Typography>
      <Typography>
        学習はすべて完了しましたか？
      </Typography>

      <Box my={2}>
        <RadioGroupField
          label='状態を選択'
          name='learningStatus'
          selectItems={learningFinishStatusSelectItems}
          value={learningState}
          onChange={(e) => setLearningState(e.target.value)}
        />
      </Box>
      <div className='flex justify-end'>
        <CircularButton bgColor="main" size="lg" onClick={handleEnter} >
          決定
        </CircularButton>
      </div>
    </div>
  )
}

export default FinishLearningGoalForm