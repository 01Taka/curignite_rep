import { FC } from "react";
import { UserGoalData } from "../../../types/firebase/db/user/userStructure";
import GoalCard from "../goal/GoalCard";

interface GoalViewProps {
  goal: UserGoalData | null;
  loading: boolean;
}

const GoalView: FC<GoalViewProps> = ({ goal, loading }) => {
  if (loading) return <p>Loading Goal...</p>;
  if (!goal) return null;
  return (
    <div className='p-2'>
      <GoalCard goal={goal}/>
    </div>
  );
}

export default GoalView;