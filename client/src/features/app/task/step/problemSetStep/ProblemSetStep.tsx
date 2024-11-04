import React from 'react';
import QuickPlanEntry from './quickPlanEntry/QuickPlanEntry';
import useProblemSet from '../../hooks/useProblemSet';

interface ProblemSetStepProps { }

const ProblemSetStep: React.FC<ProblemSetStepProps> = ({}) => {
  const { problemSetData } = useProblemSet();
  console.log(problemSetData);
  
  return <QuickPlanEntry taskData={problemSetData[1]?.activities[1] ?? null} />
};

export default ProblemSetStep;