import React from 'react';
import { LearningState } from '../../../../types/firebase/db/learning/learningSupplementTypes';
import { Box, Button, Typography } from '@mui/material';
import { learningStateColorLabel, learningStateLabels } from '../shared/constants/learningConstants';
import { millisToTime } from '../../../../functions/utils/timeFormatUtils';

interface TimeHistoryProps {
  history: Record<LearningState, number>;
  learningState: LearningState;
  onChangeState: (state: LearningState) => void;
}

const LearningTimeHistory: React.FC<TimeHistoryProps> = ({ history, learningState, onChangeState }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: "column", gap: 1 }}>
      {Object.entries(history).map(([state, timeMs]) => (
        <Box
          key={state}
          sx={{
            display: 'flex',
            bgcolor: learningStateColorLabel[state as LearningState],
            padding: 0.5,
            borderRadius: 1,
            boxShadow: 2,
            width: state === learningState ? "97%" : "90%"
          }}
        >
          <Button
            sx={{ display: "flex", justifyContent: "start", color: "black", width: "100%" }}
            size="small"
            onClick={() => onChangeState(state as LearningState)}
          >
            <Typography sx={{ ml: 2, mr: 4, fontWeight: "bold" }} >
              {learningStateLabels[state as LearningState]}
            </Typography>
            <Typography>
              {millisToTime(timeMs)}
            </Typography>
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default LearningTimeHistory;