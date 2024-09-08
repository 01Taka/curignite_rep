import React, { FC, useState } from 'react';
import { HelpAndAnswersWithFileUrls, UserHelpData } from '../../../types/firebase/db/user/userStructure';
import serviceFactory from '../../../firebase/db/factory';
import { useAppSelector } from '../../../redux/hooks';
import { StringField } from '../../../components/input/inputIndex';
import { keyMirror } from '../../../functions/objectUtils';
import { handleFormStateChange } from '../../../functions/utils';
import { FormStateChangeEvent } from '../../../types/util/componentsTypes';
import FileUploadField from '../../../components/input/field/FileUploadField';
import HelpCard from './HelpCard';
import { Alert, CircularProgress, Typography } from '@mui/material';
import MultilineField from '../../../components/input/field/MultilineField';
import CircularButton from '../../../components/input/button/CircularButton';

interface CreateAnswerFormProps {
  targetHelpAndAnswersInfo: HelpAndAnswersWithFileUrls;
  onCreated: () => void;
}

interface AnswerFormState {
  answer: string;
  files: File[];
}

const CreateAnswerForm: FC<CreateAnswerFormProps> = ({ targetHelpAndAnswersInfo, onCreated }) => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [formState, setFormState] = useState<AnswerFormState>({ answer: "", files: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const names = keyMirror(formState);

  const handleAnswer = async () => {
    console.log(formState);
    
    if (!uid) {
      setError('ユーザーIDが見つかりません。ログインしてください。');
      return;
    }

    if (!formState.answer.trim()) {
      setError('回答内容を入力してください。');
      return;
    }

    setLoading(true);
    setError(null); // 以前のエラーをクリア

    try {
      const help = targetHelpAndAnswersInfo.help;
      const answerService = serviceFactory.createHelpAnswerService();

      await answerService.createHelpAnswer(
        help.createdById,
        help.docId,
        formState.answer,
        formState.files,
        uid
      );
      setFormState({ answer: "", files: [] }); // フォームをリセット
      if (onCreated) onCreated();
    } catch (error) {
      console.error(error);
      setError('回答の送信に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  const onFormStateChange = (event: FormStateChangeEvent) => {
    handleFormStateChange(event, setFormState);
  };

  return (
    <div>
      <Typography variant='h5'>HELPに答える</Typography>
      <div className='bg-gray-200 p-2 rounded-lg my-4'>
        <HelpCard helpAndAnswersInfo={targetHelpAndAnswersInfo} hiddenShowAnswerButton />
      </div>
      <div className='flex flex-col space-y-4'>
        <Typography variant='h6'>回答内容</Typography>
        
        <MultilineField
          rows={4}
          label='回答'
          value={formState.answer}
          name={names.answer}
          onChange={onFormStateChange}
        />
        
        <FileUploadField
          label='添付ファイル'
          value={formState.files}
          name={names.files}
          onChange={onFormStateChange}
          maxFiles={3}
        />

        <div className='flex justify-end items-center space-x-4'>
          {error && <Alert severity='error' className='h-auto'>{error}</Alert>}

          <CircularButton
            size="lg"
            bgColor="main"
            onClick={handleAnswer}
            invalidation={loading}
          >
            {loading ? <CircularProgress /> : '回答する'}
          </CircularButton>
        </div>
      </div>
    </div>
  );
};

export default CreateAnswerForm;
