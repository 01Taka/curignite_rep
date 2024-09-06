import React, { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { UserLearningSessionData } from '../../../types/firebase/db/user/userStructure';
import serviceFactory from '../../../firebase/db/factory';
import { startOfWeek } from 'date-fns';
import { convertToDate } from '../../../functions/dateTimeUtils';
import { UserLearningSessionService } from '../../../firebase/db/app/user/subCollection/userLearningSessionService';
import { Card, CardContent, Tooltip, Typography } from '@mui/material';

const LearningOverview: FC = () => {
  const { uid, userData } = useAppSelector(state => state.userSlice);

  const [todaySession, setTodaySession] = useState<UserLearningSessionData | null>(null);
  const [avgTime, setAvgTime] = useState<number>(0);
  const [weekTotalTime, setWeekTotalTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateLearningSessions = async () => {
      try {
        if (uid) {
          const learningSession = serviceFactory.createUserLearningSessionService();

          const monthSessions = await learningSession.fetchRecentSessionsByDaysAgo(uid, 30);

          const weekStartDate = startOfWeek(new Date());
          const weekSessions = monthSessions.filter(session => convertToDate(session.date) >= weekStartDate);

          const today = new Date();
          const todaySessionData = monthSessions.find(session => convertToDate(session.date).getTime() === today.getTime()) || 
                                   await learningSession.fetchDailySession(uid, today);

          const averageLearningTime = UserLearningSessionService.calculateAverageLearningTime(monthSessions);
          const weeklyTotalLearningTime = UserLearningSessionService.calculateTotalLearningTime(weekSessions);

          setTodaySession(todaySessionData);
          setAvgTime(averageLearningTime);
          setWeekTotalTime(weeklyTotalLearningTime);
        }
      } catch (err) {
        console.error("Error fetching learning sessions:", err);
        setError("データの取得中にエラーが発生しました。");
      }
    };

    updateLearningSessions();
  }, [uid]);

  return (
    <Card className="max-w-lg mx-auto my-4 shadow-lg">
      <CardContent className="bg-gray-50 p-6">
        <Typography variant="h5" component="h2" className="text-blue-700 mb-4">
          学習時間情報
        </Typography>
        {error ? (
          <Typography variant="body1" className="text-red-500">
            {error}
          </Typography>
        ) : (
          <div className="space-y-3">
            <Typography variant="body1" className="text-gray-700">
              今日の合計: {todaySession ? `${todaySession.totalLearningTime}` : '0'} 分
            </Typography>
            <Typography variant="body1" className="text-gray-700">
              今週の合計: {weekTotalTime} 分
            </Typography>
            <Tooltip title="過去30日分の平均学習時間です" placement='left'>
              <Typography variant="body1" className="text-gray-700">
                平均学習時間: {avgTime} 分
              </Typography>
            </Tooltip>
            <Typography variant="body1" className="text-gray-700">
              連続学習日数: {userData?.consecutiveLearningNumber ?? 0} 日
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningOverview;
