import React, { useEffect, useState } from 'react';
import { ProblemSetCategoryForm } from '../../shared/types/createTask/createProblemSetTypes';
import useArrayState from '../../../../hooks/form/useArrayState';
import { Box, Button, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import CategoryForm from './CategoryForm';
import { ProblemSetActivityManagementMethod } from '../../../../../types/firebase/db/task/taskSupplementTypes';
import TimeAndProblemCountField from './TimeAndProblemCountField';
import { commonStyles } from '../../../../../styles/mui/commonStyles';
import { ArrayFieldChangeAction, FormStateChangeAction } from '../../../../../types/app/formStateTypes';

const ManagementMethodSelector: React.FC<{
  managementMethod: ProblemSetActivityManagementMethod;
  pageMethodName?: string;
  onChangeFormState: (action: FormStateChangeAction) => void;
  onChangeArrayField: (action: ArrayFieldChangeAction) => void;
}> = ({
  managementMethod,
  pageMethodName = "ページ",
  onChangeFormState,
  onChangeArrayField
}) => {
  const [, setProblemCount] = useState(2);

  const getInitialCategoryState = (name: string = "問") => {
    return { name, timePerProblem: 10, totalProblemCount: 30 };
  }
  
  const { array: mainQuestions, push, pop, update } = useArrayState<ProblemSetCategoryForm>([getInitialCategoryState()]);

  const [pageSettings, setPageSettings] = useState<ProblemSetCategoryForm>({
    name: pageMethodName,
    timePerProblem: 10,
    totalProblemCount: 200,
  });

  useEffect(() => {
    onChangeFormState({ name: "categories", value: managementMethod === 'page' ? [pageSettings] : mainQuestions });
  }, [managementMethod, pageSettings, mainQuestions, onChangeFormState]);

  return (
    <Box>
      <Typography>管理方法</Typography>
      <ToggleButtonGroup
        value={managementMethod}
        sx={{
          marginY: 1,
        }}
        exclusive
        onChange={(_, newValue) => newValue && onChangeFormState({ name: "activityManagementMethod", value: newValue })}
      >
        <ToggleButton value="page">ページ</ToggleButton>
        <ToggleButton value="mainQuestion">問題番号</ToggleButton>
      </ToggleButtonGroup>
      {managementMethod === 'page' ? (
        <TimeAndProblemCountField
          time={pageSettings.timePerProblem}
          timeFormLabel="1ページ当たりの時間(分)"
          onTimeChange={(action) => setPageSettings({ ...pageSettings, name: action.name, timePerProblem: action.value })}
          problemCount={pageSettings.totalProblemCount}
          problemCountFormLabel="総ページ数"
          problemCountUnit='ページ'
          onProblemCountChange={(action) =>setPageSettings({ ...pageSettings, name: action.name, totalProblemCount: action.value })}
          boxSx={{
            ...commonStyles.flexColumnCenter,
            gap: 1
          }}
        />
      ) : (
        <Box>
          {mainQuestions.map((category, index) => (
            <CategoryForm
              key={index}
              category={category}
              onChangeCategoryState={(newCategory) => update(
                index, { ...category, ...newCategory }
              )}
              onDelete={() => {if (mainQuestions.length > 1) pop(index)}}
            />
          ))}
          <Button onClick={() => {
            setProblemCount(prev => {
              push(getInitialCategoryState(`問${prev}`))
              return prev + 1;
            })
          }}>
            追加
          </Button>
        </Box>
      )}
    </Box>
  );
};
export default ManagementMethodSelector;