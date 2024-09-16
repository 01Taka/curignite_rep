import React from 'react';
import { Box, Button, ButtonGroup } from '@mui/material';
import { BaseHTMLElement, FormStateChangeEvent, FormStateChangeFunc, SelectItem } from '../../../types/util/componentsTypes';

interface QuickSelectionFieldProps<T extends string | number> {
  name: string;
  selectItems: SelectItem<T>[];
  orientation?: "horizontal" | "vertical",
  onChange: FormStateChangeFunc;
}

const QuickSelectionField = <T extends string | number>({
  name,
  selectItems,
  orientation,
  onChange,
}: QuickSelectionFieldProps<T>) => {
  const handleChange = (value: T) => {
    const event: FormStateChangeEvent = {
      target: {
        name,
        value,
        type: 'unknown',
      },
    } as unknown as React.ChangeEvent<BaseHTMLElement<T, "unknown">>;
    onChange(event);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        m: 1,
      }}
    >
      <ButtonGroup orientation={orientation} aria-label={name} variant="text">
        {selectItems.map((item, index) => (
          <Button key={index} onClick={() => handleChange(item.value)}>
            {item.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default QuickSelectionField;
