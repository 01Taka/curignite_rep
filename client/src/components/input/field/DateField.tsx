import React from 'react';
import { DatePicker, DatePickerProps, PickerValidDate } from '@mui/x-date-pickers';
import { FormStateChangeFunc } from '../../../types/util/componentsTypes';
import { handleCallOnChange } from '../../../functions/utils/formUtils';

interface DateFieldProps extends Omit<DatePickerProps<PickerValidDate>, 'onChange'> {
  label: string;
  name: string;
  onChange: FormStateChangeFunc;
  fullWidth?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({ label, name, onChange, fullWidth = true, ...props }) => {
  return (
    <DatePicker
      label={label}
      {...props}
      onChange={(value: Date | null) => handleCallOnChange(value, name, onChange)}
    />
  );
};

export default DateField;
