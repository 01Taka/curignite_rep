import { FC, useEffect, useState } from "react";
import Heatmap from "../../../../../components/app/calendar/Heatmap";
import { ISODate } from "../../../../../types/util/dateTimeTypes";
import { BGColorClass } from "../../../../../types/module/tailwindTypes";
import { getLearningTimeHeatmapFromDB } from "../../../../../functions/app/calendar/calendarUtils";
import { useAppSelector } from "../../../../../redux/hooks";

const SpaceHeatmap: FC = () => {
  const [dateColors, setDateColors] = useState<Record<ISODate, BGColorClass>>({});
  const { uid } = useAppSelector(state => state.userSlice);
    
  useEffect(() => {
    const updateDateColors = async () => {
      if (uid) {
        const heatmap = await getLearningTimeHeatmapFromDB(uid);
        setDateColors(heatmap);
      }
    }
    updateDateColors();
  }, [uid])

  return (
    <div className="">
      <Heatmap
        baseDate={new Date()}
        weeks={4}
        dateColors={dateColors}
      />
    </div>
  );
};

export default SpaceHeatmap;
