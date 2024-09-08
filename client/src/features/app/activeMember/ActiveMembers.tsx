import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import useActiveMembers from './hooks/useActiveMembers';
import UserCard from '../user/UserCard';

const ActiveMembers = () => {
  const { activeMemberMap, loading, error, updateSameTeamMembersId } = useActiveMembers();

  useEffect(() => {
    updateSameTeamMembersId();
  }, [updateSameTeamMembersId]);

  if (loading) return <Typography>ロード中...</Typography>;
  if (error) return <Typography>エラーが発生しました: {error}</Typography>;

  return (
    <div>
      <Typography variant="h6">アクティブメンバー</Typography>
      {Object.keys(activeMemberMap).length === 0 ? (
        <Typography>現在アクティブなメンバーはいません。</Typography>
      ) : (
        <ul>
          {Object.keys(activeMemberMap).map((key) => {
            const user = activeMemberMap[key];
            if (!user) return null;
            return (
              <div key={key}>
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
