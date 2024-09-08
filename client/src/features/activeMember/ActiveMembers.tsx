import React, { useEffect } from 'react';
import useActiveMembers from './hooks/useActiveMembers';
import { Typography } from '@mui/material';


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
          {Object.keys(activeMemberMap).map((key) => (
            <li key={key}>
              <Typography>
                {activeMemberMap[key].name} ({activeMemberMap[key].email})
              </Typography>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActiveMembers;
