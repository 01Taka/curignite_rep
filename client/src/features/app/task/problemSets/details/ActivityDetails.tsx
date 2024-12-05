import { Box, Typography } from '@mui/material';
import React from 'react';
import { convertToDate } from '../../../../../functions/utils/dateTimeUtils';
import { objectArrayToDict } from '../../../../../functions/utils/objectUtils';
import { sumRanges, rangesToString } from '../../../../../functions/utils/rangeUtils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { ProblemSetActivityRead, ProblemSetCategoryRead } from '../../../../../types/firebase/db/task/taskStructure';
import { Range } from '../../../../../types/util/componentsTypes';
import { TimeTypes } from '../../../../../types/util/dateTimeTypes';
import { formatDateDifference, timeOmissionFormat } from '../../../../../functions/utils/timeFormatUtils';

interface ActivityDetailsProps {
  activities: ProblemSetActivityRead[];
  categoryMap: Record<string, ProblemSetCategoryRead>;
  taskMap: Record<string, TaskData>;
}

const ActivityDetails: React.FC<ActivityDetailsProps> = ({ activities, categoryMap, taskMap }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {activities.map((activity) => {
        const task = taskMap[activity.docId];
        if (!task?.problemSetActivityField?.activityStatus.length) return null;

        const activityStatusMap = objectArrayToDict(task.problemSetActivityField.activityStatus, 'categoryId');

        return (
          <ActivityCard
            key={activity.docId}
            activity={activity}
            activityStatusMap={activityStatusMap}
            categoryMap={categoryMap}
          />
        );
      })}
    </Box>
  );
};

interface ActivityCardProps {
  activity: ProblemSetActivityRead;
  activityStatusMap: Record<string, any>;
  categoryMap: Record<string, ProblemSetCategoryRead>;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, activityStatusMap, categoryMap }) => (
  <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, boxShadow: 1 }}>
    <DeadlineComponent dueDateTime={activity.dueDateTime} />
    {activity.categoryActivities.map((content) => {
      const category = categoryMap[content.categoryId];
      const activityStatus = activityStatusMap[content.categoryId];

      return (
        <CategoryDetails
          key={content.categoryId}
          categoryName={activityStatus.categoryName}
          remainingNumber={activityStatus.completedProblemIds.length}
          totalNumber={sumRanges(activityStatus.problemIdsRange)}
          problemIdsRange={activityStatus.problemIdsRange}
          estimatedTime={category.timePerProblem * activityStatus.completedProblemIds.length}
        />
      );
    })}
  </Box>
);

interface DeadlineComponentProps {
  dueDateTime?: TimeTypes | null;
}

const DeadlineComponent: React.FC<DeadlineComponentProps> = ({ dueDateTime }) => {
  if (!dueDateTime) {
    return (
      <Typography variant="subtitle1">
        提出日: 未定
      </Typography>
    );
  }

  const relativeDeadline = formatDateDifference(dueDateTime);
  const abstractDeadline = format(convertToDate(dueDateTime), 'yyyy/MM/dd (E)', { locale: ja });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="subtitle1">提出日:</Typography>
        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
          {relativeDeadline}
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ mb: 0.5, color: 'GrayText' }}>
        {abstractDeadline}
      </Typography>
    </Box>
  );
};

interface CategoryDetailsProps {
  categoryName: string;
  remainingNumber: number;
  totalNumber: number;
  problemIdsRange: Range[];
  estimatedTime: number;
}

const CategoryDetails: React.FC<CategoryDetailsProps> = ({
  categoryName,
  remainingNumber,
  totalNumber,
  problemIdsRange,
  estimatedTime,
}) => (
  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="subtitle2">{categoryName}</Typography>
      <Typography variant="body2" color="text.secondary">
        {remainingNumber} / {totalNumber}
      </Typography>
    </Box>
    <Typography variant="body2" color="text.secondary">
      範囲: {rangesToString(problemIdsRange)}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      推定時間: {timeOmissionFormat(estimatedTime)}
    </Typography>
  </Box>
);

export default ActivityDetails;
