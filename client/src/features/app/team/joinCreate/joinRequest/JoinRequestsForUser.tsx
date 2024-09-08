import React, { FC, useCallback, useEffect, useState, memo } from 'react';
import serviceFactory from '../../../../../firebase/db/factory';
import { useAppSelector } from '../../../../../redux/hooks';
import { CircularProgress, Typography, List, Button } from '@mui/material';
import { format } from 'date-fns';
import { TeamData } from '../../../../../types/firebase/db/team/teamStructure';
import { DocumentIdMap } from '../../../../../types/firebase/db/formatTypes';
import { JoinRequestStatusColors, JoinRequestStatusLabels } from '../../../../../constants/label/JoinRequestLabels';
import { UserTeamData } from '../../../../../types/firebase/db/user/userStructure';

const JoinRequestItem: FC<{
  request: UserTeamData;
  team: TeamData;
  onJoinTeam: (teamId: string) => void;
}> = memo(({ request, team, onJoinTeam }) => {
  return (
    <div key={request.docId} className="flex justify-center items-center space-x-4 my-2 shadow rounded w-full max-w-md h-20">
      <div>
        <div>{team.teamName}へのリクエスト</div>
        <div>At: {format(request.requestedAt.toDate(), 'M/d HH:mm')}</div>
      </div>
      <div className="flex justify-center items-center">
        <div className="mr-2">状態</div>
        <div
          className="flex justify-center items-center w-20 h-8 p-2 rounded"
          style={{ backgroundColor: JoinRequestStatusColors[request.status] }}
        >
          {JoinRequestStatusLabels[request.status]}
        </div>
      </div>
      {request.status === 'allowed' && (
        <Button
          variant="contained"
          color="primary"
          className="flex justify-center items-center w-24 h-10 p-2 rounded"
          onClick={() => onJoinTeam(request.docId)}
        >
          参加する
        </Button>
      )}
    </div>
  );
});

const JoinRequestsForUser: FC = () => {
  const uid = useAppSelector((state) => state.userSlice.uid);
  const [teamMap, setTeamMap] = useState<DocumentIdMap<TeamData>>({});
  const [userTeams, setUserTeams] = useState<UserTeamData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateUserTeams = useCallback(async () => {
    if (!uid) return;
    setLoading(true);
    setError(null);

    try {
      const userTeamService = serviceFactory.createUserTeamService();
      const teamService = serviceFactory.createTeamService();
      const teams = await userTeamService.getAllUserTeams(uid);
      const teamMap = await teamService.getTeamDataMap(teams.map((team) => team.docId));
      setUserTeams(teams);
      setTeamMap(teamMap);
    } catch (err: any) {
      console.error('Error fetching user teams:', err);
      setError(err.message || 'Failed to load user join requests.');
    } finally {
      setLoading(false);
    }
  }, [uid]);

  const handleJoinTeam = useCallback(
    async (teamId: string) => {
      if (uid) {
        try {
          const teamService = serviceFactory.createTeamService();
          const success = await teamService.tryBecomeMember(uid, teamId);
          if (!success) {
            setError('Failed to join the team.');
          }
        } catch (err: any) {
          console.error('Error joining the team:', err);
          setError('Failed to join the team.');
        }
      }
    },
    [uid]
  );

  useEffect(() => {
    updateUserTeams();
  }, [updateUserTeams]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className='p-4'>
      <Typography variant="h6" gutterBottom>
        参加リクエスト中のチーム
      </Typography>
      {userTeams.filter(team => !team.isMember).length === 0 ? (
        <Typography>参加リクエスト中のチームはありません</Typography>
      ) : (
        <List>
          {userTeams.filter(team => !team.isMember).map((request) => {
            const team = teamMap[request.docId];
            if (team.createdById === uid) return null;
            
            return team ? (
              <JoinRequestItem key={request.docId} request={request} team={team} onJoinTeam={handleJoinTeam} />
            ) : null;
          })}
        </List>
      )}
    </div>
  );
};

export default JoinRequestsForUser;
