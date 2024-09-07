import React, { FC, useEffect, useState } from 'react';
import Popup from '../../../components/util/Popup';
import serviceFactory from '../../../firebase/db/factory';
import { StringField } from '../../../components/input/inputIndex';
import { Subject } from '../../../types/firebase/db/common/commonTypes';
import { endOfDay } from 'date-fns';
import { keyMirror } from '../../../functions/objectUtils';
import DateTimeField from '../../../components/input/field/DateTimeField';
import { handleFormStateChange } from '../../../functions/utils';
import { FormStateChangeEvent } from '../../../types/util/componentsTypes';
import SelectField from '../../../components/input/field/SelectField';
import { useAppSelector } from '../../../redux/hooks';
import { toTimestamp } from '../../../functions/dateTimeUtils';
import { Box, Typography, Alert } from '@mui/material';
import { subjectSelectItems } from '../../../constants/selectItems/subjectSelectItems';
import CircularButton from '../../../components/input/button/CircularButton';
import { IndexedLearningSessionService } from '../../../functions/browserStorage/indexedDB/services/indexedLearningSessionService';

interface StartSessionPopupProps {
  open: boolean;
  handleClose: () => void;
}

interface CreateGoalFormState {
  objectives: string;
  subject: Subject;
  deadline: Date;
}

const StartSessionPopup: FC<StartSessionPopupProps> = ({ open, handleClose }) => {
  const uid = useAppSelector(state => state.userSlice.uid);

  const [formState, setFormState] = useState<CreateGoalFormState>({
    objectives: "",
    subject: Subject.NotSelected,
    deadline: endOfDay(new Date()),
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(null);
  }, [open]);

  const handleCreateGoal = async () => {
    if (uid && formState.objectives && formState.subject !== Subject.NotSelected) {
      try {
        const userService = serviceFactory.createUserService();
        const goalService = serviceFactory.createUserGoalService();
        const goalRef = await goalService.createUserGoal(uid, formState.objectives, formState.subject, toTimestamp(formState.deadline));
        await userService.setCurrentTargetGoalId(uid, goalRef.id);
      } catch (error) {
        console.error("Error creating goal:", error);
        setErrorMessage("目標の作成中にエラーが発生しました。もう一度試してください。");
      }
    } else {
      setErrorMessage("目標と教科を正しく設定してください。");
    }
  };                  

  const handleStartSession = async () => {
    await handleCreateGoal();
    await IndexedLearningSessionService.startSession();  
    handleClose(); // 成功時にポップアップを閉じる 
  }

  const formStateChangeHandler = (e: FormStateChangeEvent) => {
    handleFormStateChange(e, setFormState);
    // エラーメッセージのリセット
    setErrorMessage(null);
  };

  return (
    <Popup open={open} handleClose={handleClose}>
      <Box className='space-y-6 shadow-md p-4 rounded-lg'>
        <Typography variant='h5'>
          学習目標を設定。
        </Typography>
        <StringField
          label="目標"
          value={formState.objectives}
          name={keyMirror(formState).objectives}
          onChange={formStateChangeHandler}
        />
        <SelectField
          label='教科'
          value={formState.subject}
          name={keyMirror(formState).subject}
          selectItems={subjectSelectItems}
          onChange={formStateChangeHandler}
        />
        <DateTimeField
          label='目標達成時刻'
          value={formState.deadline}
          name={keyMirror(formState).deadline}
          onChange={formStateChangeHandler}
        />
      </Box>
      <Box className="flex flex-col w-full pr-2 mt-2">
        {errorMessage && (
          <Alert severity="error" className='mt-2'>{errorMessage}</Alert>
        )}
        <div className='self-end mt-2'>
          <CircularButton bgColor="main" size="xl" textSize="lg" onClick={handleStartSession}>
            セッション<br/>を開始
          </CircularButton>
        </div>
      </Box>
    </Popup>
  );
};

export default StartSessionPopup;
