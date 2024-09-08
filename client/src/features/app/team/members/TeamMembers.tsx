import React, { FC } from 'react';
import { useAppSelector } from '../../../../redux/hooks';
import { Typography, CircularProgress } from '@mui/material';
import UserProfileCard from '../../user/UserProfileCard';
import { useUserMap } from '../../../hooks/useUserMap';
import { useTeamMembers } from '../hooks/useTeamMembers';

interface TeamMembersProps {}

const TeamMembers: FC<TeamMembersProps> = () => {
  const teamId = useAppSelector(state => state.teamSlice.currentTeamId);
  const { members, loading: loadingMembers, error: errorMembers } = useTeamMembers(teamId);
  
  const userIds = members.map(member => member.docId);
  const { userMap, loading: loadingUsers, error: userError } = useUserMap(userIds);

  if (loadingMembers || loadingUsers) {
    return <CircularProgress />;
  }

  if (errorMembers || userError) {
    return <Typography color="error">Error: {errorMembers || userError}</Typography>;
  }

  return (
    <div>
      {members.length === 0 ? (
        <Typography>チームメンバーが存在しません。</Typography>
      ) : (
        members.map(member => {
          const user = userMap[member.docId];
          return (
            <div key={member.docId}>
              {user ? (
                <>
                  <UserProfileCard userData={user} />
                  <Typography>
                    {member.role}
                  </Typography>
                </>
              ) : (
                <Typography>ユーザーデータが見つかりませんでした。</Typography>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default TeamMembers;
