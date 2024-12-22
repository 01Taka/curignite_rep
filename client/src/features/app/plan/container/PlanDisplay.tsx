import React from 'react';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import { Add, ListAlt, Remove } from '@mui/icons-material';
import { timeOmissionFormat } from '../../../../functions/utils/timeFormatUtils';
import { commonStyles } from '../../../../styles/mui/commonStyles';
import { format } from 'date-fns';
import { Plan } from '../shared/types/plan/planTargetTypes';
import { modeColorLabels } from '../shared/constants/labels';

interface PlanDisplayProps {
  title: string;
  mission: Plan;
  onInclementGoal: (amount: number) => void;
  onChangeMode: () => void;
  onChangeTargets: () => void;
}

const PlanDisplay: React.FC<PlanDisplayProps> = ({ title, mission, onInclementGoal, onChangeMode, onChangeTargets }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", ...commonStyles.cardShadow }}>

      <Box sx={commonStyles.flexStart} >
        <Box sx={commonStyles.flexStart} >
          <Box
            sx={{
              ...commonStyles.flexCenter,
              width: 60,
              height: 30,
              borderRadius: 1,
              mr: 1,
              bgcolor: modeColorLabels[mission.mode]
            }}
          >
            {mission.dueDateTime ? format(mission.dueDateTime, "M/d") : "通常"}
          </Box>
          {!mission.isIndividual && onChangeTargets &&
            <IconButton
              size="small"
              onClick={onChangeTargets}
              sx={{
                bgcolor: "yellow"
              }}
            >
              <ListAlt />
            </IconButton>
          }
        </Box>

        <IconButton size="small" sx={{ color: "red", ml: "auto" }} >
          <Remove />
        </IconButton>
      </Box>
      <Box sx={{ ...commonStyles.flexBetween, mt: 1 }}>
        <Typography>
          {title}
        </Typography>
        <Typography sx={{ alignSelf: "end"}}>
          推定: {timeOmissionFormat(mission.estimatedDurationMs)}
        </Typography>
      </Box>
      <Box sx={commonStyles.flexStart}>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ display: "flex" }}>
            <IconButton size="small" onClick={() => onInclementGoal(-1)}>
              <Remove />
            </IconButton>
            <IconButton size="small" onClick={() => onInclementGoal(1)}>
              <Add />
            </IconButton>
          </Box>
        </Box>
        <LinearProgress
          variant="determinate"
          value={mission.progress}
          sx={{
            width: "100%",
            mr: 1
          }}
        />
        <Typography sx={{ width: 80, textAlign: "center" }}>
          {mission.isIndividual ? (
            `${Math.floor(mission.completedProgress)}/${Math.floor(mission.goalProgress * 100)}%`
          ) : (
            `${mission.completedNumber}/${mission.goalNumber}`
          )}
        </Typography>
      </Box>
      {!mission.isIndividual && 
        <Typography sx={{ alignSelf: "end" }} variant="caption" >
          最大 {mission.maxProblemNumber}
        </Typography>
      }

    </Box>
  );
};

export default PlanDisplay;