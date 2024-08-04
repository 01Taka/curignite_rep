import React, { FC } from 'react';
import TeamsView from './TeamsView';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { TeamData } from '../../../../types/firebase/db/team/teamsTypes';
import { setCurrentDisplayTeam } from '../../../../redux/slices/teamSlice';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../types/path/appPaths';
import { isMobileMode } from '../../../../functions/utils';
import { convertTimestampsToNumbers, revertTimestampConversion } from '../../../../functions/db/dbUtils';

const Teams: FC = () => {
  const userData = useAppSelector(state => state.userDataSlice);
  const teamSlice = useAppSelector(state => state.teamSlice);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const setDisplayTeam = (team: TeamData) => {
    dispatch(setCurrentDisplayTeam(convertTimestampsToNumbers(team)));
    
    if (isMobileMode()) {
      navigate(paths.main.team.index);
    }
  };

  return (
    <TeamsView
      teamDataList={revertTimestampConversion(teamSlice.teams)}
      uid={userData.uid || ""}
      currentDisplayTeamId={teamSlice.currentDisplayTeam?.docId}
      requestState={teamSlice.requestState}
      onTeamClick={setDisplayTeam}
    />
  );
};

export default Teams;
