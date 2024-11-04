import React, { useCallback, useMemo, useState } from 'react';
import { CategoryActivityStatus, ProblemSetActivityField, TaskData } from '../../../../../../types/firebase/db/task/taskExpansionTypes';
import { groupingByKey, objectArrayToDict, removeDuplicates, removeNullAndUndefined } from '../../../../../../functions/utils/objectUtils';
import { Box, Button, FormControlLabel, Switch } from '@mui/material';
import { rangesToArray } from '../../../../../../functions/utils/rangeUtils';
import { ProblemGroup } from '../problemSetStepTypes';
import QuickPlanEntryContainer from './QuickPlanEntryContainer';
import SelectDateCalendar from './SelectDateCalendar';
import { Range } from '../../../../../../types/util/componentsTypes';
import { DAYS_IN_MILLISECOND } from '../../../../../../constants/utils/dateTimeConstants';
import { convertToDate } from '../../../../../../functions/utils/dateTimeUtils';
import MultipleNumberCounterField from '../../../../../../components/input/field/number/MultipleNumberCounterField';
import { MotionBox } from '../../../../../../components/animation/MotionComponents';
import SettingStateDisplay from './SettingStateDisplay';

interface QuickPlanEntryProps {
  taskData: TaskData | null;
}

const QuickPlanEntry: React.FC<QuickPlanEntryProps> = ({ taskData }) => {
  const [activeTarget, setActiveTarget] = useState<`task-${string}` | 'calender' | null>(null);
  const [currentProblems, setCurrentProblems] = useState<Record<string, number[]>>({});
  const [currentDates, setCurrentDates] = useState<Date[]>([]);
  const [distributionRatio, setDistributionRatio] = useState<number[]>([]);
  const [useAutoSettingRatio, setUseAutoSettingRatio] = useState<boolean>(true);

  const categoryMap = useMemo(() => {
    if (taskData && taskData.problemSetActivityField) {
      const categories = taskData.problemSetActivityField.activityStatus.map(state => state.category);
      return objectArrayToDict(categories, 'docId');
    }
    return {};
  }, [taskData])

  const handleSelectProblems = useCallback((id: string, numbers: number[]) => {
    setCurrentProblems(prev => ({
      ...prev,
      [id]: numbers
    }));
  }, []);

  const handleSelectDates = useCallback((ranges: Range[]) => {
    const dateNumber = rangesToArray(ranges, true);
    const dates = dateNumber.map(num => convertToDate((num + 1) * DAYS_IN_MILLISECOND));
    setCurrentDates(dates);
  }, []);

  const activityField = taskData?.problemSetActivityField;
  if (!activityField) {
    console.error("problemSetActivityFieldは必須です");
    return null;
  }
  const groupedProblems = getGroupedProblems(activityField);
  
  return (
    <Box>
      <Button variant='contained'>
        決定
      </Button>
      <SettingStateDisplay
        categoryMap={categoryMap}
        problems={currentProblems}
        dates={currentDates}
        distributionRatio={useAutoSettingRatio ? distributionRatio : 'fillWithOne'}
      />
      <Box>
        {groupedProblems.map((data, index) => (
          <QuickPlanEntryContainer
            key={index}
            problemGroup={data}
            active={activeTarget === `task-${data.categoryName}`}
            toActivate={() => setActiveTarget(`task-${data.categoryName}`)}
            onSelectProblems={handleSelectProblems}
          />
        ))}
      </Box>
      <FormControlLabel
        value={useAutoSettingRatio}
        onChange={() => setUseAutoSettingRatio(prev => !prev)}
        control={<Switch defaultChecked />}
        label="比率の設定"
      />
      <MotionBox
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: useAutoSettingRatio ? 'auto' : 0, opacity: useAutoSettingRatio ? 1 : 0 }}
        transition={{ height: { duration: 0.2 }, opacity: { duration: 0.1 } }}
        style={{
          overflow: 'hidden',
          backgroundColor: '#f0f0f0',
      }}>
        <MultipleNumberCounterField
          value={distributionRatio}
          name='distributionRatio'
          initialValue={1}
          emptyValue={0}
          min={0}
          max={30}
          onChange={(e) => setDistributionRatio(e.target.value)}
          counterNumber={7}
        />
      </MotionBox>
      <SelectDateCalendar
        active={activeTarget === 'calender'}
        toActive={() => setActiveTarget('calender')}
        onSelectDate={handleSelectDates}
      />
      <Box height={200} />
    </Box>
  );
};

// Helper function to group problems by category and remove duplicates/nulls
const getGroupedProblems = (activityField: ProblemSetActivityField): ProblemGroup[] => {
  const getProblemNumbersFromStatus = (status: CategoryActivityStatus[]) => {
    return removeDuplicates(
      status.flatMap((data) => rangesToArray(data.problemIdsRange, true))
    );
  }

  if (activityField.activityManagementMethod === 'page') {
    return [{
      id: activityField.activityStatus[0].categoryId,
      categoryName: 'ページ',
      problemNumbers: getProblemNumbersFromStatus(activityField.activityStatus)
    }]
  }

  const statusGroupedByCategory = Object.values(groupingByKey(activityField.activityStatus, 'categoryId'));

  return removeNullAndUndefined(
    statusGroupedByCategory.map((status) => {
      if (status.length === 0) return null;

      const problemNumbers = getProblemNumbersFromStatus(status);
      return {
        id: status[0].categoryId,
        categoryName: status[0].category.name,
        problemNumbers,
      };
    })
  );
};

export default QuickPlanEntry;
