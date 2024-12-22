import { Box, Button, ButtonGroup } from '@mui/material';
import { SelectItem } from '../../../types/util/componentsTypes';
import { FormStateChangeAction } from '../../../types/app/formStateTypes';

interface QuickSelectionFieldProps<T extends string | number> {
  name: string;
  selectItems: SelectItem<T>[];
  orientation?: "horizontal" | "vertical",
  onChangeFormState: (action: FormStateChangeAction) => void;
}

const QuickSelectionField = <T extends string | number>({
  name,
  selectItems,
  orientation,
  onChangeFormState,
}: QuickSelectionFieldProps<T>) => {
  return (
    <Box
      sx={{
        display: 'flex',
        m: 1,
      }}
    >
      <ButtonGroup orientation={orientation} aria-label={name} variant="text">
        {selectItems.map((item, index) => (
          <Button key={index} onClick={() => onChangeFormState({ name, value: item })}>
            {item.label}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default QuickSelectionField;
