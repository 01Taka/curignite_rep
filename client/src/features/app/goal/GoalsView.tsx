import { FC } from "react";
import { UserGoalData } from "../../../types/firebase/db/user/userStructure";
import { IconButton, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import GoalCard from "./GoalCard";

interface GoalsViewProps {
  currentGoal: UserGoalData | null;
  goals: UserGoalData[];
  showOtherGoals: boolean;
  toggleOtherGoals: () => void;
}

const GoalsView: FC<GoalsViewProps> = ({ currentGoal, goals, showOtherGoals, toggleOtherGoals }) => (
  <>
    {currentGoal && (
      <div>
        <div className='flex items-center'>
          <Typography variant="h6" className='pl-4'>現在のゴール</Typography>
          {goals.length > 0 && (
            <IconButton onClick={toggleOtherGoals}>
              {showOtherGoals ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </div>
        <GoalCard goal={currentGoal} />
      </div>
    )}

    {showOtherGoals && (
      <div className='shadow-md p-4 mt-4'>
        <Typography variant='h6'>その他のゴール</Typography>
        <ul>
          {goals.filter(goal => goal.docId !== currentGoal?.docId).map(goal => (
            <GoalCard key={goal.docId} goal={goal} />
          ))}
        </ul>
      </div>
    )}

    {!currentGoal && goals.length === 0 && <p>ゴールがありません。</p>}
  </>
);

export default GoalsView;