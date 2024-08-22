import React from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { LocalizationProvider, DatePicker, DatePickerProps, PickerValidDate } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ja } from 'date-fns/locale';
import { FormStateChangeEvent, FormStateChangeFunc, HTMLDateElement } from '../../../types/util/componentsTypes';
import { cn } from '../../../functions/utils';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
    },
  },
});

interface DateFieldProps extends Omit<DatePickerProps<PickerValidDate>, 'onChange'> {
  label: string;
  name: string;
  onChange: FormStateChangeFunc;
  fullWidth?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({ label, name, onChange, fullWidth = true, ...props }) => {
  const handleDateChange = (value: Date | null) => {
    const event: FormStateChangeEvent = {
      target: {
        name,
        value,
        type: 'date',
      },
    } as unknown as React.ChangeEvent<HTMLDateElement>;
    onChange(event);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
        <div className={cn("mx-auto", fullWidth && "w-full")}>
          <DatePicker
            label={label}
            {...props}
            className='w-full h-full bg-slate-200'
            onChange={handleDateChange}
          />
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DateField;
