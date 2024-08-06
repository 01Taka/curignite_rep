import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import jaLocale from '@fullcalendar/core/locales/ja';
import { DayCellContentArg } from '@fullcalendar/core';
import { ISODate } from '../../../types/util/dateTimeTypes';
import { CalendarEvent, SpecialDays } from '../../../types/app/calendarTypes';

interface CalendarProps {
  events?: CalendarEvent[];
  specialDays?: SpecialDays;
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: ISODate) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, specialDays, onEventClick, onDateClick }) => {
  const handleDayCellDidMount = (info: DayCellContentArg) => {
    if (!specialDays) {
      return;
    }

    const dateStr = info.date.toISOString().split('T')[0] as ISODate;
    const dayProps = specialDays[dateStr];

    if (dayProps) {
      if (dayProps.backgroundColor) {
        info.el.style.backgroundColor = dayProps.backgroundColor;
      }
      if (dayProps.color) {
        info.el.style.backgroundColor = dayProps.color;
      }
      if (dayProps.textColor) {
        info.el.style.color = dayProps.textColor;
      }
      if (dayProps.borderColor) {
        info.el.style.borderColor = dayProps.borderColor;
      }
      if (dayProps.tooltip) {
        info.el.setAttribute('title', dayProps.tooltip);
      }
    }
  };

  const handleEventClick = (arg: any) => {
    if (events && onEventClick) {
      const clickedEvent = events.find(event => event.id === arg.event.id);
      if (clickedEvent) {
        onEventClick(clickedEvent);
      }
    }
  };

  const handleDateClick = (arg: any) => {
    if (onDateClick) {
      onDateClick(arg.dateStr);
    }
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        dayCellDidMount={handleDayCellDidMount}
        locales={[jaLocale]}
        locale="ja"
      />
    </div>
  );
};

export default Calendar;
