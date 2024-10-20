import React, { useMemo, useState } from 'react';
import { CollectionWithTasksData, TaskCollectionData } from '../../../../types/firebase/db/common/task/taskStructure';
import { Box, Button } from '@mui/material';
import FixedTasksContainer from './FixedTasksContainer';
import { useNavigate } from 'react-router-dom';
import { mainPaths } from '../../../../types/path/mainPaths';
import useCollectionsWithTasks from '../hooks/useCollectionsWithTasks';
import useToggleList from '../../../hooks/useToggleList';
import FixedTaskSubmissions from './submissions/FixedTaskSubmissions';
import Popup from '../../../../components/display/popup/Popup';
import { getMinAndMaxFromObjectArray, sortObjectArray } from '../../../../functions/objectUtils';
import { convertToDate } from '../../../../functions/dateTimeUtils';
import CreateCollectionTask from '../createTask/createForm/CreateCollectionTask';

interface FixedTasksProps { }

const FixedTasks: React.FC<FixedTasksProps> = () => {
  const navigate = useNavigate();
  
  const { collectionsWithTasks } = useCollectionsWithTasks();
  const { isOpenAll, openIndexes, handleToggleAll, toggleOpenIndex } = useToggleList(false, collectionsWithTasks.length);
  const [editingCollection, setEditingCollection] = useState<CollectionWithTasksData | null>(null);
  const [addingSubmissionCollection, setAddingSubmissionCollection] = useState<TaskCollectionData | null>(null);

  const handleEditCollection = (collectionData: CollectionWithTasksData) => {
    setEditingCollection(collectionData);
  }

  const handleWorkOnCollection = (collectionData: CollectionWithTasksData) => {
    navigate(mainPaths.learning);
  }

  const handleOpenCreateSubmission = (collection: TaskCollectionData | null) => {
    setAddingSubmissionCollection(collection);
  }

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
        {collectionsWithTasks.map((data, index) => {
          const nextSubmission = () => {
            try {
              const value = getMinAndMaxFromObjectArray(data.tasksData, 'dueDateTime', convertToDate)?.min || null;
              return value;
            } catch (error) {
              return null;
            }
          };

          return (
            <FixedTasksContainer
              key={data.collectionData.docId}
              taskCollection={data.collectionData}
              nextSubmission={nextSubmission()}
              submissionNumber={data.tasksData.length}
              isOpen={openIndexes.has(index)}
              onCreateSubmission={() => handleOpenCreateSubmission(data.collectionData)}
              onClickEditTask={() => handleEditCollection(data)}
              onClickWorkOn={() => handleWorkOnCollection(data)}
              onToggle={() => toggleOpenIndex(index)}
            />
          )
        })}
      </Box>
      <Popup open={!!editingCollection} handleClose={() => setEditingCollection(null)}>
        <FixedTaskSubmissions
          onCreateSubmission={() => handleOpenCreateSubmission(editingCollection?.collectionData || null)}
          submissions={editingCollection? sortObjectArray(editingCollection.tasksData, 'dueDateTime') : []}
        /> 
      </Popup>
      <Popup open={!!addingSubmissionCollection} handleClose={() => setAddingSubmissionCollection(null)} >
        <Box sx={{
          maxHeight: '90vh',
          overflow: 'auto'
        }}>
          <CreateCollectionTask collection={addingSubmissionCollection} />
        </Box>
      </Popup>
    </Box>
  );
};

export default FixedTasks;
