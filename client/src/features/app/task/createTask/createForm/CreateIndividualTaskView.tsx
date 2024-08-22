import React, { FC, useMemo } from 'react';
import { FormStateChangeFunc } from '../../../../../types/util/componentsTypes';
import { CreateIndividualTaskViewFormState } from '../../../../../types/app/task/taskForm';
import { keyMirror } from '../../../../../functions/objectUtils';
import { NumberField, StringField } from '../../../../../components/input/inputIndex';
import MultilineField from '../../../../../components/input/field/MultilineField';
import SelectField from '../../../../../components/input/field/SelectField';
import CircularButton, { CircularButtonSize } from '../../../../../components/input/button/CircularButton';
import { taskPrioritySelectItem } from '../../../../../types/app/task/taskForm';
import { cn } from '../../../../../functions/utils';
import { Typography } from '@mui/material';
import DateTimeField from '../../../../../components/input/field/DateTimeField';

interface CreateIndividualTaskViewProps {
  formState: CreateIndividualTaskViewFormState;
  onFormStateChange: FormStateChangeFunc;
  onCreate: () => void;
  enterButtonSize?: CircularButtonSize;
  className?: string;
}

const CreateIndividualTaskView: FC<CreateIndividualTaskViewProps> = ({
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
        タスクを追加
      </Typography>
      <DateTimeField
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
      <MultilineField
        label='補足説明'
        rows={3}
        name={names.taskNote}
        value={formState.taskNote}
        onChange={onFormStateChange}
      />
      <NumberField
        label='推定所要時間 (分)'
        name={names.estimatedDuration}
        value={formState.estimatedDuration}
        min={0}
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

export default CreateIndividualTaskView;
