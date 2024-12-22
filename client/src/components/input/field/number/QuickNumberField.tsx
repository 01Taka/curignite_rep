import React, { useMemo } from 'react';
import { SelectItem } from '../../../../types/util/componentsTypes';
import PopupSelectField from '../../popupField/PopupSelectField';
import { Box, Button, Typography } from '@mui/material';
import useTabIndex from '../../../../features/hooks/useTabIndex';
import NumberField from './../number/NumberField';
import Popup from '../../../display/popup/Popup';
import { FormStateChangeAction } from '../../../../types/app/formStateTypes';

interface QuickNumberFieldProps {
  name: string;
  value: number;
  label: string;
  selectItems: SelectItem<number>[];
  initialValue?: number;
  min?: number;
  max?: number;
  onChangeFormState: (action: FormStateChangeAction) => void;
}

const QuickNumberField: React.FC<QuickNumberFieldProps> = ({
  name,
  value,
  label,
  selectItems,
  initialValue,
  min,
  max,
  onChangeFormState,
}) => {
  const { tabIndex, changeTab, resetTab } = useTabIndex(2, null);

  const items = useMemo(() => {
    return [{ label: 'カスタム', value: 'custom' }, ...selectItems] as SelectItem<number | 'custom'>[];
  }, [selectItems]);

  const handleSelectionChange = (selectedValue: number | 'custom' | null) => {
    if (selectedValue === 'custom') {
      changeTab(1);
      return;
    }
    if (selectedValue !== null) {
      onChangeFormState({ name, value: selectedValue });
    }
    resetTab();
  };

  return (
    <Box sx={{
      width: '100%'
    }}>
      <Button onClick={() => changeTab(0)} sx={{ width: '100%', padding: 0, margin: 0 }}>
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'rgba(0, 0, 0, 0.23)',
            borderRadius: '4px',
            padding: '5px 14px',
            color: 'rgba(0, 0, 0, 0.87)',
            fontSize: '1rem',
            lineHeight: '2.4375em',
            height: 55,
            width: '100%',
            textAlign: 'left',
            backgroundColor: 'transparent',
            position: 'relative',
            '&:hover': {
              borderColor: 'rgba(0, 0, 200, 0.87)',
            },
          }}
        >
          <Typography variant="caption" color="textSecondary" sx={{ position: 'absolute' }}>
            {label}
          </Typography>
          <Typography sx={{ position: 'absolute', top: '40%'}}>
            {value}
          </Typography>
        </Box>
      </Button>

      <Popup open={tabIndex === 1} handleClose={resetTab}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'whitesmoke',
            padding: 2,
            borderRadius: 2,
          }}
        >
        <NumberField
          name={name}
          label={label}
          value={value}
          min={min}
          max={max}
          initialValue={initialValue}
          onChangeFormState={onChangeFormState}
        />
        </Box>
      </Popup>

      <PopupSelectField
        open={tabIndex === 0}
        name={name}
        selectItems={items}
        onSelected={handleSelectionChange}
        onChangeFormState={onChangeFormState}
      />
    </Box>
  );
};

export default QuickNumberField;
