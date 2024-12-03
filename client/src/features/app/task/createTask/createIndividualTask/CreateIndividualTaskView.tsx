import React, { FC, useMemo } from 'react';
import { FormStateChangeFunc } from '../../../../../types/util/componentsTypes';
import { keyMirror } from '../../../../../functions/utils/objectUtils';
import { StringField } from '../../../../../components/input/inputIndex';
import MultilineField from '../../../../../components/input/field/MultilineField';
import { Box, Button, Typography } from '@mui/material';
import DateField from '../../../../../components/input/field/DateField';
import QuickNumberField from '../../../../../components/input/field/number/QuickNumberField';
import { createNumberSelectItems } from '../../../../../functions/utils/formUtils';
import { CreateIndividualTaskFormState } from '../../shared/types/createTask/createIndividualTaskTypes';

interface CreateIndividualTaskViewProps {
  formState: CreateIndividualTaskFormState;
  onFormStateChange: FormStateChangeFunc;
  onCreate: () => void;
}

const CreateIndividualTaskView: FC<CreateIndividualTaskViewProps> = ({
  formState,
  onFormStateChange,
  onCreate,
}) => {
  const names = useMemo(() => keyMirror(formState), [formState]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'white',
      padding: 1,
      borderRadius: 2,
    }}>
      <Typography sx={{ paddingY: 1 }} variant='h5'>
        タスクを追加
      </Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <DateField
          label='提出日時'
          name={names.dueDateTime}
          value={formState.dueDateTime}
          onChange={onFormStateChange}
        />
        <StringField
          label='タイトル'
          name={names.title}
          value={formState.title}
          onChange={onFormStateChange}
        />
        <QuickNumberField
          label='推定所要時間 (分)'
          name={names.estimatedDuration}
          value={formState.estimatedDuration}
          selectItems={createNumberSelectItems(5, 181, 5, 1, '分')}
          min={0}
          onChange={onFormStateChange}
        />
        <MultilineField
          label='補足説明'
          rows={3}
          name={names.taskNote}
          value={formState.taskNote}
          onChange={onFormStateChange}
        />
        {/* <SelectField
          label='優先度'
          name={names.priority}
          selectItems={taskPrioritySelectItem}
          value={formState.priority}
          onChange={onFormStateChange}
        /> */}
      </Box>
      <Button onClick={onCreate} variant='contained' sx={{ marginTop: 2 }}>
        作成する
      </Button>
    </Box>
  );
};

export default CreateIndividualTaskView;
