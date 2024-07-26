import React, { FC } from 'react'
import TeamListView from './TeamListView';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { TeamData } from '../../../../../types/firebase/db/teamsTypes';
import { setCurrentDisplayTeam } from '../../../../../redux/slices/teamSlice';
import { deserializeTeamDataArray, serializeTeamData } from '../../../../../functions/serialization/team/teamSerialization';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../../types/path/appPaths';
import { isMobileMode } from '../../../../../functions/utils';

const TeamList: FC = () => {
  const userData = useAppSelector(state => state.userDataSlice);
  const teamSlice = useAppSelector(state => state.teamSlice);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const setDisplayTeam = (team: TeamData) => {
    dispatch(setCurrentDisplayTeam(serializeTeamData(team)));
    
    if (isMobileMode()) {
      navigate(paths.main.team.index);
    }
  }

  return <TeamListView
    teamDataList={deserializeTeamDataArray(teamSlice.teams)}
    uid={userData.uid || ""}
    currentDisplayTeamId={teamSlice.currentDisplayTeam?.documentId}
    requestState={teamSlice.requestState}
    onTeamClick={setDisplayTeam}
  />
}

export default TeamList