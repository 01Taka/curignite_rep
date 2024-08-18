import React, { FC, useMemo } from 'react';
import { FormStateChangeFunc } from '../../../../../types/util/componentsTypes';
import { CreateTaskCollectionViewFormState } from '../../../../../types/app/task/taskForm';
import { keyMirror } from '../../../../../functions/objectUtils';
import { NumberField, StringField } from '../../../../../components/input/inputIndex';
import MultilineField from '../../../../../components/input/field/MultilineField';
import CircularButton, { CircularButtonSize } from '../../../../../components/input/button/CircularButton';
import { cn } from '../../../../../functions/utils';
import { Typography } from '@mui/material';

interface CreateTaskCollectionViewProps {
  formState: CreateTaskCollectionViewFormState;
  onFormStateChange: FormStateChangeFunc;
  onCreate: () => void;
  enterButtonSize?: CircularButtonSize;
  className?: string;
}

const CreateTaskCollectionView: FC<CreateTaskCollectionViewProps> = ({
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
        問題集を作成
      </Typography>
      <StringField
        label='名前'
        name={names.name}
        value={formState.name}
        onChange={onFormStateChange}
      />
      <StringField
        label='総ページ数'
        name={names.totalPages}
        value={formState.totalPages}
        onChange={onFormStateChange}
      />
      <NumberField
        label='1ページあたりの時間 (分)'
        name={names.timePerPage}
        value={formState.timePerPage}
        min={0}
        onChange={onFormStateChange}
      />
      <MultilineField
        label='説明'
        rows={3}
        name={names.description}
        value={formState.description}
        onChange={onFormStateChange}
      />
      <CircularButton onClick={onCreate} bgColor="main" size={enterButtonSize}>
        作成する
      </CircularButton>
    </div>
  );
};

export default CreateTaskCollectionView;
