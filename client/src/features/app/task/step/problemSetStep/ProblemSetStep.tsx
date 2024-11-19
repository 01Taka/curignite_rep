import React, {  } from 'react';
import Plan from '../../plan/Plan';
import { useAppSelector } from '../../../../../redux/hooks';
import useLog from '../../../../hooks/useLog';

interface ProblemSetStepProps {}

const ProblemSetStep: React.FC<ProblemSetStepProps> = () => {
  const tasks = useAppSelector(state => state.taskSlice.tasks);
  useLog("#", tasks)

  return <Plan tasks={tasks} />;
};

export default ProblemSetStep;
