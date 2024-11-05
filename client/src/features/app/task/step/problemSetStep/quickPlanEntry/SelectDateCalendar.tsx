import FullCalendar from '@fullcalendar/react';
import { Box, Typography } from '@mui/material';
import React, { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import useRangeSelection from '../../../../../hooks/range/useRangeSelection';
import jaLocale from '@fullcalendar/core/locales/ja';
import { DayCellContentArg, EventContentArg } from '@fullcalendar/core';
import { convertToMilliseconds } from '../../../../../../functions/utils/dateTimeUtils';
import { DAYS_IN_MILLISECOND } from '../../../../../../constants/utils/dateTimeConstants';
import SnackbarForRangeSelection from './SnackbarForRangeSelection';
import { Range } from '../../../../../../types/util/componentsTypes';
import { ProblemsWithDate, SelectDateCalendarRef } from '../problemSetStepTypes';

interface SelectDateCalendarProps {
  problemsWithDate: ProblemsWithDate[];
  onSelectDate: (ranges: Range[]) => void;
  onSelectDateNumber: (num: number) => void;
}

const SelectDateCalendar = forwardRef<SelectDateCalendarRef, SelectDateCalendarProps>(({ problemsWithDate, onSelectDate, onSelectDateNumber }, ref) => {
  const {
    state,
    selectedRanges,
    onSelectNumber,
    getNumberColor,
    onCancelSelection,
    onDeleteOperatingRange,
    deleteAllSelection
  } = useRangeSelection();

  useImperativeHandle(ref, () => ({
    onCancelSelection() {
      onCancelSelection();
    },
    deleteAllSelection() {
      deleteAllSelection();
    }
  }));

  useEffect(() => {
    onSelectDate(selectedRanges);
  }, [selectedRanges])

  const renderEventContent = (eventInfo: EventContentArg) => {
    const problems = eventInfo.event.extendedProps['problems'];

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mx: 'auto' }}>
        <button>
          <Typography sx={{ width: 24, height: 24, bgcolor: 'violet', borderRadius: 999, textAlign: 'center' }}>
            {problems.length}
          </Typography>
        </button>
      </Box>
    );
  };

  const events = useMemo(() => {
    return problemsWithDate.map(date => ({ date: date.date, problems: date.problems }));
  }, [problemsWithDate])

  const handleSelectNumber = (num: number) => {
    onSelectNumber(num);
    onSelectDateNumber(num);
  }

  const getDateNumber = (arg: DayCellContentArg) => {
    const date = arg.date;
    return Math.floor(convertToMilliseconds(date) / DAYS_IN_MILLISECOND)
  }

  return (
    <Box>
      <FullCalendar
        height='auto'
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale={jaLocale}
        firstDay={1}
        headerToolbar={false}
        events={events}
        eventContent={renderEventContent} // イベントのカスタム内容
        dayCellContent={(arg) => {
          const date = arg.date.getDate();
          const dateNumber = getDateNumber(arg);
          return (
            <button onClick={() => handleSelectNumber(dateNumber)}>
              <Box sx={{ width: 24, height: 24, bgcolor: getNumberColor(dateNumber), borderRadius: 1 }}>
                {date.toString()}
              </Box>
            </button>
          )
        }}
      />
      <SnackbarForRangeSelection
        categoryName={'取り組み日'}
        state={state}
        onCancelSelection={onCancelSelection}
        onDeleteOperatingRange={onDeleteOperatingRange}
      />
    </Box>
  );
});


export default SelectDateCalendar;