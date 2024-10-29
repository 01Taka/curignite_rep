import React, { FC } from 'react';
import { FormStateChangeFunc } from '../../../../../types/util/componentsTypes';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { CreateActivityFormState } from './createActivityTypes';
import { ProblemSetActivityManagementMethod, ProblemSetCategoryData } from '../../../../../types/firebase/db/common/task/taskStructure';
import ActivityRangeForm from './ActivityRangeForm';
import { UpdateArrayFieldArgs } from '../../../../hooks/form/AsyncHandlerTypes';
import DateField from '../../../../../components/input/field/DateField';

interface CreateActivityViewProps {
  problemSetName: string;
  managementMethod: ProblemSetActivityManagementMethod;
  formState: CreateActivityFormState;
  categories: ProblemSetCategoryData[]
  names: Record<string, string>;
  loading: boolean;
  onFormStateChange: FormStateChangeFunc;
  updateArrayField: (args: UpdateArrayFieldArgs<CreateActivityFormState, any>) => void
  onCreate: () => void;
}

const CreateActivityView: FC<CreateActivityViewProps> = ({
  problemSetName,
  managementMethod,
  formState,
  categories,
  names,
  loading,
  onFormStateChange,
  updateArrayField,
  onCreate
}) => {
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
        {`${problemSetName}のミッション`}
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
        <ActivityRangeForm
          managementMethod={managementMethod}
          formState={formState.categoryActivities}
          categories={categories}
          updateArrayField={updateArrayField}
        />
        {/* <StringField
          label='タイトル'
          name={names.title}
          value={formState.title}
          onChange={onFormStateChange}
        /> 
        <MultilineField
          label='補足説明'
          rows={3}
          name={names.taskNote}
          value={formState.taskNote}
          onChange={onFormStateChange}
        /> 
        <SelectField
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

export default CreateActivityView;
