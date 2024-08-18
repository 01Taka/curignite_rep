import React from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { LocalizationProvider, DateTimePicker, DateTimePickerProps, PickerValidDate } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FormStateChangeEvent, FormStateChangeFunc, HTMLDateElement } from '../../../types/util/componentsTypes';
import { cn } from '../../../functions/utils';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
    },
  },
});

interface DateTimeFiledProps extends Omit<DateTimePickerProps<PickerValidDate>, 'onChange'> {
    label: string;
    name: string;
    onChange: FormStateChangeFunc;
    fullWidth?: boolean;
}

const DateTimeFiled: React.FC<DateTimeFiledProps> = ({ label, name, onChange, fullWidth = true, ...props }) => {
  const handleDateTimeChange = (value: Date | null) => {
    const event: FormStateChangeEvent = {
      target: {
        name,
        value,
        type: 'datetime-local',
      },
    } as unknown as React.ChangeEvent<HTMLDateElement>;
    onChange(event);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className={cn("mx-auto", fullWidth && "w-full")}>
          <DateTimePicker
            label={label}
            {...props}
            className='w-full h-full bg-slate-200'
            onChange={handleDateTimeChange}
          />
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default DateTimeFiled;
