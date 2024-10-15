import React, { FC, useEffect, useState } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import serviceFactory from '../../../firebase/db/factory';
import { startOfWeek } from 'date-fns';
import { convertToDate } from '../../../functions/dateTimeUtils';
import { Card, CardContent, Tooltip, Typography } from '@mui/material';
import { MINUTES_IN_MILLISECOND } from '../../../constants/utils/dateTimeConstants';
import { UserDailyLearningSummaryData } from '../../../types/firebase/db/user/userStructure';
import { UserDailyLearningSummaryService } from '../../../firebase/db/app/user/subCollection/userDailyLearningSummary';

const LearningOverview: FC = () => {
  const { uid, userData } = useAppSelector(state => state.userSlice);

  const [todaySession, setTodaySession] = useState<UserDailyLearningSummaryData | null>(null);
  const [avgTime, setAvgTime] = useState<number>(0);
  const [weekTotalTime, setWeekTotalTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateLearningSessions = async () => {
      try {
        if (uid) {
          const learningSession = serviceFactory.createUserDailyLearningSummary();

          const monthSessions = await learningSession.fetchRecentSummariesByDaysAgo(uid, 30);
          const weekStartDate = startOfWeek(new Date());
          const weekSessions = monthSessions.filter(session => convertToDate(session.date) >= weekStartDate);

          const today = new Date();
          const todaySessionData = monthSessions.find(session => convertToDate(session.date).getTime() === today.getTime()) || 
                                   await learningSession.getSummaryByDate(uid, today);

          const averageLearningTime = UserDailyLearningSummaryService.calculateAverageLearningTime(monthSessions, "length");
          const weeklyTotalLearningTime = UserDailyLearningSummaryService.calculateTotalLearningTime(weekSessions);

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

  // ミリ秒を時間と分に変換
  const formatEstimatedDuration = (durationInMs: number) => {
    const totalMinutes = durationInMs / MINUTES_IN_MILLISECOND;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours ? `${hours}時間 ` : ''}${minutes}分`;
  };

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
              今日の合計: {todaySession ? formatEstimatedDuration(todaySession.totalLearningTime) : '0分'}
            </Typography>
            <Typography variant="body1" className="text-gray-700">
              今週の合計: {formatEstimatedDuration(weekTotalTime)}
            </Typography>
            <Tooltip title="過去30日のうち学習した日の平均学習時間" placement='left'>
              <Typography variant="body1" className="text-gray-700">
                平均学習時間: {formatEstimatedDuration(avgTime)}
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
