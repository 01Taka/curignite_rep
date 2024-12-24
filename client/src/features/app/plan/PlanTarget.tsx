import { Box } from '@mui/material';
import React, { useMemo } from 'react';
import { commonStyles } from '../../../styles/mui/commonStyles';
import PlanContainer from './container/PlanContainer';
import useTasks from '../../hooks/app/useTasks';
import useWorkOnPlan from './shared/hooks/plan/useWorkOnPlan';
import { PlanTarget as PlanTargetType } from './shared/types/plan/planTargetTypes';

interface PlanTargetProps { }

const PlanTarget: React.FC<PlanTargetProps> = () => {
  const { taskMap, individualTasks, problemSets } = useTasks();
  const { workOnProblemSetMap, addIndividualTask, addWorkOnProblemSetTask, addWorkOnProblemSet, getWorkOnTasks, isExistPlan } = useWorkOnPlan();

  const targets = useMemo(() => {
    return [
      ...individualTasks.map(task => ({ isIndividual: true, target: taskMap[task.docId] } as PlanTargetType)),
      ...problemSets.map(target => ({ isIndividual: false, target } as PlanTargetType))
    ]
  }, [individualTasks, problemSets]);


  return (
    <Box sx={{ ...commonStyles.flexColumnCenter, gap: 2, width: "100%" }}>
      {targets.map(target => (
        <PlanContainer
          planTarget={target}
          workOnProblemSet={!target.isIndividual ? workOnProblemSetMap[target.target.docId] ?? null : null}
          isExistPlan={isExistPlan}
          addWorkOnProblemSetTask={addWorkOnProblemSetTask}
          addIndividualPlan={addIndividualTask}
          addWorkOnProblemSet={addWorkOnProblemSet}
          getWorkOnTasks={getWorkOnTasks}
          onSelectProblemSetWorkOnItems={() => {}}
        />
      ))}
    </Box>
  );
};

export default PlanTarget;