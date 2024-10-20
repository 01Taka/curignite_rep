import React, { FC, useMemo } from 'react';
import { FormStateChangeFunc } from '../../../../../types/util/componentsTypes';
import { CreateCollectionTaskViewFormState } from '../../../../../types/app/task/taskForm';
import { keyMirror } from '../../../../../functions/objectUtils';
import { StringField } from '../../../../../components/input/inputIndex';
import MultilineField from '../../../../../components/input/field/MultilineField';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import DateTimeField from '../../../../../components/input/field/DateTimeField';
import RangeField from '../../../../../components/input/field/RangeField';

interface CreateCollectionTaskViewProps {
  collectionName: string;
  formState: CreateCollectionTaskViewFormState;
  rangeMax: number;
  loading: boolean;
  onFormStateChange: FormStateChangeFunc;
  onCreate: () => void;
}

const CreateCollectionTaskView: FC<CreateCollectionTaskViewProps> = ({
  collectionName,
  formState,
  rangeMax,
  loading,
  onFormStateChange,
  onCreate
}) => {
  const names = useMemo(() => keyMirror(formState), [formState]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'white',
      padding: 1,
      borderRadius: 2,
      maxHeight: '90hv',
      overflow: 'auto'
    }}>
      <Typography marginY={1} variant='h5'>
        {`${collectionName}のミッション`}
      </Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <DateTimeField
          label='提出日時'
          name={names.dueDateTime}
          value={formState.dueDateTime}
          onChange={onFormStateChange}
        />
        <RangeField 
          label='範囲'
          name={names.pagesInRange}
          value={formState.pagesInRange}
          onChange={onFormStateChange}
          min={1}
          max={rangeMax}
          minLabel='開始'
          maxLabel='終了'
          fullWidth
        />
        {/* <StringField
          label='タイトル'
          name={names.title}
          value={formState.title}
          onChange={onFormStateChange}
        /> */}
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
      <Button onClick={onCreate} variant='contained' sx={{ marginTop: 2 }} disabled={loading}>
        {loading ? <CircularProgress /> : "作成する"}
      </Button>
    </Box>
  );
};

export default CreateCollectionTaskView;
