import React from 'react';
import { DatePicker, DatePickerProps, PickerValidDate } from '@mui/x-date-pickers';
import { FormStateChangeAction } from '../../../types/app/formStateTypes';

interface DateFieldProps extends Omit<DatePickerProps<PickerValidDate>, 'onChange'> {
  label: string;
  name: string;
  onChangeFormState: (action: FormStateChangeAction) => void;
  fullWidth?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({ label, name, onChangeFormState, fullWidth = true, ...props }) => {
  return (
    <DatePicker
      label={label}
      {...props}
      onChange={(value: Date | null) => onChangeFormState({ name, value })}
    />
  );
};

export default DateField;
