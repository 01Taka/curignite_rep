import React, { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { TeamData } from '../../../../types/firebase/db/team/teamsTypes';
import TeamsList from './TeamsList';
import { teamPaths } from '../../../../types/path/mainPaths';
import { useNavigate } from 'react-router-dom';
import { setCurrentTeamId } from '../../../../redux/slices/team/teamSlice';
import { dictToArrayWithRevertTimestampConversion } from '../../../../functions/db/dataFormatUtils';
import { replaceParams } from '../../../../functions/path/pathUtils';
import { PathParam } from '../../../../types/path/paths';

const Teams: FC = () => {
  const userData = useAppSelector(state => state.userSlice);
  const { teams, currentTeamId } = useAppSelector(state => state.teamSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const setDisplayTeam = (teamId: string) => {
    dispatch(setCurrentTeamId(teamId));
    navigate(replaceParams(teamPaths.homeChildren.participants, { [PathParam.TeamId]: teamId}))
  };

  return (
    <>
    <TeamsList
        teamDataList={dictToArrayWithRevertTimestampConversion(teams)}
        uid={userData.uid || ""}
        currentDisplayTeamId={currentTeamId}
        onTeamClick={(data: TeamData) => setDisplayTeam(data.docId)}
      />
    </>
  );
};

export default Teams;
