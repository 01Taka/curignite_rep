import React from 'react';
import { DateTimePicker, DateTimePickerProps, PickerValidDate } from '@mui/x-date-pickers';
import { FormStateChangeAction } from '../../../types/app/formStateTypes';

interface DateTimeFieldProps extends Omit<DateTimePickerProps<PickerValidDate>, 'onChange'> {
    label: string;
    name: string;
    onChangeFormState: (action: FormStateChangeAction) => void;
}

const DateTimeField: React.FC<DateTimeFieldProps> = ({ label, name, onChangeFormState, ...props }) => {
  return (
    <DateTimePicker
      label={label}
      {...props}
      onChange={(value: Date | null) => onChangeFormState({ name, value })}
    />
  );
};

export default DateTimeField;
