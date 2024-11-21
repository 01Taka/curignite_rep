import React from 'react';
import DnD from '../../../../../components/inputs/DnD';
import { Box } from '@mui/material';
import useSortableList from '../../../../hooks/components/useSortableList';
import { IndividualTaskPreview, ProblemSetTaskPreviewById } from '../shared/taskPreviewTypes';

interface TaskOrderProps {
  tasks: (IndividualTaskPreview | ProblemSetTaskPreviewById)[];
}

const TaskOrder: React.FC<TaskOrderProps> = ({ tasks }) => {
  const { ids, setIds, renderItem } = useSortableList({
    items: tasks,
    renderItem: (item) => {
      return item.isIndividual ? (
        <Box>
          {item.title}<br />
          {item.estimatedDuration}
        </Box>
      ) : (
        <Box>
          {item.problemSetName}{item.categoryName}{item.problemId}<br />
          {item.estimatedDuration}
        </Box>
      )
    }
  });

  return (
    <DnD
      ids={ids}
      setIds={setIds}
      renderItem={renderItem}
      containerSx={{ display: "flex", flexDirection: "column", gap: "8px" }}
    />
  )
};

export default TaskOrder;