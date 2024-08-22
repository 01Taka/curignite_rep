import React, { FC, useCallback, useState } from "react";
import { TextField, Slider, Box, Button, Typography, Divider, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { FormStateChangeFunc, HTMLRangeElement, Range } from "../../../types/util/componentsTypes";

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

  const handleRangeChange = useCallback((index: number, newRange: Range) => {
    setRanges(prevRanges => {
      const updatedRanges = prevRanges.map((range, i) => (i === index ? newRange : range));
      onChange({ target: { name, value: updatedRanges, type: "range" } } as unknown as React.ChangeEvent<HTMLRangeElement>);
      return updatedRanges;
    });
  }, [name, onChange]);

  const handleRangeValueChange = useCallback((index: number, key: keyof Range, newValue: number) => {
    setRanges(prevRanges => {
      const updatedRanges = prevRanges.map((range, i) => (i === index ? { ...range, [key]: newValue } : range));
      onChange({ target: { name, value: updatedRanges, type: "range" } } as unknown as React.ChangeEvent<HTMLRangeElement>);
      return updatedRanges;
    });
  }, [name, onChange]);

  const handleAddRange = useCallback(() => {
    const lastMaxValue = ranges[ranges.length - 1]?.max ?? min;
    const newRange: Range = { min: lastMaxValue, max: Math.min(lastMaxValue + Math.floor(max * 0.25), max) };
    setRanges(prevRanges => {
      const updatedRanges = [...prevRanges, newRange];
      onChange({ target: { name, value: updatedRanges, type: "range" } } as unknown as React.ChangeEvent<HTMLRangeElement>);
      return updatedRanges;
    });
  }, [ranges, min, max, name, onChange]);

  const handleRemoveRange = useCallback((index: number) => {
    setRanges(prevRanges => {
      const updatedRanges = prevRanges.filter((_, i) => i !== index);
      onChange({ target: { name, value: updatedRanges, type: "range" } } as unknown as React.ChangeEvent<HTMLRangeElement>);
      return updatedRanges;
    });
  }, [name, onChange]);

  return (
    <Box sx={{ p: 2, width: fullWidth ? "100%" : "auto" }}>
      <Typography variant="h5" sx={{ pb: 2 }}>
        {label}
      </Typography>
      {ranges.map((range, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <TextField
              label={`${minLabel} ${index + 1}`}
              type="number"
              value={range.min}
              onChange={(e) => handleRangeValueChange(index, "min", Number(e.target.value))}
              onBlur={() => handleRangeChange(index, range)}
            />
            <TextField
              label={`${maxLabel} ${index + 1}`}
              type="number"
              value={range.max}
              onChange={(e) => handleRangeValueChange(index, "max", Number(e.target.value))}
              onBlur={() => handleRangeChange(index, range)}
            />
            <IconButton onClick={() => handleRemoveRange(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
          <Slider
            value={[range.min, range.max]}
            onChange={(_, newValue) => handleRangeChange(index, { min: (newValue as number[])[0], max: (newValue as number[])[1] })}
            valueLabelDisplay="auto"
            min={min}
            max={max}
            sx={{ width: "100%" }}
          />
          <Divider sx={{ my: 2 }} />
        </Box>
      ))}
      <Button onClick={handleAddRange} variant="contained">
        Add Range
      </Button>
    </Box>
  );
};

export default RangeField;
