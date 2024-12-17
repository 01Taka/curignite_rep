import { Box, SxProps } from '@mui/material';
import React, { useEffect } from 'react';
import NumberCounterField from './NumberCounterField';
import { FormStateChangeEvent, FormStateChangeFunc } from '../../../../types/util/componentsTypes';
import { handleCallOnChange } from '../../../../functions/utils/formUtils';
import { seq } from '../../../../functions/utils/dataStructureUtils/arrayUtils';

interface MultipleNumberCounterFieldProps {
  counterNumber: number;
  value: (number | string)[];
  name: string;
  initialValue?: number;
  emptyValue?: '' | number;
  min?: number;
  max?: number;
  sx?: SxProps;
  onChange: FormStateChangeFunc;
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
  onChange,
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
      handleCallOnChange(newValue, name, onChange);
    }
  }, [value, counterNumber, initialValue, emptyValue, name, onChange]);

  const handleOnChange = (index: number, event: FormStateChangeEvent) => {
    const inputValue = event.target.value;
    const newData = fillMissingValues(value);
    if (index >= 0 && index < newData.length) {
      newData[index] = inputValue;
      handleCallOnChange(newData, name, onChange);
    }
  };

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
            onChange={(e) => handleOnChange(index, e)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default MultipleNumberCounterField;
