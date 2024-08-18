import React, { FC, useMemo } from 'react';
import { FormStateChangeFunc } from '../../../../../types/util/componentsTypes';
import { CreateBatchTaskViewFormState, taskPrioritySelectItem } from '../../../../../types/app/task/taskForm';
import { keyMirror } from '../../../../../functions/objectUtils';
import { StringField } from '../../../../../components/input/inputIndex';
import MultilineField from '../../../../../components/input/field/MultilineField';
import SelectField from '../../../../../components/input/field/SelectFiled';
import { cn } from '../../../../../functions/utils';
import CircularButton, { CircularButtonSize } from '../../../../../components/input/button/CircularButton';
import { Typography } from '@mui/material';
import DateTimeFiled from '../../../../../components/input/field/DateTimeFiled';

interface CreateBatchTaskViewProps {
  formState: CreateBatchTaskViewFormState;
  onFormStateChange: FormStateChangeFunc;
  onCreate: () => void;
  enterButtonSize?: CircularButtonSize,
  className?: string;
}

const CreateBatchTaskView: FC<CreateBatchTaskViewProps> = ({
  formState,
  onFormStateChange,
  onCreate,
  enterButtonSize = "lg",
  className = "",
}) => {
  const names = useMemo(() => keyMirror(formState), [formState]);

  return (
    <div className={cn('flex flex-col items-end space-y-4 max-w-lg', className)}>
      <Typography className='w-full p-2' variant='h4'>
        ページを追加
      </Typography>
      <DateTimeFiled
        label='提出日時'
        name={names.dueDateTime}
        value={formState.dueDateTime}
        onChange={onFormStateChange}
        fullWidth
      />
      <StringField
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
      />
      <CircularButton onClick={onCreate} bgColor="main" size={enterButtonSize}>
        作成する
      </CircularButton>
    </div>
  );
};

export default CreateBatchTaskView;
