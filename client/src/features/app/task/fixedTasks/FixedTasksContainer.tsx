import React from 'react';
import { TaskCollectionData, TaskData } from '../../../../types/firebase/db/common/task/taskStructure';
import { Box, Button, Divider, IconButton, Typography } from '@mui/material';
import MiniValueIcon from '../../../../components/display/container/MiniValueIcon';
import { AccessTime, Add, FormatListBulleted } from '@mui/icons-material';
import { format } from 'date-fns';
import { convertToDate, formatDateDifference, timeOmissionFormat } from '../../../../functions/dateTimeUtils';
import { rangesToString } from '../../../../functions/rangeUtils';
import MultiLineText from '../../../../components/display/text/MultiLineText';

interface FixedTasksContainerProps {
  taskCollection: TaskCollectionData;
  nextSubmission: TaskData | null;
  submissionNumber: number;
  isOpen: boolean;
  onCreateSubmission: () => void;
  onClickEditTask: () => void;
  onClickWorkOn: () => void;
  onToggle: () => void;
}

interface HeaderProps {
  collectionName: string;
  completedCount: number;
  totalPages: number;
  isOpen: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collectionName, completedCount, totalPages, isOpen, onToggle }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: 1,
      bgcolor: '#ccc',
      cursor: 'pointer', // クリック可能に
      borderRadius: 2,
      borderBottomLeftRadius: isOpen ? 0 : -2,
      borderBottomRightRadius: isOpen ? 0 : -2,
    }}
    onClick={onToggle} // クリックで開閉をトグル
  >
    <Typography>{collectionName}</Typography>
    <Typography>{completedCount}/{totalPages}</Typography>
  </Box>
);

interface NextTaskDisplayProps {
  nextSubmission: TaskData | null;
  submissionNumber: number;
}

const NextTaskDisplay: React.FC<NextTaskDisplayProps> = ({ nextSubmission, submissionNumber }) => {
  // 必要なデータが存在しない場合は null を返す
  if (!nextSubmission?.collectionTaskField?.pagesInRange || !nextSubmission.dueDateTime) {
    return null;
  }

  const { collectionTaskField } = nextSubmission;
  const { pagesInRange, completionRate } = collectionTaskField;
  const formatRemainingDays = formatDateDifference(convertToDate(nextSubmission.dueDateTime), '残りd日');


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', px: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography>次のミッション</Typography>
        <Typography>{formatRemainingDays}</Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <MultiLineText maxLines={3}>
          範囲: {rangesToString(pagesInRange)}
        </MultiLineText>
        <Typography>
          {completionRate}
        </Typography>
      </Box>
      <Divider variant="fullWidth" />
    </Box>
  );
};

const FixedTasksContainer: React.FC<FixedTasksContainerProps> = ({
  taskCollection,
  nextSubmission,
  submissionNumber,
  isOpen,
  onCreateSubmission,
  onClickEditTask,
  onClickWorkOn,
  onToggle,
}) => {
  const formatEstimatedDuration = timeOmissionFormat(taskCollection.timePerPage);
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        bgcolor: "#eee",
        border: 1,
        borderColor: 'black',
        borderRadius: 2,
      }}
    >
      <Header
        collectionName={taskCollection.collectionName}
        completedCount={taskCollection.completedPageIndices.length}
        totalPages={taskCollection.totalPages}
        isOpen={isOpen}
        onToggle={onToggle}
      />
      <NextTaskDisplay nextSubmission={nextSubmission} submissionNumber={submissionNumber} />
      {isOpen && (
        <Box sx={{ padding: 1 }}>
          <Box>
            {formatEstimatedDuration && (
              <Box sx={{
                display: 'flex',
                gap: 1
              }}>
                <MiniValueIcon icon={<AccessTime />} value={formatEstimatedDuration} tooltipText='所要時間' />
                <MiniValueIcon icon={<FormatListBulleted />} value={submissionNumber} tooltipText='ミッションの数' hide={!submissionNumber} />
              </Box>
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <IconButton color='primary' onClick={onCreateSubmission}>
              <Add />
            </IconButton>
            <Button variant='outlined' onClick={onClickEditTask}>ミッション</Button>
            <Button variant='outlined' onClick={onClickWorkOn}>始める</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FixedTasksContainer;
