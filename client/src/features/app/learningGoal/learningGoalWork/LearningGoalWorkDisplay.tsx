import React, { FC, useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import SubjectIcon from '../../../../components/util/SubjectIcon';
import CircularButton from '../../../../components/input/button/CircularButton';
import { useAppSelector } from '../../../../redux/hooks';
import { convertToMilliseconds, msToTime } from '../../../../functions/dateTimeUtils';
import { revertTimestampConversion } from '../../../../functions/db/dataFormatUtils';
import LearningGoalWorkTimer from './LearningGoalWorkTimer';
import { useLearningTimer } from './LearningTimerProvider';
import Popup from '../../../../components/util/Popup';
import ContinueLearningGoalWorkForm from './ContinueLearningGoalWorkForm';
import FinishLearningGoalForm from './FinishLearningGoalForm';

interface LearningGoalWorkDisplayProps {}

const LearningGoalWorkDisplay: FC<LearningGoalWorkDisplayProps> = () => {
  const { currentLearningGoal, allowedOverflowTime } = useAppSelector(state => state.learningGoalSlice);
  const [openFinishPopup, setOpenFinishPopup] = useState(false);

  const { 
    isRunning,
    elapsedTime,
    isOverTargetTime,
    startTimer,
    stopTimer,
    resetTimer,
    setTime,
   } = useLearningTimer();


  if (!currentLearningGoal) {
    return <Typography>現在のゴールが見つかりませんでした。</Typography>;
  }

  return (
    <>
      <div className='relative w-full h-full'>
        <div className='flex w-full h-full'>
          <div className='flex flex-col justify-between w-full h-full ml-2'>
            <Typography variant='h4'>{currentLearningGoal.objective}</Typography>
            <SubjectIcon subject={currentLearningGoal.subject} />
            <LearningGoalWorkTimer 
              isRunning={isRunning}
              elapsedTime={elapsedTime}
              targetDuration={convertToMilliseconds(currentLearningGoal.targetDuration)}
              allowedOverflowTime={allowedOverflowTime}
              mode='pomodoro'
            />
            <Typography>合計: {msToTime(elapsedTime, false)}</Typography>
          </div>
          <WorkControls
            isRunning={isRunning}
            onToggleRunningState={isRunning ? stopTimer : startTimer}
            onFinish={() => setOpenFinishPopup(true)}
          />
        </div>
      </div>
      <Popup open={!openFinishPopup && isOverTargetTime} handleClose={() => {}}>
        <ContinueLearningGoalWorkForm onEnter={() => setOpenFinishPopup(false)} />
      </Popup>
      <Popup open={openFinishPopup} handleClose={() => setOpenFinishPopup(false)} >
        <FinishLearningGoalForm onEnter={() => setOpenFinishPopup(false)} />
      </Popup>
    </>
  );
};

interface PomodoroControlsProps {
  isRunning: boolean;
  onToggleRunningState: () => void;
  onFinish: () => void;
}

const WorkControls: FC<PomodoroControlsProps> = ({ isRunning, onToggleRunningState, onFinish }) => (
  <div className='flex flex-col justify-end items-center'>
    <Typography variant='h4' sx={{ mb: '40px' }}>
      {isRunning ? '学習中' : '休憩中'}
    </Typography>
    <div className='flex space-x-2'>
      <CircularButton onClick={onToggleRunningState}>
        {isRunning ? '休憩' : '再開'}
      </CircularButton>
      <CircularButton onClick={onFinish}>終了</CircularButton>
    </div>
  </div>
);

export default LearningGoalWorkDisplay;
