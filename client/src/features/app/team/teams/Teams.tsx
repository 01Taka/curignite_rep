import React, { FC, useEffect, useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { TeamData } from '../../../../types/firebase/db/team/teamsTypes';
import TeamsList from './TeamsList';
import { teamPaths } from '../../../../types/path/mainPaths';
import { useNavigate } from 'react-router-dom';
import { setCurrentTeamId } from '../../../../redux/slices/team/teamSlice';
import { dictToArrayWithRevertTimestampConversion } from '../../../../functions/db/dataFormatUtils';
import { replaceParams } from '../../../../functions/path/pathUtils';
import { PathParam } from '../../../../types/path/paths';
import { Member } from '../../../../types/firebase/db/baseTypes';
import { DocumentIdMap } from '../../../../types/firebase/db/formatTypes';
import serviceFactory from '../../../../firebase/db/factory';

const Teams: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { uid } = useAppSelector(state => state.userSlice);
  const { teams, currentTeamId } = useAppSelector(state => state.teamSlice);

  const convertedTeams = useMemo(() => dictToArrayWithRevertTimestampConversion(teams), [teams]);

  const [learningMembersMap, setLearningMembersMap] = useState<DocumentIdMap<Member[]>>({});
  const [error, setError] = useState<string | null>(null);

  const updateLearningMembersMap = useCallback(async () => {
    if (uid && convertedTeams) {
      try {
        const teamService = serviceFactory.createTeamService();
        const members = await teamService.getLearningMemberMap(convertedTeams.map(team => team.docId));
        setLearningMembersMap(members);
      } catch (err) {
        console.error('Failed to fetch learning members map:', err);
        setError('Failed to fetch learning members map');
      }
    }
  }, [uid, convertedTeams]);

  useEffect(() => {
    updateLearningMembersMap();
  }, [updateLearningMembersMap]);

  const setDisplayTeam = (teamId: string) => {
    dispatch(setCurrentTeamId(teamId));
    navigate(replaceParams(teamPaths.homeChildren.participants, { [PathParam.TeamId]: teamId }));
  };

  return (
    <>
      {error && <div className="text-red-500">{error}</div>}
      <TeamsList
        teams={convertedTeams}
        learningMembersMap={learningMembersMap}
        currentUserId={uid || ""}
        currentDisplayTeamId={currentTeamId}
        onTeamClick={(data: TeamData) => setDisplayTeam(data.docId)}
      />
    </>
  );
};

export default Teams;
