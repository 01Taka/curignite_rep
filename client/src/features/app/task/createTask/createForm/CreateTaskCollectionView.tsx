import React, { FC, useMemo } from 'react';
import { FormStateChangeFunc } from '../../../../../types/util/componentsTypes';
import { CreateTaskCollectionViewFormState } from '../../../../../types/app/task/taskForm';
import { keyMirror } from '../../../../../functions/objectUtils';
import { NumberField, StringField } from '../../../../../components/input/inputIndex';
import MultilineField from '../../../../../components/input/field/MultilineField';
import { Box, Button, Typography } from '@mui/material';

interface CreateTaskCollectionViewProps {
  formState: CreateTaskCollectionViewFormState;
  onFormStateChange: FormStateChangeFunc;
  onCreate: () => void;
}

const CreateTaskCollectionView: FC<CreateTaskCollectionViewProps> = ({
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
        問題集を作成
      </Typography>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
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
      </Box>
      <Button onClick={onCreate} variant='contained' sx={{ marginTop: 2 }}>
        作成する
      </Button>
    </Box>
  );
};

export default CreateTaskCollectionView;
