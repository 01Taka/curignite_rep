import React, { FC, useEffect } from 'react';
import { Typography } from '@mui/material';
import useActiveMembers from './hooks/useActiveMembers';
import UserCard from '../user/UserCard';

const ActiveMembers: FC = () => {
  const { activeMemberMap, loading, error, updateSameTeamMembersId } = useActiveMembers();

  useEffect(() => {
    updateSameTeamMembersId();
  }, [updateSameTeamMembersId]);

  if (loading) return <Typography>ロード中...</Typography>;
  if (error) return <Typography>エラーが発生しました: {error}</Typography>;

  return (
    <div className='flex flex-col items-center mt-8 w-full'>
      <Typography variant="h4">現在学習中のメンバーたち</Typography>
      {Object.keys(activeMemberMap).length === 0 ? (
        <Typography>現在アクティブなメンバーはいません。</Typography>
      ) : (
        <ul className='w-full max-w-xl'>
          {Object.keys(activeMemberMap).map((key) => {
            const user = activeMemberMap[key];
            if (!user) return null;
            return (
              <div key={key} className='w-full'>
                <UserCard user={user}/>
              </div>
            )
          })}
        </ul>
      )}
    </div>
  );
};

export default ActiveMembers;
