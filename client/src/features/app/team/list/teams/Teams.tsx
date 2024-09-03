import React, { FC, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import TeamsList from './TeamsList';
import { useNavigate } from 'react-router-dom';
import { dictToArrayWithRevertTimestampConversion } from '../../../../../functions/db/dataFormatUtils';
import { navigateToTeamHome } from '../../../../../redux/actions/team/teamActions';
import { TeamData } from '../../../../../types/firebase/db/team/teamStructure';

const Teams: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { uid } = useAppSelector(state => state.userSlice);
  const { teams, currentTeamId } = useAppSelector(state => state.teamSlice);

  const convertedTeams = useMemo(() => dictToArrayWithRevertTimestampConversion(teams), [teams]);

  const setDisplayTeam = (teamId: string) => {
    navigateToTeamHome(teamId, dispatch, navigate);
  };

  return (
    <>
      <TeamsList
        teams={convertedTeams}
        currentUserId={uid || ""}
        currentDisplayTeamId={currentTeamId}
        onTeamClick={(data: TeamData) => setDisplayTeam(data.docId)}
      />
    </>
  );
};

export default Teams;
