import { Box, SxProps } from '@mui/material';
import React, { useEffect } from 'react';
import NumberCounterField from './NumberCounterField';
import { seq } from '../../../../functions/utils/dataStructureUtils/arrayUtils';
import { FormStateChangeAction } from '../../../../types/app/formStateTypes';

interface MultipleNumberCounterFieldProps {
  counterNumber: number;
  value: (number | string)[];
  name: string;
  initialValue?: number;
  emptyValue?: '' | number;
  min?: number;
  max?: number;
  sx?: SxProps;
  onChangeFormState: (action: FormStateChangeAction) => void;
}

const MultipleNumberCounterField: React.FC<MultipleNumberCounterFieldProps> = ({
  counterNumber,
  value,
  name,
  initialValue,
  emptyValue = NaN,
  min,
  max,
  sx,
  onChangeFormState,
}) => {

  const fillMissingValues = (values: (number | string)[]) => {
    const missingNumber = counterNumber - values.length;
    return values.length < counterNumber
      ? [...values, ...seq(missingNumber).map(() => initialValue ?? emptyValue)]
      : values.slice(0, counterNumber);;
  };

  useEffect(() => {
    const newValue = fillMissingValues(value);
    if (JSON.stringify(newValue) !== JSON.stringify(value)) {
      onChangeFormState({ name, value: newValue });
    }
  }, [value, counterNumber, initialValue, emptyValue, name, onChangeFormState]);

  return (
    <Box sx={{ display: 'flex', ...sx }}>
      {fillMissingValues(value).map((data, index) => (
        <Box key={index} flexGrow={1}>
          <NumberCounterField
            value={data}
            name={`${name}-${index}`}
            initialValue={initialValue}
            emptyValue={emptyValue}
            min={min}
            max={max}
            onChangeFormState={onChangeFormState}
          />
        </Box>
      ))}
    </Box>
  );
};

export default MultipleNumberCounterField;
