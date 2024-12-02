import React from 'react';
import { ProblemSetRead } from '../../../../../types/firebase/db/task/taskStructure';
import { useAppSelector } from '../../../../../redux/hooks';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { detailBoxStyle } from '../../shared/constants/problemSets/problemSetsConstants';
import { timeOmissionFormat } from '../../../../../functions/utils/dateTimeUtils';
import { rangesToString, sumRanges } from '../../../../../functions/utils/rangeUtils';
import { dynamicStyles } from '../../../../../styles/mui/dynamicStyles';
import { Edit } from '@mui/icons-material';
import { formatDueDateTime } from '../../shared/utils/taskUtils';

interface ProblemSetDetailsProps {
  problemSet: ProblemSetRead;
  onCreateActivity: () => void;
}

const ProblemSetDetails: React.FC<ProblemSetDetailsProps> = ({ problemSet, onCreateActivity }) => {
  const { categoryMap, activityMap, problemSetStructureMap } = useAppSelector(state => state.taskSlice);
  const structure = problemSetStructureMap[problemSet.docId]
  const categories = structure.categoryIds.map(id => categoryMap[id]);
  const activities = structure.activityIds.map(id => activityMap[id]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      padding: 1,
      bgcolor: 'beige',
      height: '95vh'
    }}>
      <Box sx={detailBoxStyle} >
        <Typography>
          {problemSet.name}
        </Typography>
        <Box>
          {categories.map(category => (
            <Box sx={{ ...dynamicStyles.flexCenter({ direction: "row", justifyContent: "space-between" })}}>
              <Typography>{category.name}</Typography>
              <Typography>
                {category.totalProblemNumber ?
                `${sumRanges(category.completedProblemIdsRange)}/${category.totalProblemNumber}問`
                : `${sumRanges(category.completedProblemIdsRange)}問完了`
                }
              </Typography>
              <Typography>平均{timeOmissionFormat(category.timePerProblem)}</Typography>
              <IconButton size='small'>
                <Edit />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={detailBoxStyle}>
      <Button variant='outlined' onClick={onCreateActivity} sx={{ width: "100%" }}>
        課題を追加
      </Button>
        {activities.map(activity => {
          return (
            <Box>
              {formatDueDateTime(activity.dueDateTime)}
              {activity.categoryActivities.map(content => {
                const category = categoryMap[content.categoryId];
                const remainingNumber = sumRanges(category.completedProblemIdsRange)
                return (
                  <Box>
                    {category.name}<br />
                    {remainingNumber}/{category.totalProblemNumber}<br />
                    {rangesToString(content.problemIdsRange)}<br />
                    残り推定: {timeOmissionFormat(category.timePerProblem * remainingNumber)}<br />
                  </Box>
                )
              })}
            </Box>
          )
        })}
      </Box>
    </Box>
  );
};

export default ProblemSetDetails;