import React, { useMemo, useState } from 'react';
import { Slider, IconButton, Box, SliderProps, SxProps } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

interface SliderWithButtonsProps {
  initialValue: number;
  minValue?: number;
  maxValue?: number;
  buttonStep?: number;
  onChange?: (value: number) => void;
  onChangeCommitted?: (value: number) => void;
  props?: SliderProps;
  sx?: SxProps;
}

const SliderWithButtons: React.FC<SliderWithButtonsProps> = ({
  initialValue,
  minValue,
  maxValue,
  buttonStep = 1,
  onChange,
  onChangeCommitted,
  props = {},
  sx,
}) => {
  // デフォルト値（SliderPropsに基づく）
  const sliderMin = props.min ?? 0;
  const sliderMax = props.max ?? 100;

  const effectiveMin = minValue ?? sliderMin;
  const effectiveMax = maxValue ?? sliderMax;

  // 初期値の調整
  const initialSliderValue = useMemo(
    () => Math.max(effectiveMin, Math.min(initialValue, effectiveMax)),
    [initialValue, effectiveMin, effectiveMax]
  );

  const [value, setValue] = useState<number>(initialSliderValue);

  // スライダー変更時のハンドラー
  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      const clampedValue = Math.max(effectiveMin, Math.min(newValue, effectiveMax));
      setValue(clampedValue);
      onChange?.(clampedValue);
    }
  };

  const handleSliderCommitted = (_: Event | React.SyntheticEvent, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      onChangeCommitted?.(newValue);
    }
  };

  // 増加・減少ボタンのハンドラー
  const handleIncrease = () => {
    setValue((prev) => {
      const newValue = Math.min(prev + buttonStep, effectiveMax);
      onChange?.(newValue);
      return newValue;
    });
  };

  const handleDecrease = () => {
    setValue((prev) => {
      const newValue = Math.max(prev - buttonStep, effectiveMin);
      onChange?.(newValue);
      return newValue;
    });
  };

  // マークの生成
  const marks = useMemo(() => {
    if (minValue !== undefined && maxValue !== undefined) {
      return [
        { value: effectiveMin, label: `${effectiveMin}` },
        { value: effectiveMax, label: `${effectiveMax}` },
      ];
    }
    return [];
  }, [minValue, maxValue, effectiveMin, effectiveMax]);

  // デフォルトのスタイル
  const defaultSx: SxProps = { display: 'flex', alignItems: 'center', gap: 1 };

  return (
    <Box sx={{ ...defaultSx, ...sx }}>
      <IconButton size="small" onClick={handleDecrease}>
        <Remove />
      </IconButton>

      <Slider
        value={value}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderCommitted}
        aria-labelledby="slider-with-buttons"
        marks={marks}
        min={effectiveMin}
        max={effectiveMax}
        sx={sx}
        {...props}
      />

      <IconButton size="small" onClick={handleIncrease}>
        <Add />
      </IconButton>
    </Box>
  );
};

export default SliderWithButtons;
