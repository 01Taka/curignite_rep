import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../../../redux/hooks';
import { Typography } from '@mui/material';
import CountUpRelativeTime from './CountUpRelativeTime';
import serviceFactory from '../../../../../firebase/db/factory';

interface LearningSummaryProps {}

const LearningSummary: React.FC<LearningSummaryProps> = () => {
  const [monthlyAverage, setMonthlyAverage] = useState<number>(0);
  const [weeklyTotal, setWeeklyTotal] = useState<number>(0);
  const [todayTotal, setTodayTotal] = useState<number>(0);
  const { uid } = useAppSelector(state => state.userSlice);
  const { learningTime } = useAppSelector(state => state.learningSessionSlice);
  const { currentSpaceId, todayTotalLearningTime } = useAppSelector(state => state.spaceSlice)

  useEffect(() => {
    const fetchLearnData = async () => {
      if (uid) {
        const logService = serviceFactory.createUserDailyLogService();
        const monthlyAvg = await logService.getRecentDaysAvg(uid);
        const weeklySum = await logService.getWeeklyTotalLearningTime(uid);
  
        setMonthlyAverage(monthlyAvg);
        setWeeklyTotal(weeklySum); 
      }
    };
    fetchLearnData();
  }, [uid]);

  useEffect(() => {
    if (uid && currentSpaceId) {
      const total = learningTime + todayTotalLearningTime;
      setTodayTotal(total);
    }
  }, [uid, currentSpaceId, todayTotalLearningTime, learningTime])

  return (
    <div>
      <Typography variant='h4'>学習の成績</Typography>
      <SummaryItem label="30日の平均" time={monthlyAverage} />
      <SummaryItem label="今週の合計" time={weeklyTotal} />
      <SummaryItem label="今日の学習時間" time={todayTotal} />
    </div>
  );
};

interface SummaryItemProps {
  label: string;
  time: number;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ label, time }) => (
  <div className="my-3">
    <Typography variant='h5'>・{label}</Typography>
    <div className='ml-8'>
      <Typography variant='h5'>
        <CountUpRelativeTime time={time} />
      </Typography>
    </div>
  </div>
);

export default LearningSummary;
