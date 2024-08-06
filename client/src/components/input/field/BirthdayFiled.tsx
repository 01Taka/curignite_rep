import React from 'react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { LocalizationProvider, DatePicker, DatePickerProps, PickerValidDate } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
    },
  },
});

interface BirthdayFiledProps extends DatePickerProps<PickerValidDate> {
    label?: string;
}

const BirthdayFiled: React.FC<BirthdayFiledProps> = ({ label = "生年月日", ...props}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="p-4 max-w-sm mx-auto">
          <DatePicker
            label={label}
            {...props}
          />
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default BirthdayFiled;
