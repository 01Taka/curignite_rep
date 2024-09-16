import { FC } from "react";
import GoalCard from "../goal/LearingGoalCard";
import { UserLearningGoalData } from "../../../types/firebase/db/user/userStructure";

interface GoalViewProps {
  goal: UserLearningGoalData | null;
  loading: boolean;
}

const GoalView: FC<GoalViewProps> = ({ goal, loading }) => {
  if (loading) return <p>Loading Goal...</p>;
  if (!goal) return null;
  return (
    <div className='p-2 w-full'>
      <GoalCard learningGoal={goal}/>
    </div>
  );
}

export default GoalView;