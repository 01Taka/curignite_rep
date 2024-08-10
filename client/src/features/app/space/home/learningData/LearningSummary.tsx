import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../../../redux/hooks';
import { Typography } from '@mui/material';
import CountUpRelativeTime from './CountUpRelativeTime';
import { MINUTES_IN_MILLISECOND } from '../../../../../types/util/dateTimeTypes';

interface LearningSummaryProps {}

const LearningSummary: React.FC<LearningSummaryProps> = () => {
  const [monthlyAverage, setMonthlyAverage] = useState<number>(0);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const { uid } = useAppSelector(state => state.userSlice);
  const { todayTotalLearningMinutes } = useAppSelector(state => state.spaceSlice);
  console.log(todayTotalLearningMinutes);
  

  useEffect(() => {
    const fetchLearnData = async () => {
      const monthlyAvg = 10000000000; //await getMonthlyAverageLearnTime(uid);
      const weeklySum = 10000000000; //await getWeeklyTotalLearnTime(uid);

      setMonthlyAverage(monthlyAvg);
      setWeeklyTotal(weeklySum);
    };

    fetchLearnData();
  }, [uid]);

  return (
    <div>
      <Typography variant='h4'>学習の成績</Typography>
      <SummaryItem label="今月の平均" time={monthlyAverage} />
      <SummaryItem label="今週の合計" time={weeklyTotal} />
      <SummaryItem label="今日の学習時間" time={todayTotalLearningMinutes * MINUTES_IN_MILLISECOND} />
    </div>
  );
};

interface SummaryItemProps {
  label: string;
  time: number;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, time }) => (
  <div className="">
    <Typography variant='h6'>・{label}</Typography>
    <div className='ml-6'>
      <Typography variant='h6'>
        <CountUpRelativeTime time={time} />
      </Typography>
    </div>
  </div>
);

export default LearningSummary;
