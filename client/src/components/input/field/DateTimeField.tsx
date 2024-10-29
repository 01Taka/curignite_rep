import React from 'react';
import { DateTimePicker, DateTimePickerProps, PickerValidDate } from '@mui/x-date-pickers';
import { FormStateChangeFunc } from '../../../types/util/componentsTypes';
import { handleCallOnChange } from '../../../functions/utils/formUtils';

interface DateTimeFieldProps extends Omit<DateTimePickerProps<PickerValidDate>, 'onChange'> {
    label: string;
    name: string;
    onChange: FormStateChangeFunc;
}

const DateTimeField: React.FC<DateTimeFieldProps> = ({ label, name, onChange, ...props }) => {
  return (
    <DateTimePicker
      label={label}
      {...props}
      onChange={(value: Date | null) => handleCallOnChange(value, name, onChange)}
    />
  );
};

export default DateTimeField;
