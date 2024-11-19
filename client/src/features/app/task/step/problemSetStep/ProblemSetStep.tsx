import React, {  } from 'react';
import Plan from '../../plan/Plan';
import { useAppSelector } from '../../../../../redux/hooks';

interface ProblemSetStepProps {}

const ProblemSetStep: React.FC<ProblemSetStepProps> = () => {
  const tasks = useAppSelector(state => state.taskSlice.tasks);
  return <Plan tasks={tasks} />;
};

export default ProblemSetStep;
