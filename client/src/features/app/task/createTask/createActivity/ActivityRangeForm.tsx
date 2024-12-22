import React, { useMemo, useCallback, useEffect } from 'react';
import { ProblemSetCategoryRead } from '../../../../../types/firebase/db/task/taskStructure';
import { Box, Button } from '@mui/material';
import RangeField from '../../../../../components/input/field/number/RangeField';
import SelectField from '../../../../../components/input/field/SelectField';
import { Range, SelectItem } from '../../../../../types/util/componentsTypes';
import useArrayState from '../../../../hooks/form/useArrayState';
import { objectArrayToDict } from '../../../../../functions/utils/dataStructureUtils/objectUtils';
import { ProblemSetActivityManagementMethod } from '../../../../../types/firebase/db/task/taskSupplementTypes';
import { CategoryActivityFormState, CreateActivityFormState } from '../../shared/types/createTask/createActivityTypes';
import { ArrayFieldChangeAction, FormStateChangeAction } from '../../../../../types/app/formStateTypes';

interface ActivityRangeFormProps {
  name: keyof CreateActivityFormState;
  managementMethod: ProblemSetActivityManagementMethod;
  activityFormState: CategoryActivityFormState[];
  categories: ProblemSetCategoryRead[];
  onChangeFormState: (action: FormStateChangeAction) => void;
  onChangeArrayField: (action: ArrayFieldChangeAction) => void;
}

const ActivityRangeForm: React.FC<ActivityRangeFormProps> = ({ name, managementMethod, activityFormState, categories, onChangeFormState, onChangeArrayField }) => {
  const { array, push, update } = useArrayState<string>();
  
  console.log(categories);
  
  // 未選択のカテゴリをフィルタリングして項目リストを生成
  const selectItems: SelectItem<string>[] = useMemo(() => {
    return categories.map(category => ({ label: category.name, value: category.docId }));
  }, [categories]);

  const categoryIdMap = useMemo(() => {
    return objectArrayToDict(categories, 'docId');
  }, [categories]);

  // カテゴリ選択の変更ハンドラ
  const handleSelectChange = useCallback((index: number, categoryId: string) => {
      onChangeArrayField({
        operation: "replace",
        name,
        index,
        value: { ...activityFormState[index], categoryId },
      });
      update(index, categoryId);
    },
    [onChangeArrayField, update, activityFormState]
  );

  // 範囲選択の変更ハンドラ
  const handleRangeChange = useCallback(
    (index: number, problemRanges: Range[]) => {
      onChangeArrayField({
        operation: "replace",
        name,
        index,
        value: { ...activityFormState[index], problemRanges },
      });
    },
    [onChangeArrayField, activityFormState]
  );

  // 新しいカテゴリアクティビティを追加
  const handleAddCategoryActivity = useCallback(() => {
    onChangeArrayField({
      operation: "push",
      name,
      value: { categoryId: '', problemRanges: [] } as CategoryActivityFormState,
    });
    push('');
  }, [onChangeArrayField, push]);

  useEffect(() => {
    if (activityFormState.length === 0) {
      handleAddCategoryActivity();
    }
  }, [activityFormState, handleAddCategoryActivity]);

  console.log(activityFormState);
  

  return (
    <div>
      {activityFormState.map((state, index) => (
        <Box
          key={index}
          sx={{
            border: 2,
            borderColor: 'gray',
            borderRadius: 2,
            padding: 1,
            marginY: 1
          }}
        >
          <SelectField
            label="カテゴリ"
            name={`category-${index}`}
            value={state.categoryId}
            selectItems={selectItems}
            exceptValues={array.filter((_, i) => i !== index)}
            onChange={(e) => handleSelectChange(index, e.target.value)}
          />
          <RangeField
            defaultRange={{ min: 1, max: 5 }}
            label="範囲"
            name={`range-${index}`}
            value={state.problemRanges}
            min={1}
            max={categoryIdMap[state.categoryId]?.totalProblemCount ?? 512}
            onChange={(action) => handleRangeChange(index, action.value)}
          />
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleAddCategoryActivity}>
        追加
      </Button>
    </div>
  );
};

export default ActivityRangeForm;



