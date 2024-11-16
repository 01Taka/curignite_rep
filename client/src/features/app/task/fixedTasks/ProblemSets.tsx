import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import ProblemSetsContainer from './ProblemSetsContainer';
import { useNavigate } from 'react-router-dom';
import { mainPaths } from '../../../../types/path/mainPaths';
import useToggleList from '../../../hooks/useToggleList';
import Popup from '../../../../components/display/popup/Popup';
import { getMinAndMaxFromObjectArray, sortObjectArray } from '../../../../functions/utils/objectUtils';
import { convertToDate } from '../../../../functions/utils/dateTimeUtils';
import useProblemSet from '../hooks/useProblemSet';
import ProblemSetSubmissions from './submissions/ProblemSetSubmissions';
import CreateActivity from '../createTask/createActivity/CreateActivity';
import { FullProblemSetData } from '../../../../types/firebase/db/task/taskExpansionTypes';
import { ProblemSetRead } from '../../../../types/firebase/db/task/taskStructure';

interface ProblemSetsProps { }

const ProblemSets: React.FC<ProblemSetsProps> = () => {
  const navigate = useNavigate();
  
  const { problemSetData } = useProblemSet();
  const { isOpenAll, openIndexes, handleToggleAll, toggleOpenIndex } = useToggleList(false, problemSetData.length);
  const [editingProblemSet, setEditingProblemSet] = useState<FullProblemSetData | null>(null);
  const [addingSubmissionProblemSet, setAddingSubmissionProblemSet] = useState<ProblemSetRead | null>(null);

  const handleEditProblemSet = (problemSetData: FullProblemSetData) => {
    setEditingProblemSet(problemSetData);
  }

  const handleWorkOnProblemSet = (problemSetData: FullProblemSetData) => {
    navigate(mainPaths.learning);
  }

  const handleOpenCreateSubmission = (problemSet: ProblemSetRead | null) => {
    setAddingSubmissionProblemSet(problemSet);
  }

  const categories = problemSetData.flatMap(data => data.categories); 
  return (
    <Box sx={{ marginX: 1 }}>
      <Button onClick={handleToggleAll} variant="contained" sx={{ marginBottom: 2 }}>
        {isOpenAll ? 'すべて閉じる' : 'すべて開く'}
      </Button>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 1,
        }}
      >
        {problemSetData.map((data, index) => {
          const nextActivity = () => {
            try {
              // const value = getMinAndMaxFromObjectArray(data.activities, 'dueDateTime', convertToDate)?.min || null;
              // return value; //OUT// ???
              return null
            } catch (error) {
              return null;
            }
          };

          return (
            <ProblemSetsContainer
              key={data.problemSet.docId}
              problemSet={data.problemSet}
              nextActivity={nextActivity()}
              activityNumber={data.activities.length}
              isOpen={openIndexes.has(index)}
              onCreateSubmission={() => handleOpenCreateSubmission(data.problemSet)}
              onClickEditTask={() => handleEditProblemSet(data)}
              onClickWorkOn={() => handleWorkOnProblemSet(data)}
              onToggle={() => toggleOpenIndex(index)}
            />
          )
        })}
      </Box>
      <Popup open={!!editingProblemSet} handleClose={() => setEditingProblemSet(null)}>
        <ProblemSetSubmissions
          onCreateSubmission={() => handleOpenCreateSubmission(editingProblemSet?.problemSet || null)}
          activities={editingProblemSet? sortObjectArray(editingProblemSet.activities, 'dueDateTime') : []}
        /> 
      </Popup>
      <Popup open={!!addingSubmissionProblemSet} handleClose={() => setAddingSubmissionProblemSet(null)} >
        <Box sx={{
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <CreateActivity
            problemSet={addingSubmissionProblemSet}
            categories={categories}
            />
        </Box>
      </Popup>
    </Box>
  );
};

export default ProblemSets;
