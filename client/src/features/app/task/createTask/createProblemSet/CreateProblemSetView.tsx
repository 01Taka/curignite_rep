import React, { FC } from 'react';
import { FormStateChangeFunc } from '../../../../../types/util/componentsTypes';
import { KeyMirrorObject } from '../../../../../functions/utils/dataStructureUtils/objectUtils';
import { StringField } from '../../../../../components/input/inputIndex';
import MultilineField from '../../../../../components/input/field/MultilineField';
import { Box, Button, Typography } from '@mui/material';
import ManagementMethodSelector from './ManagementMethodSelector';
import { CreateProblemSetFormState } from '../../shared/types/createTask/createProblemSetTypes';

interface CreateProblemSetViewProps {
  formState: CreateProblemSetFormState;
  names: KeyMirrorObject<CreateProblemSetFormState>;
  isDisabledCreate: boolean;
  onFormStateChange: FormStateChangeFunc;
  updateField: (fieldName: keyof CreateProblemSetFormState, value: any) => void;
  onCreate: () => void;
}


const CreateProblemSetView: FC<CreateProblemSetViewProps> = ({
  formState,
  names,
  isDisabledCreate,
  onFormStateChange,
  updateField,
  onCreate,
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'white',
      padding: 1,
      borderRadius: 2,
    }}
  >
    <Typography sx={{ paddingY: 1 }} variant="h5">
      問題集を作成
    </Typography>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <StringField
        label="名前"
        name={names.name}
        value={formState.name}
        onChange={onFormStateChange}
      />
      <MultilineField
        label="説明"
        rows={3}
        name={names.description}
        value={formState.description}
        onChange={onFormStateChange}
      />
      <ManagementMethodSelector
        managementMethod={formState.activityManagementMethod}
        setManagementMethod={(value) => updateField("activityManagementMethod", value)}
        updateField={updateField}
      />
    </Box>
    <Button onClick={onCreate} variant="contained" sx={{ marginTop: 2 }} disabled={isDisabledCreate}>
      作成する
    </Button>
  </Box>
);

export default CreateProblemSetView;
