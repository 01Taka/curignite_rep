import React, { useRef, useState } from 'react';
import { TaskData } from '../../../../../../types/firebase/db/task/taskExpansionTypes';
import { Box, Button, FormControlLabel, Switch } from '@mui/material';
import { ProblemContainerRef, SelectDateCalendarRef } from '../problemSetStepTypes';
import QuickPlanEntryContainer from './QuickPlanEntryContainer';
import SelectDateCalendar from './SelectDateCalendar';
import MultipleNumberCounterField from '../../../../../../components/input/field/number/MultipleNumberCounterField';
import { MotionBox } from '../../../../../../components/animation/MotionComponents';
import SettingStateDisplay from './SettingStateDisplay';
import { usePlanEntry } from '../hooks/usePlanEntry';
import useLog from '../../../../../hooks/common/useLog';
import useMultipleRefs from '../../../../../hooks/useMultipleRefs';
import { ProblemSetCategoryRead } from '../../../../../../types/firebase/db/task/taskStructure';

interface QuickPlanEntryProps {
  taskData: TaskData;
  categoryMap: Record<string, ProblemSetCategoryRead>;
}

const QuickPlanEntry: React.FC<QuickPlanEntryProps> = ({ taskData, categoryMap }) => {
  const {
    problemsWithDate,
    currentProblems,
    currentDates,
    useAutoSettingRatio,
    distributionRatio,
    entries,
    handleSelectProblems,
    handleSelectDates,
    setDistributionRatio,
    setUseAutoSettingRatio,
    getGroupedProblems,
    handleEntryCurrent
  } = usePlanEntry(taskData);

  const activityField = taskData?.problemSetActivityField;
  const groupedProblems = activityField ? getGroupedProblems(activityField) : [];

  const planEntryRefs = useMultipleRefs<ProblemContainerRef>(groupedProblems.length);
  const calenderRef = useRef<SelectDateCalendarRef>(null);

  const handleCancelSelection = (exceptIndex: number) => {
    planEntryRefs.map((ref, i) => {
      if (ref && ref.current && i !== exceptIndex) {
        ref.current.onCancelSelection();
      }
    })
    if (calenderRef && calenderRef.current && exceptIndex !== -1) {
      calenderRef.current.onCancelSelection();
    }
  };

  const handleDeleteAllSelection = () => {
    planEntryRefs.map(ref => {
      if (ref && ref.current) {
        ref.current.deleteAllSelection();
      }
    })
    if (calenderRef && calenderRef.current) {
      calenderRef.current.deleteAllSelection();
    }
  };

  useLog(entries);

  const handleEnter = () => {
    handleEntryCurrent();
    handleDeleteAllSelection();
  }

  return (
    <Box>
      <Button variant='contained' onClick={handleEnter}>
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
            ref={planEntryRefs[index]}
            key={index}
            problemGroup={data}
            onSelectProblemNumber={() => handleCancelSelection(index)}
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
          initialValue={5}
          emptyValue={0}
          min={0}
          max={30}
          onChangeFormState={() => {}}
          counterNumber={7}
        />
      </MotionBox>
      <SelectDateCalendar
        ref={calenderRef}
        problemsWithDate={problemsWithDate}
        onSelectDate={handleSelectDates}
        onSelectDateNumber={() => handleCancelSelection(-1)}
      />
      <Box height={200} />
    </Box>
  );
};

export default QuickPlanEntry;
