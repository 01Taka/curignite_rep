import React, { FC, useCallback, useEffect, useState } from 'react';
import { HelpAndAnswersWithFileUrls, UserGoalData, UserWithSupplementary } from '../../../types/firebase/db/user/userStructure';
import UserProfileCard from './UserProfileCard';
import serviceFactory from '../../../firebase/db/factory';
import { Divider } from '@mui/material';
import HelpView from './HelpView';
import GoalView from './GoalView';
import Tag from './Tag';

interface UserCardProps {
  user: UserWithSupplementary;
}

const UserCard: FC<UserCardProps> = ({ user }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [goal, setGoal] = useState<UserGoalData | null>(null);
  const [helpAndAnswerInfo, setHelpAndAnswerInfo] = useState<HelpAndAnswersWithFileUrls[] | null>(null);
  const [loading, setLoading] = useState(false);

  const goalIndex = 0;
  const helpIndex = 1;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (!goal && user.currentTargetGoalId) {
        const goalService = serviceFactory.createUserGoalService();
        const fetchedGoal = await goalService.getGoal(user.docId, user.currentTargetGoalId);
        setGoal(fetchedGoal);
      }

      if (!helpAndAnswerInfo) {
        const helpService = serviceFactory.createUserHelpService();
        const fetchedHelps = await helpService.getAllHelpAndAnswersWithFileUrls(user.docId);
        setHelpAndAnswerInfo(fetchedHelps);
        if (fetchedHelps && fetchedHelps.length !== 0) setCurrentIndex(helpIndex);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [currentIndex, goal, helpAndAnswerInfo, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const contents = [
    <GoalView key="goal" goal={goal} loading={loading} />,
    <HelpView key="help" helpAndAnswerInfo={helpAndAnswerInfo} loading={loading} />
  ];

  return (
    <div className='flex my-4 w-full'>
      <div className='flex flex-col w-full shadow-lg p-4 pb-2 bg-white rounded-lg'>
        <UserProfileCard userData={user} />
        <div>
          {currentIndex !== null && (
            <div>
              <Divider className='pt-4'/>
              {contents[currentIndex]}
            </div>
          )}
        </div>
      </div>
      <div>
        <Tag label='目標' color='#f2e11f' index={goalIndex} currentIndex={currentIndex} hidden={!goal} setIndex={setCurrentIndex} />
        <Tag label='HELP!' color='#fa147b' index={helpIndex} currentIndex={currentIndex} hidden={!helpAndAnswerInfo || helpAndAnswerInfo.length === 0} setIndex={setCurrentIndex} />
      </div>
    </div>
  );
}

export default UserCard;
