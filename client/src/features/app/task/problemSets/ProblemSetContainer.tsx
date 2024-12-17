import React from 'react';
import { ProblemSetRead } from '../../../../types/firebase/db/task/taskStructure';
import { Box, Typography } from '@mui/material';
import { dynamicStyles } from '../../../../styles/mui/dynamicStyles';
import SubjectIcon from '../../../../components/util/SubjectIcon';
import { commonStyles } from '../../../../styles/mui/commonStyles';

interface ProblemSetContainerProps {
  problemSet: ProblemSetRead;
}

const ProblemSetContainer: React.FC<ProblemSetContainerProps> = ({
  problemSet
}) => {
  return (
    <Box sx={{
      ...commonStyles.flexStart,
      ...dynamicStyles.card(),
      gap: 1
    }}>
      <SubjectIcon subject={problemSet.subject} />
      <Typography>
        {problemSet.name || "無名"}
      </Typography>
    </Box>
  );
};

export default ProblemSetContainer;