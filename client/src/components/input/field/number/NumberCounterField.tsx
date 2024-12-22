import { Box, IconButton } from '@mui/material';
import React, { useEffect, useCallback } from 'react';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import useNumberFormat from '../../../../features/hooks/useNumberFormat';
import { FormStateChangeAction } from '../../../../types/app/formStateTypes';

interface NumberCounterFieldProps {
  value: number | string;
  name: string;
  initialValue?: number;
  emptyValue?: '' | number;
  min?: number;
  max?: number;
  onChangeFormState: (action: FormStateChangeAction) => void;
}

const NumberCounterField: React.FC<NumberCounterFieldProps> = ({
  value,
  name,
  initialValue,
  emptyValue,
  min,
  max,
  onChangeFormState,
}) => {
  const { value: formatValue, onChangeValue } = useNumberFormat({ initialValue, emptyValue, min, max });

  useEffect(() => {
    if (formatValue !== value) {
      onChangeFormState({ name, value: formatValue });
    }
  }, [formatValue, name, onChangeFormState, value]);

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
