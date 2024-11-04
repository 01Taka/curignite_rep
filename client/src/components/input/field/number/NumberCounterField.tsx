import { Box, IconButton } from '@mui/material';
import React, { useEffect, useCallback } from 'react';
import { FormStateChangeFunc } from '../../../../types/util/componentsTypes';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import useNumberFormat from '../../../../features/hooks/useNumberFormat';
import { handleCallOnChange } from '../../../../functions/utils/formUtils';

interface NumberCounterFieldProps {
  value: number | string;
  name: string;
  initialValue?: number;
  emptyValue?: '' | number;
  min?: number;
  max?: number;
  onChange: FormStateChangeFunc;
}

const NumberCounterField: React.FC<NumberCounterFieldProps> = ({
  value,
  name,
  initialValue,
  emptyValue,
  min,
  max,
  onChange,
}) => {
  const { value: formatValue, onChangeValue } = useNumberFormat({ initialValue, emptyValue, min, max });

  useEffect(() => {
    if (formatValue !== value) {
      handleCallOnChange(formatValue, name, onChange);
    }
  }, [formatValue, name, onChange, value]);

  const increment = useCallback(
    (size: number) => {
      const newValue = formatValue === '' ? Number(initialValue ?? emptyValue ?? min) + size : (formatValue as number) + size;
      onChangeValue(newValue);
    },
    [formatValue, onChangeValue, initialValue, emptyValue, min]
  );

  const isDisabled = (direction: 'up' | 'down') => {
    if (formatValue === '' || isNaN(Number(formatValue))) return true;
    if (direction === 'up') return formatValue === max;
    if (direction === 'down') return formatValue === min;
    return false;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <IconButton size="small" onClick={() => increment(1)} disabled={isDisabled('up')}>
        <KeyboardArrowUp />
      </IconButton>
      <input
        value={formatValue}
        onChange={(e) => onChangeValue(e.target.value)}
        className="w-8"
      />
      <IconButton size="small" onClick={() => increment(-1)} disabled={isDisabled('down')}>
        <KeyboardArrowDown />
      </IconButton>
    </Box>
  );
};

export default NumberCounterField;
