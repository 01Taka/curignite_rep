import { FC } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import ActivityRangeForm from './ActivityRangeForm';
import DateField from '../../../../../components/input/field/DateField';
import { ProblemSetActivityManagementMethod } from '../../../../../types/firebase/db/task/taskSupplementTypes';
import { ProblemSetCategoryRead } from '../../../../../types/firebase/db/task/taskStructure';
import { CreateActivityFormState } from '../../shared/types/createTask/createActivityTypes';
import { ArrayFieldChangeAction, FormStateChangeAction } from '../../../../../types/app/formStateTypes';

interface CreateActivityViewProps {
  problemSetName: string;
  managementMethod: ProblemSetActivityManagementMethod;
  formState: CreateActivityFormState;
  categories: ProblemSetCategoryRead[]
  names: Record<string, string>;
  loading: boolean;
  onChangeFormState: (event: FormStateChangeAction) => void;
  onChangeArrayField: (event: ArrayFieldChangeAction) => void
  onCreate: () => void;
}

const CreateActivityView: FC<CreateActivityViewProps> = ({
  problemSetName,
  managementMethod,
  formState,
  categories,
  names,
  loading,
  onChangeFormState,
  onChangeArrayField,
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
          onChangeFormState={onChangeFormState}
        />
        <ActivityRangeForm
          name={"categoryActivities"}
          managementMethod={managementMethod}
          activityFormState={formState.categoryActivities}
          categories={categories}
          onChangeArrayField={onChangeArrayField}
          onChangeFormState={onChangeFormState}
        />
      </Box>
      <Button onClick={onCreate} variant='contained' sx={{ marginTop: 2 }} disabled={loading}>
        {loading ? <CircularProgress /> : "作成する"}
      </Button>
    </Box>
  );
};

export default CreateActivityView;
