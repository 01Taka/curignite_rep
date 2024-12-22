import { Box, SxProps } from '@mui/material';
import React from 'react';
import QuickNumberField from '../../../../../components/input/field/number/QuickNumberField';
import { createNumberSelectItems } from '../../../../../functions/utils/formUtils';
import { FormStateChangeAction } from '../../../../../types/app/formStateTypes';

interface TimeAndProblemCountFieldProps {
  time: number;
  problemCount: number;
  timeFormLabel: string;
  problemCountFormLabel: string;
  problemCountUnit: string;
  boxSx: SxProps;
  onTimeChange: (action: FormStateChangeAction) => void;
  onProblemCountChange: (action: FormStateChangeAction) => void;
}

const TimeAndProblemCountField: React.FC<TimeAndProblemCountFieldProps> = ({
  time,
  problemCount,
  timeFormLabel,
  problemCountFormLabel,
  problemCountUnit,
  boxSx,
  onTimeChange,
  onProblemCountChange,
}) => {
  return (
    <Box sx={boxSx}>
      <QuickNumberField
        name="timePerProblem"
        label={timeFormLabel}
        value={time}
        selectItems={createNumberSelectItems(5, 181, 5, 1, '分')}
        onChangeFormState={onTimeChange}
      />
      <QuickNumberField
        name="totalProblemCount"
        label={problemCountFormLabel}
        value={problemCount}
        selectItems={createNumberSelectItems(10, 501, 10, 1, problemCountUnit)}
        onChangeFormState={onProblemCountChange}
      />
    </Box>
  );
};

export default TimeAndProblemCountField;