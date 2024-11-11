import React from 'react';
import { TodayTasks } from './shared/planTypes';
import { arrayToRangeString } from '../../../../functions/utils/rangeUtils';
import { Box, Typography } from '@mui/material';
import { millToMin } from './shared/planUtils';

interface RecommendedPlanProps {
  todayTasks: TodayTasks;
  studyTimeNeededToday: number;
}

const RecommendedPlan: React.FC<RecommendedPlanProps> = ({ todayTasks, studyTimeNeededToday }) => {
  return (
    <Box sx={{ p: 2, maxWidth: '100%', width: '100%', mx: 'auto', bgcolor: 'ghostwhite' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant='h6'>合計 / 目標</Typography>
        <Typography variant='h5'>{millToMin(todayTasks.estimatedDuration)}分 / {millToMin(studyTimeNeededToday)}分</Typography>
      </Box>
      <Box>
        {todayTasks.individualTasks.map((task, index) => (
          <Box key={index} sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {task.title}
            </Typography>
            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              {Math.ceil(task.todayProgress * 100)}%進行 推定{millToMin(task.estimatedDuration)}分
            </Typography>
          </Box>
        ))}
      </Box>
      <Box>
        {todayTasks.problemSetTasks.map((task, index) => (
          <Box key={index} sx={{ my: 2 }}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              {task.taskName} 推定{millToMin(task.estimatedDuration)}分
            </Typography>
            {task.categories.map((category, catIndex) => (
              <Box key={catIndex} sx={{ pl: 2, mt: 1 }}>
                <Typography variant="subtitle1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                  {category.categoryName} 推定{millToMin(category.estimatedDuration)}分
                </Typography>
                <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' }, color: 'text.secondary' }}>
                  {arrayToRangeString(category.todayTaskProblemIds)}
                </Typography>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecommendedPlan;
