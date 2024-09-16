import React, { useState, ChangeEvent, FC } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';
import RadioGroupField from '../../../../components/input/field/RadioGroupField';
import QuickSelectionField from '../../../../components/input/field/QuickSelectionField';
import { FormStateChangeEvent, SelectItem } from '../../../../types/util/componentsTypes';
import { NumberField } from '../../../../components/input/inputIndex';
import CircularButton from '../../../../components/input/button/CircularButton';
import { addAllowedOverflowLearningTime, endLearningGoal } from '../../../../services/learning/learningGoalActionService';
import { useLearningTimer } from './LearningTimerProvider';
import { LearningGoalStatus } from '../../../../types/firebase/db/user/userSupplementTypes';

type LearningGoalContinueStatus = "continue" | "procrastinate" | "complete";

const continueTimeSelection: SelectItem<number>[] = [
  { label: "10分", value: 10 },
  { label: "25分", value: 25 },
  { label: "50分", value: 50 }
];


const learningStatusSelectItems: SelectItem<LearningGoalContinueStatus>[] = [
  { label: "続ける", value: "continue" },
  { label: "別の機会に続ける", value: "procrastinate" },
  { label: "完了する", value: "complete" },
]

interface ContinueLearningGoalWorkFormProps {
  onEnter: (status: LearningGoalContinueStatus) => void;
}

const ContinueLearningGoalWorkForm: FC<ContinueLearningGoalWorkFormProps> = ({ onEnter }) => {
  const dispatch = useAppDispatch();
  const uid = useAppSelector(state => state.userSlice.uid);
  const { currentLearningGoal, allowedOverflowTime } = useAppSelector(state => state.learningGoalSlice);
  const { resetTimer } = useLearningTimer();
  const [learningState, setLearningState] = useState<LearningGoalContinueStatus>("continue");
  const [continueTimeMin, setContinueTimeMin] = useState<number>(10);

  const handleLearningStateChange = (event: FormStateChangeEvent) => {
    setLearningState(event.target.value as LearningGoalContinueStatus);
  };

  const handleTimeChange = (event: FormStateChangeEvent) => {
    setContinueTimeMin(Number(event.target.value));
  };

  const handleQuickSelectionChange = (event: FormStateChangeEvent) => {
    setContinueTimeMin(Number(event.target.value));
  };

  if (!currentLearningGoal) {
    return <CircularProgress />;
  }

  const getTargetTimeText = () => {
    return `${Math.floor(currentLearningGoal.targetDuration / MINUTES_IN_MILLISECOND)}分
    ${allowedOverflowTime > 0 ? `(+${allowedOverflowTime / MINUTES_IN_MILLISECOND}分)` : ""}`;
  }

  const handleEndLearningGoal = async (status: LearningGoalStatus) => {
    if (uid) {
      await endLearningGoal(uid, dispatch, status);
      resetTimer();
    }
  }

  const handleEnter = async () => {
    if (!uid) return;
    onEnter(learningState);
    switch (learningState) {
      case "continue":
        await addAllowedOverflowLearningTime(uid, continueTimeMin * MINUTES_IN_MILLISECOND, dispatch);
        break;
      case "procrastinate":
        handleEndLearningGoal("procrastinate");
        break;
      case "complete":
        handleEndLearningGoal("achieved");
        break;
    }
  }

  return (
    <Box p={2}>
      <Typography variant='h5'>
        学習継続の確認
      </Typography>
      <Typography variant='h6'>
        {currentLearningGoal.objective || "現在の学習"}が完了目標の{getTargetTimeText()}を経過しています。
      </Typography>
      <Typography variant='h6'>
        学習を続けますか？
      </Typography>

      <Box my={2}>
        <RadioGroupField 
          label='状態を選択'
          name='learningStatus'
          selectItems={learningStatusSelectItems}
          value={learningState}
          onChange={handleLearningStateChange}
        />
      </Box>

      {learningState === "continue" && (
        <Box display='flex' justifyContent='space-between' alignItems='center'>
          <Box flex={1} mr={2}>
            <NumberField 
              label="追加時間 (分)" 
              name='continueTimeMin' 
              min={0}
              max={180}
              value={continueTimeMin} 
              onChange={handleTimeChange} 
            />
          </Box>
          <QuickSelectionField
            name='continueTimeMin'
            selectItems={continueTimeSelection}
            onChange={handleQuickSelectionChange}
          />
        </Box>
      )}

      <Box display='flex' justifyContent='flex-end' mt={2}>
        <CircularButton bgColor="main" size="lg" onClick={handleEnter}>
          決定
        </CircularButton>
      </Box>
    </Box>
  );
};

export default ContinueLearningGoalWorkForm;
