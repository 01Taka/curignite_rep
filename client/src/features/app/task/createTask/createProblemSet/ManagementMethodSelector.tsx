import React, { useEffect, useState } from 'react';
import { CreateProblemSetViewFormState, ProblemSetCategoryForm } from '../../shared/types/createTask/createProblemSetTypes';
import useArrayState from '../../../../hooks/form/useArrayState';
import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import QuickNumberField from '../../../../../components/input/field/number/QuickNumberField';
import { createNumberSelectItems, updateFiledByEvent } from '../../../../../functions/utils/formUtils';
import CategoryForm from './CategoryForm';
import { ProblemSetActivityManagementMethod } from '../../../../../types/firebase/db/task/taskSupplementTypes';

const ManagementMethodSelector: React.FC<{
  managementMethod: ProblemSetActivityManagementMethod;
  setManagementMethod: (method: ProblemSetActivityManagementMethod) => void;
  updateField: (fieldName: keyof CreateProblemSetViewFormState, value: any) => void;
}> = ({ managementMethod, setManagementMethod, updateField }) => {
  const { array: mainQuestions, push, pop, update } = useArrayState<ProblemSetCategoryForm>([
    { name: '問', timePerProblem: 10, totalProblemNumber: 30 },
  ]);
  
  const [pageSettings, setPageSettings] = useState<ProblemSetCategoryForm>({
    name: 'page',
    timePerProblem: 10,
    totalProblemNumber: 200,
  });

  useEffect(() => {
    updateField("categories", managementMethod === 'page' ? [pageSettings] : mainQuestions);
  }, [managementMethod, pageSettings, mainQuestions, updateField]);

  return (
    <Box>
      <Typography>管理方法</Typography>
      <ToggleButtonGroup
        value={managementMethod}
        sx={{
          marginY: 1,
        }}
        exclusive
        onChange={(_, newValue) => newValue && setManagementMethod(newValue)}
      >
        <ToggleButton value="page">ページ</ToggleButton>
        <ToggleButton value="mainQuestion">問題番号</ToggleButton>
      </ToggleButtonGroup>
      {managementMethod === 'page' ? (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.2rem'
        }}>
          <QuickNumberField
            name="timePerProblem"
            label="1ページ当たりの時間(分)"
            value={pageSettings.timePerProblem}
            selectItems={createNumberSelectItems(5, 181, 5, 1, '分')}
            onChange={(e) => setPageSettings(updateFiledByEvent(pageSettings, e))}
          />
          <QuickNumberField
            name="totalProblemNumber"
            label="総ページ数"
            value={pageSettings.totalProblemNumber}
            selectItems={createNumberSelectItems(10, 501, 10, 1, 'ページ')}
            onChange={(e) => setPageSettings(updateFiledByEvent(pageSettings, e))}
          />
        </Box>
      ) : (
        <Box>
          {mainQuestions.map((category, index) => (
            <CategoryForm
              key={index}
              formState={category}
              onChange={(e) => update(index, updateFiledByEvent(category, e))}
              onDelete={() => pop(index)}
            />
          ))}
          <Button onClick={() => push({ name: '', timePerProblem: 0, totalProblemNumber: 0 })}>
            追加
          </Button>
        </Box>
      )}
    </Box>
  );
};
export default ManagementMethodSelector;