import React, { useEffect, useState, useCallback } from 'react';
import serviceFactory from '../../../firebase/db/factory';
import { useAppSelector } from '../../../redux/hooks';
import { UserGoalData } from '../../../types/firebase/db/user/userStructure';
import { removeDuplicatesByKey } from '../../../functions/objectUtils';

const Goals = () => {
  const { uid, userData } = useAppSelector(state => state.userSlice);
  const [goals, setGoals] = useState<UserGoalData[]>([]);
  const [currentGoal, setCurrentGoal] = useState<UserGoalData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateGoals = useCallback(async () => {
    if (!uid) return;
    
    setLoading(true);
    setError(null);

    try {
      const goalService = serviceFactory.createUserGoalService();
      
      // 並行してデータを取得
      const [progressGoals, todayGoals] = await Promise.all([
        goalService.getAllProgressGoals(uid),
        goalService.getAllTodayGoals(uid)
      ]);

      const goalsData = [...progressGoals, ...todayGoals];
      const goals = removeDuplicatesByKey(goalsData, "docId");

      let currentGoal = null;
      if (userData?.currentTargetGoalId) {
        currentGoal = goals.find(goal => goal.docId === userData.currentTargetGoalId);
        
        // もし現在のゴールが見つからない場合、新たに取得
        if (!currentGoal) {
          currentGoal = await goalService.getGoal(uid, userData.currentTargetGoalId);
        }
      }

      setGoals(goals);
      setCurrentGoal(currentGoal);
    } catch (error) {
      console.error("Failed to update goals:", error);
      setError("ゴールの更新に失敗しました。");
    } finally {
      setLoading(false);
    }
  }, [uid, userData]);

  useEffect(() => {
    updateGoals();
  }, [updateGoals]);

  if (loading) {
    return <div>ロード中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Goals</h1>
      {goals.length === 0 ? (
        <p>ゴールがありません。</p>
      ) : (
        <ul>
          {goals.map(goal => (
            <div>
              A
              <div key={goal.docId}>{goal.objectives}</div>
            </div>
          ))}
        </ul>
      )}
      {currentGoal && <p>現在のゴール: {currentGoal.objectives}</p>}
    </div>
  );
}

export default Goals;
