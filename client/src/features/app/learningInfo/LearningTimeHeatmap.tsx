import React, { FC, useEffect, useState } from 'react'
import serviceFactory from '../../../firebase/db/factory'
import { useAppSelector } from '../../../redux/hooks'
import { UserLearningSessionService } from '../../../firebase/db/app/user/subCollection/userLearningSessionService';
import { ISODate } from '../../../types/util/dateTimeTypes';
import Heatmap from '../../../components/app/calendar/Heatmap';
import { mapDateToColor } from '../../../functions/components/heatmapUtils';
import { HEATMAP_BY_LEARNING_TIME } from '../../../constants/components/heatmapConstants';
import { BGColorClass } from '../../../types/module/tailwindTypes';

const LearningTimeHeatmap: FC = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [colorMap, setColorMap] = useState<Record<ISODate, BGColorClass>>({});

  useEffect(() => {
    const updateColorMap = async () => {
      if (uid) {
        const learningSession = serviceFactory.createUserLearningSessionService();
        const sessions = await learningSession.fetchRecentSessionsByDaysAgo(uid, 30, true);
        const learningTimeMap = UserLearningSessionService.mapLearningTimeByDate(sessions);
        const colorMap = mapDateToColor(learningTimeMap, HEATMAP_BY_LEARNING_TIME);
        setColorMap(colorMap);
      }
    }
    updateColorMap();
  }, [uid])

  return (
    <div>
      <Heatmap
      baseDate={new Date()}
      weeks={4}
      dateColors={colorMap}
      />
    </div>
  )
}

export default LearningTimeHeatmap