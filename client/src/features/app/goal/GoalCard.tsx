import { FC } from "react";
import { UserGoalData } from "../../../types/firebase/db/user/userStructure";
import { TimeTypes } from "../../../types/util/dateTimeTypes";
import { differenceInMinutes, format, isToday } from "date-fns";
import { convertToDate } from "../../../functions/dateTimeUtils";
import { Typography } from "@mui/material";
import SubjectIcon from "../../../components/util/SubjectIcon";

interface GoalCardProps {
  goal: UserGoalData;
}

const GoalCard: FC<GoalCardProps> = ({ goal }) => {
  const formatTimeDifference = (time: TimeTypes) => {
    const remainingTime = Math.abs(differenceInMinutes(convertToDate(time), new Date()));
    const hours = Math.floor(remainingTime / 60);
    const minutes = remainingTime % 60;
    return `${hours}時間${minutes}分`;
  };

  const getDeadlineText = (formattedDeadline: string, timeDifference: string) => 
    `目標時刻(${formattedDeadline})まであと${timeDifference}`;

  const getFormattedDeadline = (goalDeadline: TimeTypes) => {
    const deadlineDate = convertToDate(goalDeadline);
    const now = new Date();
    const remainingMinutes = differenceInMinutes(deadlineDate, now);
    const differenceTimeText = formatTimeDifference(deadlineDate);

    if (remainingMinutes < 0) {
      return `目標時刻オーバー (${differenceTimeText}前)`;
    } else if (isToday(deadlineDate)) {
      if (format(deadlineDate, "HH:mm") === "23:59") {
        return `目標: 今日中 (あと${differenceTimeText})`;
      }
      return getDeadlineText(format(deadlineDate, "HH:mm"), differenceTimeText);
    }

    return getDeadlineText(format(deadlineDate, "M/d HH:mm"), differenceTimeText);
  };

  return (
    <div className='relative p-4 shadow-md rounded-lg'>
      <Typography variant='h6'>{goal.objectives}</Typography>
      <Typography>{getFormattedDeadline(goal.deadline)}</Typography>
      <SubjectIcon subject={goal.subject} />
    </div>
  );
};

export default GoalCard;