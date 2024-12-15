import { Box, Button, Typography } from "@mui/material";
import { splitMillisWithFormat } from "../../../functions/utils/timeFormatUtils";
import { UserStudyProfile } from "./shared/types/profileTypes";
import { commonStyles } from "../../../styles/mui/commonStyles";
import useToggle from "../../hooks/useToggle";

const StudyProfileDisplay: React.FC<{ userStudyProfile: UserStudyProfile }> = ({
  userStudyProfile,
}) => {
  const { isOpen, toOpen } = useToggle({ initialOpenIds: ["1"] });

  const timeFormat = (timeMs: number) => {
    const { minutes, hours } = splitMillisWithFormat(timeMs, { hoursDigit: 1, hideZeroHours: true });
    return `${hours}時間 ${minutes}分`
  }

  const currentData = [
    { label: '現在の合計', value: timeFormat(userStudyProfile.totalStudyTimeMs) },
    { label: '現在の平均', value: timeFormat(userStudyProfile.averageStudyTimeMs) },
    { label: '最大連続日数', value: `${userStudyProfile.maxConsecutiveStudyDays}日` },
  ];

  const recentData = [
    { label: '今週の合計', value: timeFormat(userStudyProfile.studyTimeThisWeekMs) },
    { label: '今週の平均', value: timeFormat(userStudyProfile.averageStudyTimeThisWeekMs) },
    { label: '連続日数', value: `${userStudyProfile.consecutiveStudyDaysCurrentStreak}日` },
  ];

  const displayData = isOpen("0") ? currentData : recentData;

  return (
    <Box sx={{ ...commonStyles.flexColumnCenter, width: "100%", boxShadow: 1, bgcolor: "white", borderRadius: 2, padding: 1 }}>
      <Typography variant="h6" sx={{ width: 100, borderBottom: 1, borderColor: "gray", textAlign: "center" }}>
        学習記録
      </Typography>
      <Box sx={{ ...commonStyles.flexCenter, gap: 1, mt: 1 }}>
        <Button variant={isOpen("1") ? "outlined" : "text"} color="primary" sx={{ boxShadow: 1 }} onClick={() => toOpen("1")}>最近</Button>
        <Button variant={isOpen("0") ? "outlined" : "text"} color="secondary" sx={{ boxShadow: 1 }} onClick={() => toOpen("0")}>過去</Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column",  gap: 0.5, width: "100%", mt: 0.5 }}>
        {displayData.map((item, index) => (
          <Box key={index}>
            <Typography variant="subtitle1" >{item.label}</Typography>
            <Typography sx={{ fontWeight: "bold", bgcolor: "whitesmoke", padding: 1, borderRadius: 2 }}>{item.value}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};



export default StudyProfileDisplay;