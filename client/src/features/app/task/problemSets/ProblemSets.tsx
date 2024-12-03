import React, { useState } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import Popup from '../../../../components/display/popup/Popup';
import { Box } from '@mui/material';
import CreateActivity from '../createTask/createActivity/CreateActivity';
import { ProblemSetRead } from '../../../../types/firebase/db/task/taskStructure';
import ClickableContainer from '../../../../components/container/ClickableContainer';
import ProblemSetContainer from './ProblemSetContainer';
import { dynamicStyles } from '../../../../styles/mui/dynamicStyles';
import ProblemSetDetails from './details/ProblemSetDetails';
import DeleteProblemSetForm from './details/DeleteProblemSetForm';
import { useNavigate } from 'react-router-dom';
import { appPaths } from '../../../../constants/app/path/appPath';
import UpdateProblemSetForm from './details/UpdateProblemSetForm';

interface ProblemSetsProps {
  
}

type ProblemSetAction = 'createActivity' | 'updateProblemSet' | 'deleteProblemSet';

const ProblemSets: React.FC<ProblemSetsProps> = () => {
  const navigate = useNavigate();
  const { problemSetMap, categoryMap } = useAppSelector(state => state.taskSlice);
  const [createActivityTargetSet, setCreateActivityTargetSet] = useState<ProblemSetRead | null>(null);
  const [displayDetailProblemSet, setDisplayDetailProblemSet] = useState<null | ProblemSetRead>(null);
  const [problemSetActionType, setProblemSetActionType] = useState<ProblemSetAction | null>(null);


  const handleProblemSetAction = (action: ProblemSetAction) => {
    switch (action) {
      case 'createActivity':
        setCreateActivityTargetSet(null);
        break;
      case 'updateProblemSet':
        break;
      case 'deleteProblemSet':
        setDisplayDetailProblemSet(null);
        navigate(appPaths.task.problemSets._abs, { replace: true });
        break;
      default:
        break;
    }
    setProblemSetActionType(null);
  }

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
          <ClickableContainer key={index} onClick={() => setDisplayDetailProblemSet(problemSet)} >
            <ProblemSetContainer problemSet={problemSet} />
          </ClickableContainer>
        ))}
      </Box>
      <Popup open={!!createActivityTargetSet} handleClose={() => setCreateActivityTargetSet(null)} >
        {createActivityTargetSet &&
          <Box sx={{
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <CreateActivity
              problemSet={createActivityTargetSet}
              categories={Object.values(categoryMap)}
              onSuccessCreate={() => handleProblemSetAction("createActivity")}
            />
          </Box>
        }
      </Popup>
      <Popup open={!!displayDetailProblemSet} handleClose={() => setDisplayDetailProblemSet(null)} >
        {displayDetailProblemSet &&
          <>
            <ProblemSetDetails
              problemSet={displayDetailProblemSet}
              onCreateActivity={() => setCreateActivityTargetSet(displayDetailProblemSet)}
              onUpdateProblemSet={() => setProblemSetActionType("updateProblemSet")}
              onDeleteProblemSet={() => setProblemSetActionType("deleteProblemSet")}
            />
            <Popup open={problemSetActionType === "deleteProblemSet" && !!displayDetailProblemSet} handleClose={() => setProblemSetActionType(null)} >
              <DeleteProblemSetForm
                problemSet={displayDetailProblemSet}
                onSuccessDelete={() => handleProblemSetAction("deleteProblemSet")}
                onCancelDelete={() => setProblemSetActionType(null) }
              />
            </Popup>
            <Popup open={problemSetActionType === "updateProblemSet" && !!displayDetailProblemSet} handleClose={() => setProblemSetActionType(null)} >
              <UpdateProblemSetForm
                problemSet={displayDetailProblemSet}
                onSuccessUpdate={() => handleProblemSetAction("updateProblemSet")}
                onCancel={() => setProblemSetActionType(null)}
              />
            </Popup>
          </>
        }
      </Popup>

    </>
  );
};

export default ProblemSets;