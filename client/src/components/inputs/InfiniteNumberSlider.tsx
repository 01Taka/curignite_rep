import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Slider, Box, IconButton } from '@mui/material';
import { Range } from '../../types/util/componentsTypes';
import { commonStyles } from '../../styles/mui/commonStyles';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

interface InfiniteNumberSliderProps {
  initialRange: Range;
  initialValue: number;
  holdIntervalMs?: number;
  rangeStep?: number;
  buttonShiftStep?: number;
  minLimit?: number;
  maxLimit?: number;
  slideSliderSize?: number;
  onValueChange?: (value: number) => void;
  onValueCommit?: (value: number) => void;
}

const InfiniteNumberSlider: React.FC<InfiniteNumberSliderProps> = ({
  initialRange,
  initialValue,
  holdIntervalMs = 100,
  rangeStep = 1,
  buttonShiftStep = 10,
  minLimit,
  maxLimit,
  slideSliderSize = 1,
  onValueChange,
  onValueCommit,
}) => {
  const [range, setRange] = useState<Range>(initialRange);
  const [value, setValue] = useState<number>(initialValue);
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const holdDirection = useRef<'left' | 'right' | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calcSliderRange = useCallback((range: Range, direction: 'left' | 'right') => {
    const diff = (range.max - range.min) * (slideSliderSize * 0.1);
    return direction === 'left' ? range.min - diff : range.max + diff;
  }, [slideSliderSize]);

  const sliderRange = useMemo(() => ({
    min: calcSliderRange(range, 'left'),
    max: calcSliderRange(range, 'right'),
  }), [range, calcSliderRange]);

  const expandRange = useCallback((direction: 'left' | 'right') => {
    setRange(prev => {
      if (
        (minLimit !== undefined && prev.min <= minLimit && direction === 'left') ||
        (maxLimit !== undefined && prev.max >= maxLimit && direction === 'right')
      ) {
        return prev;
      }
      return direction === 'right'
        ? { min: prev.min + rangeStep, max: prev.max + rangeStep }
        : { min: prev.min - rangeStep, max: prev.max - rangeStep };
    });
  }, [rangeStep, minLimit, maxLimit]);

  const startHold = useCallback((direction: 'left' | 'right') => {
    setIsHolding(true);
    holdDirection.current = direction;
    intervalRef.current = setInterval(() => expandRange(direction), holdIntervalMs);
  }, [expandRange, holdIntervalMs]);

  const stopHold = useCallback(() => {
    setIsHolding(false);
    holdDirection.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (holdDirection.current) {
      setValue(calcSliderRange(range, holdDirection.current));
    }
  }, [range, calcSliderRange]);

  useEffect(() => {
    if (!isHolding && (value < range.min || value > range.max)) {
      setValue(prev => Math.min(Math.max(prev, range.min), range.max));
    }
  }, [isHolding, value, range]);

  useEffect(() => {
    if (minLimit !== undefined && value < minLimit) {
      setValue(minLimit);
    } else if (maxLimit !== undefined && value > maxLimit) {
      setValue(maxLimit);
    }
  }, [value, minLimit, maxLimit]);

  useEffect(() => {
    onValueChange?.(value);
  }, [value, onValueChange]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSliderChange = useCallback((_: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number' && !isHolding) {
      if (newValue === sliderRange.max) {
        startHold('right');
      } else if (newValue === sliderRange.min) {
        startHold('left');
      } else {
        setValue(newValue);
      }
    }
  }, [isHolding, sliderRange, startHold]);

  const handleSliderRelease = useCallback(() => {
    stopHold();
    setValue(prev => (prev === range.max || prev === range.min) ? prev : prev);
    onValueCommit?.(value);
  }, [range, stopHold, value, onValueCommit]);

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
    setValue(prev => prev + (direction === 'right' ? buttonShiftStep : -buttonShiftStep));
  }, [buttonShiftStep, minLimit, maxLimit]);

  const marks = useMemo(() => [
    { value: range.min, label: range.min },
    { value: range.max, label: range.max },
  ], [range]);

  return (
    <Box sx={{ ...commonStyles.flexBetween, gap: 1 }}>
      <IconButton size='small' onClick={() => shiftRange('left')} >
        <ArrowLeft />
      </IconButton>
      <Slider
        value={value}
        min={sliderRange.min}
        max={sliderRange.max}
        marks={marks}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderRelease}
        valueLabelDisplay="auto"
      />
      <IconButton size='small' onClick={() => shiftRange('right')} >
        <ArrowRight />
      </IconButton>
    </Box>
  );
};

export default InfiniteNumberSlider;
