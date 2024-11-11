import React, {  } from 'react';
import { TaskData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import { Box, Button, Typography } from '@mui/material';
import usePlan from './shared/usePlan';
import { MINUTES_IN_MILLISECOND } from '../../../../constants/utils/dateTimeConstants';
import RecommendedPlan from './RecommendedPlan';
import Popup from '../../../../components/display/popup/Popup';
import useToggle from '../../../hooks/useToggle';
import CustomPlanMain from './customPlan/CustomPlanMain';

interface PlanProps {
  tasks: TaskData[];
}

const Plan: React.FC<PlanProps> = ({ tasks }) => {
  const { todayTasks, studyTimeNeededToday } = usePlan(tasks, false);
  const { isOpen, toOpen, toClose } = useToggle();

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
        <RecommendedPlan todayTasks={todayTasks} studyTimeNeededToday={studyTimeNeededToday} />
      </Popup>
      <Popup open={isOpen('custom')} handleClose={toClose} >
        <CustomPlanMain studyTimeNeededToday={studyTimeNeededToday} tasks={tasks} />
      </Popup>
    </>
  );
};

export default Plan;
