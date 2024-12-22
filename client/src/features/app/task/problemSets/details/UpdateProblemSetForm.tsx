import React from 'react';
import useUpdateProblemSetHandler from '../../shared/hooks/problemSet/crud/useUpdateProblemSetHandler';
import { ProblemSetRead } from '../../../../../types/firebase/db/task/taskStructure';
import { Box, Button, TextField, Typography } from '@mui/material';
import MultilineField from '../../../../../components/input/field/MultilineField';
import { dynamicStyles } from '../../../../../styles/mui/dynamicStyles';
import { useAppSelector } from '../../../../../redux/hooks';
import useFormState from '../../../../hooks/form/useFormState';
import { UpdateProblemSetFormState } from '../../shared/types/createTask/createProblemSetTypes';
import { commonStyles } from '../../../../../styles/mui/commonStyles';

interface UpdateProblemSetFormProps {
  problemSet: ProblemSetRead;
  onSuccessUpdate: () => void;
  onCancel: () => void;
}

const UpdateProblemSetForm: React.FC<UpdateProblemSetFormProps> = ({ problemSet, onSuccessUpdate, onCancel }) => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const { formState, names, onChangeFormState } = useFormState<UpdateProblemSetFormState>({
    name: problemSet.name,
    description: problemSet.description
  });

  const {
    asyncStatus,
    handleUpdateProblemSet
  } = useUpdateProblemSetHandler(formState, uid, problemSet, onSuccessUpdate);

  return (
    <Box sx={{ ...dynamicStyles.card(), display: 'flex', flexDirection: 'column', gap: 2, bgcolor: 'whitesmoke' }}>
      <Typography variant='h6'>
        {problemSet.name}を編集
      </Typography>
      <Box sx={{...commonStyles.flexColumnCenter, gap: 1, }}>
        <TextField label='タイトル' name={names.name} value={formState.name} onChange={(e) => onChangeFormState({ name: e.target.name, value: e.target.value })} fullWidth />
        <MultilineField label='説明文' name={names.description} value={formState.description} rows={3} onChange={(e) => onChangeFormState({ name: e.target.name, value: e.target.value })} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
      <Button variant='outlined' sx={{ alignSelf: 'end', width: '45%' }} onClick={onCancel} >
          キャンセル
        </Button>
        <Button variant='contained' sx={{ alignSelf: 'end', width: '45%' }} onClick={handleUpdateProblemSet} disabled={asyncStatus === "loading"} >
          保存
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateProblemSetForm;