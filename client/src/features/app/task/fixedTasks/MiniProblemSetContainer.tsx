import React from 'react';
import { ProblemSetRead } from '../../../../types/firebase/db/task/taskStructure';
import { Box } from '@mui/material';

interface MiniProblemSetContainerProps {
  problemSet: ProblemSetRead;
}

const MiniProblemSetContainer: React.FC<MiniProblemSetContainerProps> = ({ problemSet }) => {
  return (
    <Box>
      {problemSet.name}
    </Box>
  );
};

export default MiniProblemSetContainer;