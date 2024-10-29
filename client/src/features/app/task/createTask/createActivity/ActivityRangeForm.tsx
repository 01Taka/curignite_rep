import React, { useMemo, useCallback } from 'react';
import { CategoryActivityFormState, CreateActivityFormState } from './createActivityTypes';
import { ProblemSetActivityManagementMethod, ProblemSetCategoryData } from '../../../../../types/firebase/db/task/taskStructure';
import { Box, Button } from '@mui/material';
import RangeField from '../../../../../components/input/field/RangeField';
import SelectField from '../../../../../components/input/field/SelectField';
import { Range, SelectItem } from '../../../../../types/util/componentsTypes';
import { UpdateArrayFieldArgs } from '../../../../hooks/form/AsyncHandlerTypes';
import useArrayState from '../../../../hooks/form/useArrayState';
import { objectArrayToDict } from '../../../../../functions/utils/objectUtils';

interface ActivityRangeFormProps {
  managementMethod: ProblemSetActivityManagementMethod;
  formState: CategoryActivityFormState[];
  categories: ProblemSetCategoryData[];
  updateArrayField: (args: UpdateArrayFieldArgs<CreateActivityFormState, any>) => void;
}

const ActivityRangeForm: React.FC<ActivityRangeFormProps> = ({ managementMethod, formState, categories, updateArrayField }) => {
  // 未選択のカテゴリをフィルタリングして項目リストを生成
  const selectItems: SelectItem<string>[] = useMemo(() => {
    return categories.map(category => ({ label: category.name, value: category.docId }));
  }, [categories]);

  const categoryIdMap = useMemo(() => {
    return objectArrayToDict(categories, 'docId');
  }, [categories]);

  const { array, push, update } = useArrayState<string>();

  // カテゴリ選択の変更ハンドラ
  const handleSelectChange = useCallback(
    (index: number, categoryId: string) => {
      updateArrayField({
        fieldName: 'categoryActivities',
        index,
        data: { ...formState[index], categoryId },
      });
      update(index, categoryId);
    },
    [updateArrayField, update, formState]
  );

  // 範囲選択の変更ハンドラ
  const handleRangeChange = useCallback(
    (index: number, problemRanges: Range[]) => {
      updateArrayField({
        fieldName: 'categoryActivities',
        index,
        data: { ...formState[index], problemRanges },
      });
    },
    [updateArrayField, formState]
  );

  // 新しいカテゴリアクティビティを追加
  const handleAddCategoryActivity = useCallback(() => {
    updateArrayField({
      fieldName: 'categoryActivities',
      index: 'push',
      data: { categoryId: '', problemRanges: [] } as CategoryActivityFormState,
    });
    push('');
  }, [updateArrayField, push]);

  return (
    <div>
      {formState.map((state, index) => (
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
            onChange={(event) => handleSelectChange(index, event.target.value as string)}
          />
          <RangeField
            defaultRange={{ min: 1, max: 5 }}
            label="範囲"
            name={`range-${index}`}
            value={state.problemRanges}
            min={1}
            max={categoryIdMap[state.categoryId]?.totalProblemNumber ?? 512}
            onChange={(event) => handleRangeChange(index, event.target.value as Range[])}
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
