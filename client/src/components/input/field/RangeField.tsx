import React, { FC, useCallback, useState } from "react";
import { TextField, Slider, Box, Button, Typography, Divider, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { FormStateChangeFunc, Range } from "../../../types/util/componentsTypes";
import { mergeRanges } from "../../../functions/rangeUtils";
import { sortObjectArray } from "../../../functions/objectUtils";

interface RangeFieldProps {
  label: string;
  name: string;
  value: Range[];
  onChange: FormStateChangeFunc;
  fullWidth: boolean;
  min?: number;
  max?: number;
  minLabel: string;
  maxLabel: string;
}

const RangeField: FC<RangeFieldProps> = ({ label, name, value, onChange, fullWidth, min = 0, max = 1024, minLabel, maxLabel }) => {
  const [ranges, setRanges] = useState<Range[]>(value);

  const updateRanges = useCallback((ranges: Range[]) => {
    setRanges(ranges);
    onChange({ target: { name, value: ranges, type: "range" } } as unknown as React.ChangeEvent<HTMLInputElement>);
  }, [name, onChange]);

  const handleChange = useCallback((index: number, minValue: number, maxValue: number) => {
    const newRange = {
      min: Math.max(min, Math.min(minValue, maxValue)),
      max: Math.min(max, Math.max(minValue, maxValue))
    };
    const updatedRanges = ranges.map((range, i) => i === index ? newRange : range);
    updateRanges(updatedRanges);
  }, [ranges, updateRanges]);

  const handleAddRange = useCallback(() => {
    const lastMaxValue = (ranges[ranges.length - 1]?.max ?? min) + 1;
    const newRange: Range = { min: lastMaxValue, max: Math.min(lastMaxValue + Math.floor(max * 0.25), max) };
    const updatedRanges = [...ranges, newRange];
    updateRanges(updatedRanges);
  }, [ranges, min, max, updateRanges]);

  const handleRemoveRange = useCallback((index: number) => {
    const updatedRanges = ranges.filter((_, i) => i !== index);
    updateRanges(updatedRanges)
  }, [ranges, updateRanges]);

  const handleSortOut = useCallback(() => {
    const sortedRanges = sortObjectArray(mergeRanges(ranges), 'min');
    updateRanges(sortedRanges);
  }, [ranges, updateRanges]);

  return (
    <Box sx={{ p: 2, width: fullWidth ? "100%" : "auto" }}>
      <Typography variant="h5" sx={{ pb: 2 }}>
        {label}
      </Typography>
      {ranges.map((range, index) => (
        <Box key={index} sx={{ mb: 2 }}>
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
            <IconButton onClick={() => handleRemoveRange(index)} color="error" disabled={ranges.length === 1}>
              <DeleteIcon />
            </IconButton>
          </Box>
          <Slider
            value={[range.min, range.max]}
            onChange={(_, newValue: number | number[]) => {
              if (Array.isArray(newValue)) {
                handleChange(index, newValue[0], newValue[1]);
              }
            }}
            valueLabelDisplay="auto"
            min={min}
            max={max}
            sx={{ width: "100%" }}
          />
          <Divider sx={{ my: 0 }} />
        </Box>
      ))}
      <Box sx={{ display: "flex", justifyContent: "end", gap: 2 }}>
        <Button onClick={handleSortOut} variant="outlined">
          整理
        </Button>
        <Button onClick={handleAddRange} variant="contained">
          追加
        </Button>
      </Box>
    </Box>
  );
};

export default RangeField;
