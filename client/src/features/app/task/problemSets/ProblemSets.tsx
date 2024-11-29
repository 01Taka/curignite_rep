import React, { useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import Popup from '../../../../components/display/popup/Popup';
import { Box } from '@mui/material';
import CreateActivity from '../createTask/createActivity/CreateActivity';
import { ProblemSetRead } from '../../../../types/firebase/db/task/taskStructure';
import ClickableContainer from '../../../../components/container/ClickableContainer';
import ProblemSetContainer from './ProblemSetContainer';
import { dynamicStyles } from '../../../../styles/mui/dynamicStyles';

interface ProblemSetsProps { }

const ProblemSets: React.FC<ProblemSetsProps> = ({}) => {
  const { problemSetMap, categoryMap } = useAppSelector(state => state.taskSlice);
  const [createActivityTargetSet, setCreateActivityTargetSet] = useState<ProblemSetRead | null>(null);
  console.log(problemSetMap);
  

  return (
    <>
      <Box sx={{
       ...dynamicStyles.grid(),
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        marginX: 1
      }}>
        {Object.values(problemSetMap).map((problemSet, index) => (
          <ClickableContainer key={index} onClick={() => {}}>
            <ProblemSetContainer problemSet={problemSet} />
          </ClickableContainer>
        ))}
      </Box>
      <Popup open={!!createActivityTargetSet} handleClose={() => setCreateActivityTargetSet(null)} >
        <Box sx={{
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <CreateActivity
            problemSet={createActivityTargetSet}
            categories={Object.values(categoryMap)}
          />
        </Box>
      </Popup>
    </>
  );
};

export default ProblemSets;