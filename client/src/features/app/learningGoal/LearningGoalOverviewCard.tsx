import React, { FC } from 'react'
import { UserLearningGoalData } from '../../../types/firebase/db/user/userStructure';
import { Typography } from '@mui/material';
import { MINUTES_IN_MILLISECOND } from '../../../constants/utils/dateTimeConstants';
import SubjectIcon from '../../../components/util/SubjectIcon';
import { learningGoalStatusColors, learningGoalStatusLabels } from '../../../constants/label/LearningGoalLabels';

interface LearningGoalOverviewCardProps {
  learningGoal: UserLearningGoalData;
}

const LearningGoalOverviewCard: FC<LearningGoalOverviewCardProps> = ({ learningGoal }) => {
  return (
    <div className='relative flex justify-center, items-center'>
      <div className='absolute top-0 left-0'>
        <Typography>
          目標: {Math.floor(learningGoal.targetDuration / MINUTES_IN_MILLISECOND)}分
        </Typography>
      </div>
      <SubjectIcon subject={learningGoal.subject} />
      <div className='absolute bottom-0 left-0 w-16 h-8 rounded-md' style={{ backgroundColor: learningGoalStatusColors[learningGoal.status] }}>
        {learningGoalStatusLabels[learningGoal.status]}
      </div>

      <Typography variant='h4'>
        {learningGoal.objective}
      </Typography>
    </div>
  )
}

export default LearningGoalOverviewCard