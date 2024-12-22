import React from 'react';
import { CategoryActivityStatus } from '../../../../types/firebase/db/task/taskExpansionTypes';
import { ProblemSetRead } from '../../../../types/firebase/db/task/taskStructure';

interface ProblemIdSelectorProps {
  problemSet: ProblemSetRead;
  activityStatus?: CategoryActivityStatus[];
}

const ProblemIdSelector: React.FC<ProblemIdSelectorProps> = ({ problemSet, activityStatus }) => {
  return (
    <div>
      {}
    </div>
  );
};

export default ProblemIdSelector;