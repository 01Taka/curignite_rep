import React from 'react';
import { ProblemSetCategoryForm } from '../../shared/types/createTask/createProblemSetTypes';
import { Box, IconButton, TextField } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { commonStyles } from '../../../../../styles/mui/commonStyles';
import TimeAndProblemCountField from './TimeAndProblemCountField';

interface CategoryFormProps {
  category: ProblemSetCategoryForm;
  onChangeCategoryState: (category: Partial<ProblemSetCategoryForm>) => void;
  onDelete: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onChangeCategoryState,
  onDelete
}) => {
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
      <Box sx={{ ...commonStyles.flexBetween }}>
        <TextField name="name" label='大問名' value={category.name} onChange={(e) => onChangeCategoryState({ name: e.target.value })}/>
        <IconButton size="small" onClick={onDelete}>
          <Delete />
        </IconButton>
      </Box>
      <TimeAndProblemCountField
        time={category.timePerProblem}
        timeFormLabel="1問の時間(分)"
        onTimeChange={(action) => onChangeCategoryState({ timePerProblem: action.value })}
        problemCount={category.totalProblemCount}
        problemCountFormLabel="総問題数"
        problemCountUnit='問'
        onProblemCountChange={(action) => onChangeCategoryState({ totalProblemCount: action.value })}
        boxSx={{
          ...commonStyles.flexBetween,
          gap: 1
        }}
      />
    </Box>
  );
};

export default CategoryForm;