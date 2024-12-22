import React, { FC, useCallback, useEffect, useState, memo } from "react";
import { TextField, Slider, Box, Button, Typography, Divider, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { Range } from "../../../../types/util/componentsTypes";
import { mergeRanges } from "../../../../functions/utils/rangeUtils";
import { sortObjectArray } from "../../../../functions/utils/dataStructureUtils/objectUtils";
import { FormStateChangeAction } from "../../../../types/app/formStateTypes";

interface RangeFieldProps {
  label: string;
  name: string;
  value: Range[];
  onChange: (action: FormStateChangeAction) => void;
  fullWidth?: boolean;
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  defaultRange?: Range | null;
}

const RangeField: FC<RangeFieldProps> = ({
  label,
  name,
  value,
  onChange,
  fullWidth = false,
  min = 0,
  max = 1024,
  minLabel = '開始',
  maxLabel = '終了' ,
  defaultRange = null
}) => {
  const [ranges, setRanges] = useState<Range[]>(value);

  const updateRanges = useCallback((updatedRanges: Range[]) => {
    setRanges(updatedRanges);
    onChange({ name, value: updatedRanges });
  }, [name, onChange]);

  const handleChange = useCallback((index: number, minValue: number, maxValue: number) => {
    const newRange = { min: Math.max(min, Math.min(minValue, maxValue)), max: Math.min(max, Math.max(minValue, maxValue)) };
    const updatedRanges = ranges.map((range, i) => i === index ? newRange : range);
    updateRanges(updatedRanges);
  }, [min, max, ranges, updateRanges]);

  useEffect(() => {
    const isOutOfRange = value.some(({ min: rangeMin, max: rangeMax }) => 
      rangeMin < min || rangeMax > max
    );

    if (isOutOfRange) {
      const clampedRanges = value.map(({ min: rangeMin, max: rangeMax }) => ({
        min: Math.max(rangeMin, min),
        max: Math.min(rangeMax, max)
      }));
      updateRanges(clampedRanges);
    }
  }, [min, max, value, updateRanges]);

  const handleAddRange = useCallback((range?: Range) => {
    const lastMaxValue = (ranges[ranges.length - 1]?.max ?? min) + 1;
    const minValue = range?.min ?? lastMaxValue;
    const maxValue = range?.max ?? Math.min(lastMaxValue + Math.floor(max * 0.25), max)
    const newRange: Range = { min: minValue, max: maxValue };
    updateRanges([...ranges, newRange]);
  }, [ranges, min, max, updateRanges]);

  useEffect(() => {
    if (defaultRange && value.length === 0) {
      handleAddRange(defaultRange);
    }
  }, [defaultRange, value, handleAddRange])

  const handleRemoveRange = useCallback((index: number) => {
    const updatedRanges = ranges.filter((_, i) => i !== index);
    updateRanges(updatedRanges);
  }, [ranges, updateRanges]);

  const handleSortOut = useCallback(() => {
    const sortedRanges = sortObjectArray(mergeRanges(ranges), 'min');
    updateRanges(sortedRanges);
  }, [ranges, updateRanges]);

  return (
    <Box sx={{ p: 2, width: fullWidth ? "100%" : "auto" }}>
      <Typography variant="h6" sx={{ pb: 2 }}>{label}</Typography>
      {ranges.map((range, index) => (
        <RangeItem
          key={index}
          index={index}
          range={range}
          handleChange={handleChange}
          handleRemoveRange={handleRemoveRange}
          minLabel={minLabel}
          maxLabel={maxLabel}
          min={min}
          max={max}
          disableDelete={ranges.length === 1}
        />
      ))}
      <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
        <Button onClick={handleSortOut} variant="outlined">整理</Button>
        <Button onClick={() => handleAddRange()} variant="contained">追加</Button>
      </Box>
    </Box>
  );
};

interface RangeItemProps {
  index: number;
  range: Range;
  handleChange: (index: number, min: number, max: number) => void;
  handleRemoveRange: (index: number) => void;
  minLabel: string;
  maxLabel: string;
  min: number;
  max: number;
  disableDelete: boolean;
}

const RangeItem: FC<RangeItemProps> = memo(({
  index, range, handleChange, handleRemoveRange, minLabel, maxLabel, min, max, disableDelete
}) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <TextField
        label={`${minLabel} ${index + 1}`}
        type="number"
        value={range.min}
        onChange={(e) => handleChange(index, Number(e.target.value), range.max)}
        onBlur={() => handleChange(index, range.min, range.max)}
        size="small"
      />
      <TextField
        label={`${maxLabel} ${index + 1}`}
        type="number"
        value={range.max}
        onChange={(e) => handleChange(index, range.min, Number(e.target.value))}
        onBlur={() => handleChange(index, range.min, range.max)}
        size="small"
      />
      <IconButton onClick={() => handleRemoveRange(index)} color="error" disabled={disableDelete}>
        <DeleteIcon />
      </IconButton>
    </Box>
    <Slider
      value={[range.min, range.max]}
      onChange={(_, newValue: number | number[]) => {
        if (Array.isArray(newValue)) handleChange(index, newValue[0], newValue[1]);
      }}
      valueLabelDisplay="auto"
      min={min}
      max={max}
      sx={{ width: "100%" }}
    />
    <Divider sx={{ my: 0 }} />
  </Box>
));

export default RangeField;
