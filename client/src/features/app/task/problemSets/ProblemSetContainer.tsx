import React from 'react';
import { ProblemSetRead } from '../../../../types/firebase/db/task/taskStructure';
import { Box, Typography } from '@mui/material';
import { dynamicStyles } from '../../../../styles/mui/dynamicStyles';

interface ProblemSetContainerProps {
  problemSet: ProblemSetRead;
}

const ProblemSetContainer: React.FC<ProblemSetContainerProps> = ({
  problemSet
}) => {
  return (
    <Box sx={{
      ...dynamicStyles.flexCenter({ alignItems: 'start' }),
      ...dynamicStyles.card(),
    }}>
      <Typography>
        {problemSet.name || "無名"}
      </Typography>
    </Box>
  );
};

export default ProblemSetContainer;