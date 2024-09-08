import React, { FC, useEffect, useState } from 'react';
import serviceFactory from '../../../firebase/db/factory';
import { Subject } from '../../../types/firebase/db/common/commonTypes';
import { useAppSelector } from '../../../redux/hooks';
import { StringField } from '../../../components/input/inputIndex';
import { keyMirror } from '../../../functions/objectUtils';
import SelectField from '../../../components/input/field/SelectField';
import { handleFormStateChange } from '../../../functions/utils';
import { FormStateChangeEvent } from '../../../types/util/componentsTypes';
import { subjectSelectItems } from '../../../constants/selectItems/subjectSelectItems';
import FileUploadField from '../../../components/input/field/FileUploadField';
import CircularButton from '../../../components/input/button/CircularButton';
import { Typography, Alert, CircularProgress, Box } from '@mui/material';
import MultilineField from '../../../components/input/field/MultilineField';

interface HelpFromState {
  question: string;
  subject: Subject;
  files: File[];
}

interface CreateHelpFormProps {
  onSentHelp?: () => void;
}

const CreateHelpForm: FC<CreateHelpFormProps> = ({ onSentHelp }) => {
  const uid = useAppSelector(state => state.userSlice.uid);

  const [formState, setFormState] = useState<HelpFromState>({
    question: "",
    subject: Subject.NotSelected,
    files: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const names = keyMirror(formState);

  const handleCreateHelp = async () => {
    setError(null);
    setSuccess(false);

    if (!formState.question.trim()) {
      setError("質問内容は必須です");
      return;
    }

    setLoading(true);

    try {
      if (uid) {
        const helpService = serviceFactory.createUserHelpService();
        await helpService.createUserHelp(uid, formState.subject, formState.question, formState.files);
        setSuccess(true);
        setFormState({
          question: "",
          subject: Subject.NotSelected,
          files: [],
        });
        if (onSentHelp) onSentHelp();
      }
    } catch (err) {
      console.error(err);
      setError("ヘルプの作成中にエラーが発生しました。再試行してください。");
    } finally {
      setLoading(false);
    }
  };

  const onFormStateChange = (event: FormStateChangeEvent) => {
    handleFormStateChange(event, setFormState);
  };

  return (
    <div className='flex flex-col space-y-4 mt-2'>
      <Typography variant='h5'>
        HELPを求める
      </Typography>
      <Typography>
        ＊分からないところや疑問点を学習中のメンバーに訊いてみましょう！
      </Typography>
      <MultilineField
        rows={4} 
        label='質問内容' 
        value={formState.question} 
        name={names.question} 
        onChange={onFormStateChange} 
        required 
      />
      <SelectField 
        label='教科' 
        value={formState.subject} 
        name={names.subject} 
        onChange={onFormStateChange} 
        selectItems={subjectSelectItems} 
      />
      <FileUploadField 
        label='添付ファイル' 
        value={formState.files} 
        name={names.files} 
        onChange={onFormStateChange} 
        maxHeight={200} 
        maxFiles={3}
      />
      <Box display="flex" justifyContent="flex-end" alignItems="center" className="space-x-4">
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">ヘルプが送信されました！</Alert>}
        {loading ? (
          <CircularProgress />
        ) : (
          <CircularButton bgColor="success" onClick={handleCreateHelp} size="lg">
            ヘルプを<br />送信
          </CircularButton>
        )}
      </Box>
    </div>
  );
};

export default CreateHelpForm;
