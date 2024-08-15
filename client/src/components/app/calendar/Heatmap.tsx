import React from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { ISODate } from '../../../types/util/dateTimeTypes';
import { BGColorClass } from '../../../types/module/tailwindTypes';
import { cn } from '../../../functions/utils';
import { isEqualDate, isMatchDay, toISODate } from '../../../functions/dateTimeUtils';

interface HeatmapProps {
  baseDate: Date;
  weeks: number;
  dateColors: Record<ISODate, BGColorClass>; // 日付がキー、Tailwindのbg-colorクラスが値
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DayHeader: React.FC = () => (
  <>
    {daysOfWeek.map((day) => (
      <div key={day} className="text-center font-bold">
        {day}
      </div>
    ))}
  </>
);

interface HeatmapCellProps {
  date: Date;
  color: BGColorClass;
  baseDate: Date;
}

const HeatmapCell: React.FC<HeatmapCellProps> = ({ date, color, baseDate }) => {
  const displayDate = isEqualDate(date, baseDate)
    ? `${format(date, 'd')}日`
    : isMatchDay(date)
    ? `${format(date, 'M')}月`
    : '';

  return (
    <div className={cn('flex items-center justify-center w-10 h-10 rounded-md', color)}>
      {displayDate}
    </div>
  );
};

const Heatmap: React.FC<HeatmapProps> = ({ baseDate, weeks, dateColors }) => {
  const weekStartDay = startOfWeek(addDays(baseDate, -weeks * 7));

  const getDayColor = (date: Date): BGColorClass => {
    const dateString = toISODate(date);
    return dateColors[dateString] || 'bg-gray-200';
  };

  const dates = Array.from({ length: weeks * 7 }, (_, i) => addDays(weekStartDay, i + 7));

  return (
    <div className="grid grid-cols-7 gap-1 w-80">
      <DayHeader />
      {dates.map((date, i) => (
        <HeatmapCell
          key={i}
          date={date}
          color={date <= baseDate ? getDayColor(date) : 'bg-transparent'}
          baseDate={baseDate}
        />
      ))}
    </div>
  );
};

export default Heatmap;
