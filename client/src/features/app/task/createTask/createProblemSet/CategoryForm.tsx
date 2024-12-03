import React from 'react';
import { ProblemSetCategoryForm } from '../../shared/types/createTask/createProblemSetTypes';
import { Box, IconButton, TextField } from '@mui/material';
import { FormStateChangeFunc } from '../../../../../types/util/componentsTypes';
import { keyMirror } from '../../../../../functions/utils/objectUtils';
import QuickNumberField from '../../../../../components/input/field/number/QuickNumberField';
import { createNumberSelectItems } from '../../../../../functions/utils/formUtils';
import { Delete } from '@mui/icons-material';

interface CategoryFormProps {
  formState: ProblemSetCategoryForm;
  onChange: FormStateChangeFunc;
  onDelete: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  formState,
  onChange,
  onDelete
}) => {
  const names = keyMirror(formState);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.2rem',
      padding: 1,
      marginY: 1,
      border: 1,
      borderColor: 'gray',
      borderRadius: 2
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <TextField name={names.name} label='大問名' value={formState.name} onChange={onChange}/>
        <IconButton onClick={onDelete}>
          <Delete />
        </IconButton>
      </Box>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '0.2rem',
        width: '100%',
      }}>
        <QuickNumberField
          name={names.timePerProblem}
          label='1問の時間(分)'
          value={formState.timePerProblem}
          selectItems={createNumberSelectItems(5, 181, 5, 1, '分')}
          onChange={onChange}
        />
        <QuickNumberField
          name={names.totalProblemNumber}
          label='総問題数'
          value={formState.totalProblemNumber}
          selectItems={createNumberSelectItems(10, 501, 10, 1, '問')}
          onChange={onChange}
        />
      </Box>
    </Box>
  );
};

export default CategoryForm;