import React, { useMemo } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Popup from '../../../components/display/popup/Popup';
import { MINUTES_IN_MILLISECOND } from '../../../constants/utils/dateTimeConstants';
import { useAppSelector } from '../../../redux/hooks';
import useToggle from '../../hooks/useToggle';
import CustomPlanMain from './customPlan/CustomPlanMain';
import RecommendedPlan from './RecommendedPlan';
import usePlan from './shared/hooks/plan/usePlan';
import { useTaskPlanManager } from './shared/hooks/plan/useTaskPlanManager';

interface PlanProps {}

const Plan: React.FC<PlanProps> = () => {
  const { taskMap, categoryMap } = useAppSelector(state => state.taskSlice);
  const tasks = useMemo(() => Object.values(taskMap), [taskMap]);

  const { todayTasks, studyTimeNeededToday } = usePlan(false);
  const { isOpen, toOpen, toClose } = useToggle();
  const { createTaskPlan } = useTaskPlanManager();

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
          <Typography variant='h6'>
            今日の目標
          </Typography>
          <Typography variant='h5'>
            {Math.ceil(studyTimeNeededToday / MINUTES_IN_MILLISECOND)}分
          </Typography>
        </Box>
        <Button variant='contained' size='large' onClick={() => toOpen('recommend')} >
          今日のおすすめ
        </Button>
        <Button variant='outlined' size='large' onClick={() => toOpen('custom')} >
          自分で決める
        </Button>
      </Box>
      <Popup open={isOpen('recommend')} handleClose={toClose} >
        <RecommendedPlan
          todayTasks={todayTasks}
          studyTimeNeededToday={studyTimeNeededToday}
          onEditPlan={() => toOpen('editRecommend')}
          createTaskPlan={createTaskPlan}
        />
      </Popup>
      <Popup open={isOpen('custom') || isOpen('editRecommend')} handleClose={toClose} >
        <CustomPlanMain
          studyTimeNeededToday={studyTimeNeededToday}
          tasks={tasks}
          categoryMap={categoryMap}
          recommendTask={isOpen('editRecommend') ? todayTasks : null}
          createTaskPlan={createTaskPlan}
        />
      </Popup>
    </>
  );
};

export default Plan;
