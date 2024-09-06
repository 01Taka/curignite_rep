import React, { FC, useEffect, useState } from 'react';
import serviceFactory from '../../../firebase/db/factory';
import { useAppSelector } from '../../../redux/hooks';
import { UserLearningSessionService } from '../../../firebase/db/app/user/subCollection/userLearningSessionService';
import { ISODate } from '../../../types/util/dateTimeTypes';
import Heatmap from '../../../components/app/calendar/Heatmap';
import { mapDateToColor } from '../../../functions/components/heatmapUtils';
import { HEATMAP_BY_LEARNING_TIME } from '../../../constants/components/heatmapConstants';
import { BGColorClass } from '../../../types/module/tailwindTypes';

const LearningTimeHeatmap: FC = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [colorMap, setColorMap] = useState<Record<ISODate, BGColorClass>>({});
  const [error, setError] = useState<string | null>(null); // エラーステートを追加

  useEffect(() => {
    const updateColorMap = async () => {
      if (!uid) return;
      
      try {
        const learningSession = serviceFactory.createUserLearningSessionService();
        const sessions = await learningSession.fetchRecentSessionsByDaysAgo(uid, 30, true);
        const learningTimeMap = UserLearningSessionService.mapLearningTimeByDate(sessions);
        const colorMap = mapDateToColor(learningTimeMap, HEATMAP_BY_LEARNING_TIME);
        setColorMap(colorMap);
        setError(null); // 成功したらエラーをリセット
      } catch (err) {
        console.error('Error fetching learning sessions:', err);
        setError('学習セッションの取得中にエラーが発生しました。'); // エラーメッセージを設定
      }
    };

    updateColorMap();
  }, [uid]);

  return (
    <div>
      {error ? ( // エラーがある場合に表示
        <div className="text-red-500">{error}</div>
      ) : (
        <Heatmap baseDate={new Date()} weeks={4} dateColors={colorMap} />
      )}
    </div>
  );
};

export default LearningTimeHeatmap;
