import React, { useMemo } from 'react';
import { ProblemSetRead } from '../../../../../types/firebase/db/task/taskStructure';
import { useAppSelector } from '../../../../../redux/hooks';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { detailBoxStyle } from '../../shared/constants/problemSets/problemSetsConstants';
import { Edit } from '@mui/icons-material';
import ActivityDetails from './ActivityDetails';
import { sortByDueDateTime } from '../../shared/utils/taskUtils';
import { commonStyles } from '../../../../../styles/mui/commonStyles';
import { timeOmissionFormat } from '../../../../../functions/utils/timeFormatUtils';
import { sumRanges } from '../../../../../functions/utils/rangeUtils';
import { subjectColorsLight } from '../../../../../constants/label/subjectLabels';
import SubjectIcon from '../../../../../components/util/SubjectIcon';

interface ProblemSetDetailsProps {
  problemSet: ProblemSetRead | undefined;
  onCreateActivity: () => void;
  onUpdateProblemSet: () => void;
  onDeleteProblemSet: () => void;
}

const ProblemSetDetails: React.FC<ProblemSetDetailsProps> = ({ problemSet, onCreateActivity, onUpdateProblemSet, onDeleteProblemSet }) => {
  const { taskMap, categoryMap, activityMap, problemSetStructureMap } = useAppSelector(state => state.taskSlice);
  
  const structure = problemSet ? problemSetStructureMap[problemSet.docId] : null;
  const categories = structure?.categoryIds.map(id => categoryMap[id]) || [];
  const activities = useMemo(() => structure?.activityIds.map(id => activityMap[id]) || [], [structure?.activityIds, activityMap]);
  const sortedActivities = useMemo(() => sortByDueDateTime(activities, "dueDateTime"), [activities]);

  // Null or undefined check for problemSet
  if (!problemSet) return null;
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      padding: 2,
      borderRadius: 2,
      bgcolor: subjectColorsLight[problemSet.subject] ?? "whitesmoke",
      height: '95vh',
      overflow: 'auto'
    }}>
      <Box >
        <IconButton size="small" onClick={onUpdateProblemSet} >
          <Edit />
        </IconButton>
        <Box sx={{ ...detailBoxStyle }}>
          <Box sx={{ ...commonStyles.centerAlign, justifyContent: 'space-between' }}>
            <Typography variant='h5' sx={{ p: 1 }}>{problemSet.name}</Typography>
            <SubjectIcon subject={problemSet.subject} />
          </Box>
          <Box>
            {categories.map((category) => (
              <Box key={category.docId} sx={{ ...commonStyles.flexBetween }}>
                <Typography>{category?.name}</Typography>
                <Typography>
                  {category?.totalProblemNumber ?
                    `${sumRanges(category.completedProblemIdsRange)}/${category.totalProblemNumber}問`
                    : `${sumRanges(category.completedProblemIdsRange)}問完了`}
                </Typography>
                <Typography>平均 {timeOmissionFormat(category.timePerProblem)}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={detailBoxStyle}>
        <Button variant='outlined' onClick={onCreateActivity} sx={{ width: "100%", mb: 2 }}>
          課題を追加
        </Button>
        <ActivityDetails activities={sortedActivities} categoryMap={categoryMap} taskMap={taskMap} />
      </Box>
      <Button variant='contained' color='error' sx={{ width: "50%", alignSelf: "end" }} onClick={onDeleteProblemSet}>
        問題集を削除
      </Button>
    </Box>
  );
};

export default ProblemSetDetails;
