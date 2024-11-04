import FullCalendar from '@fullcalendar/react';
import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import useRangeSelection from '../../../../../hooks/range/useRangeSelection';
import jaLocale from '@fullcalendar/core/locales/ja';
import { DayCellContentArg } from '@fullcalendar/core';
import { convertToMilliseconds } from '../../../../../../functions/utils/dateTimeUtils';
import { DAYS_IN_MILLISECOND } from '../../../../../../constants/utils/dateTimeConstants';
import SnackbarForRangeSelection from './SnackbarForRangeSelection';
import { Range } from '../../../../../../types/util/componentsTypes';

interface SelectDateCalendarProps {
  active: boolean;
  toActive: () => void;
  onSelectDate: (ranges: Range[]) => void;
}

const SelectDateCalendar: React.FC<SelectDateCalendarProps> = ({ active, toActive, onSelectDate }) => {
  const { state, selectedRanges, onSelectNumber, getNumberColor, onCancelSelection, onDeleteOperatingRange } = useRangeSelection();

  useEffect(() => {
    onSelectDate(selectedRanges);
  }, [selectedRanges])

  const renderEventContent = (eventInfo: any) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography>
          5p
        </Typography>
        <Typography className=' '>
          5.4h
        </Typography>
      </Box>
    );
  };

  const events = [
    { title: "会議", date: "2024-11-03", allDay: true },
    { title: "プロジェクト締め切り", date: "2024-11-04" },
  ];

  const handleSelectNumber = (num: number) => {
    onSelectNumber(num);
    toActive();
  }

  useEffect(() => {
    if (!active && state !== 'idle') {
      onCancelSelection();
    }
  }, [active])

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
};


export default SelectDateCalendar;