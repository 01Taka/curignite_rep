import React, { FC, useEffect, useMemo, useState } from 'react';
import serviceFactory from '../../../../firebase/db/factory';
import { useAppSelector } from '../../../../redux/hooks';
import { Typography, CircularProgress } from '@mui/material';
import { TeamMemberData } from '../../../../types/firebase/db/team/teamStructure';
import UserProfileCard from '../../user/UserProfileCard';
import { useUserMap } from '../../../hooks/useUserMap';

interface TeamMembersProps {}

const TeamMembers: FC<TeamMembersProps> = () => {
  const teamId = useAppSelector(state => state.teamSlice.currentTeamId);
  const [members, setMembers] = useState<TeamMemberData[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);
  const [errorMembers, setErrorMembers] = useState<string | null>(null);
  
  const userIds = members.map(member => member.docId);
  const { userMap, loading: loadingUsers, error: userError } = useUserMap(userIds);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoadingMembers(true);
      setErrorMembers(null);
      
      try {
        const memberService = serviceFactory.createTeamMemberService();
        const fetchedMembers = await memberService.getAllMembers(teamId);
        setMembers(fetchedMembers);
      } catch (err) {
        console.error("Failed to fetch team members:", err);
        setErrorMembers("Failed to fetch team members.");
      } finally {
        setLoadingMembers(false);
      }
    };

    if (teamId) {
      fetchMembers();
    }
  }, [teamId]);

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
