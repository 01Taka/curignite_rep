import React from "react";
import { LearningState } from "../../../../types/firebase/db/learning/learningSupplementTypes";
import { Box, SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import { learningStateColorLabel, learningStateLabels, learningStates } from "../shared/constants/learningConstants";

interface LearningStateSelectorProps {
  onSelectState: (state: LearningState) => void;
}

const LearningStateSelector: React.FC<LearningStateSelectorProps> = ({ onSelectState }) => {
  return (
    <SpeedDial
      ariaLabel="Learning State Selector"
      icon={<SpeedDialIcon />}
      direction="down" // 展開方向（必要に応じて変更）
      sx={{
        "& .MuiSpeedDial-fab": {
          width: 40, // Fabボタンの幅
          height: 40, // Fabボタンの高さ
        },
      }}
    >
      {learningStates.map((state) => (
        <SpeedDialAction
          key={state}
          icon={
            <Box
              sx={{
                width: 36,
                height: 36,
                bgcolor: learningStateColorLabel[state],
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "black",
              }}
            >
              {learningStateLabels[state]}
            </Box>
          }
          tooltipTitle={learningStateLabels[state]}
          onClick={() => onSelectState(state)}
        />
      ))}
    </SpeedDial>
  );
};

export default LearningStateSelector;
