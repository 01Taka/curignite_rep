import React, { useState, useMemo, useCallback } from 'react';
import { Slider, Box, IconButton } from '@mui/material';
import { Range } from '../../types/util/componentsTypes';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { commonStyles } from '../../styles/mui/commonStyles';

interface FlexRangeSliderProps {
  initialRange: Range;
  initialValue: number;
  buttonShiftStep?: number;
  minLimit?: number;
  maxLimit?: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
}

const FlexRangeSlider: React.FC<FlexRangeSliderProps> = ({
  initialRange,
  initialValue,
  buttonShiftStep = 10,
  minLimit,
  maxLimit,
  onValueChange,
  onValueCommit,
}) => {
  const [range, setRange] = useState<Range>(initialRange);
  const [value, setValue] = useState<number>(initialValue);

  const shiftRange = useCallback((direction: 'left' | 'right') => {
    setRange(prev => {
      if (
        (minLimit !== undefined && prev.min <= minLimit && direction === 'left') ||
        (maxLimit !== undefined && prev.max >= maxLimit && direction === 'right')
      ) {
        return prev;
      }
      return direction === 'right'
        ? { min: prev.min + buttonShiftStep, max: prev.max + buttonShiftStep }
        : { min: prev.min - buttonShiftStep, max: prev.max - buttonShiftStep };
    });

    const getNewValue = (prev: number) => {
      const newValue = prev + (direction === 'right' ? buttonShiftStep : -buttonShiftStep);
      if (minLimit !== undefined && newValue < minLimit) return minLimit;
      if (maxLimit !== undefined && newValue > maxLimit) return maxLimit;
      return newValue;
    }

    setValue(prev => {
      const newValue = getNewValue(prev);
      onValueChange?.(newValue);
      onValueCommit?.(newValue);
      return newValue;
    });
  }, [buttonShiftStep, minLimit, maxLimit, onValueChange, onValueCommit]);

  const marks = useMemo(() => [
    { value: range.min, label: range.min },
    { value: range.max, label: range.max },
  ], [range]);

  const handleSliderChange = useCallback((event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setValue(newValue);
      onValueChange?.(newValue);
    }
  }, [onValueChange]);

  const handleSliderCommit = useCallback(() => {
    onValueCommit?.(value);
  }, [value, onValueCommit]);

  return (
    <Box sx={{ ...commonStyles.flexBetween, gap: 1 }}>
      <IconButton size='small' onClick={() => shiftRange('left')} >
        <ArrowLeft />
      </IconButton>
      <Slider
          value={value}
          min={range.min}
          max={range.max}
          marks={marks}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderCommit}
          valueLabelDisplay="auto"
        />
      <IconButton size='small' onClick={() => shiftRange('right')} >
        <ArrowRight />
      </IconButton>
    </Box>
  );
};

export default FlexRangeSlider;
