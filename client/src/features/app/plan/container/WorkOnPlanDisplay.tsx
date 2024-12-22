import { ListAlt } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import React from 'react';
import SliderWithButtons from '../../../../components/inputs/SliderWithButtons';
import { timeOmissionFormat } from '../../../../functions/utils/timeFormatUtils';
import { commonStyles } from '../../../../styles/mui/commonStyles';
import DaySelectButton from './button/DaySelectButton';
import TaskOverview from './TaskOverview';
import { WorkOnPlan } from '../shared/types/plan/workOnPlanTypes';
import FlexRangeSlider from '../../../../components/inputs/FlexRangeSlider';

interface WorkOnPlanDisplayProps {
  workOnPlan: WorkOnPlan;
  isIndividual: boolean;
  onAddWorkOnPlan: (value: number) => void;
  onSelectProblemSetWorkOnItems: () => void;
}

const WorkOnPlanDisplay: React.FC<WorkOnPlanDisplayProps> = ({ workOnPlan, isIndividual, onAddWorkOnPlan, onSelectProblemSetWorkOnItems }) => {
  return (
    <Box sx={{ ...commonStyles.cardShadow }}>
      {workOnPlan.planType}
      <Box sx={{ ...commonStyles.flexStart, gap: 1.5 }}>
        {workOnPlan.planType !== "problemSet" &&
          <>
            <DaySelectButton
              task={workOnPlan.task}
              emergencyDaysBorder={7}
              onSelectedDay={() => {}} // 必要な処理なし
            />
            <TaskOverview task={workOnPlan.task} />
          </>
        }
        {!isIndividual &&
          <IconButton
            size="small"
            onClick={onSelectProblemSetWorkOnItems}
            sx={{
              bgcolor: "yellow",
              ml: "auto"
            }}
          >
            <ListAlt />
          </IconButton>
        }
      </Box>
      {workOnPlan.planType !== "problemSet" ? (
        <SliderWithButtons
          initialValue={workOnPlan.minValue}
          minValue={workOnPlan.minValue}
          maxValue={workOnPlan.maxValue}
          buttonStep={isIndividual ? 5 : 1}
          props={{
            min: 0,
            max: workOnPlan.maxValue,
            step: isIndividual ? 5 : 1
          }}
          onChange={(value) => onAddWorkOnPlan(value)}
        />
      ) : (
        <FlexRangeSlider 
          initialValue={workOnPlan.minValue}
          initialRange={{ min: workOnPlan.minValue, max: workOnPlan.minValue + 10 }}
          minLimit={workOnPlan.minValue}
          onValueChange={(value) => onAddWorkOnPlan(value)}
        />
      )}
      <Box sx={{ ...commonStyles.flexEnd, gap: 2 }}>
        <Typography>
          推定: {timeOmissionFormat(workOnPlan.estimatedDuration)}
        </Typography>
        <Typography>
          {workOnPlan.remainingValue ? 
            `${workOnPlan.currentValue}/${workOnPlan.remainingValue}${isIndividual ? "(%)" : ""}`
            : `×${workOnPlan.currentValue}`
          }
        </Typography>
      </Box>
    </Box>
  );
};

export default WorkOnPlanDisplay;