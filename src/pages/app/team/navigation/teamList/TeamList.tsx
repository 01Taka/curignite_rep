import React, { FC } from 'react'
import TeamListView from './TeamListView';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { TeamInfo } from '../../../../../types/firebase/db/teamsTypes';
import { setCurrentDisplayTeam } from '../../../../../redux/slices/teamSlice';
import { deserializeTeamInfoArray, serializeTeamInfo } from '../../../../../functions/serialization/team/teamSerialization';
import { useNavigate } from 'react-router-dom';
import { paths } from '../../../../../types/path/appPaths';

const TeamList: FC = () => {
  const userData = useAppSelector(state => state.userDataSlice);
  const teamSlice = useAppSelector(state => state.teamSlice);
  const appSlice = useAppSelector(state => state.appSlice);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const setDisplayTeam = (team: TeamInfo) => {
    console.log("nav");
    dispatch(setCurrentDisplayTeam(serializeTeamInfo(team)));
    
    if (appSlice.isMobile) {
      navigate(paths.main.team.index);
      console.log("nav");
      
    }
  }

  return <TeamListView
    teamInfoList={deserializeTeamInfoArray(teamSlice.teams)}
    uid={userData.uid || ""}
    loading={teamSlice.teams.length === 0}
    onTeamClick={setDisplayTeam}
  />
}

export default TeamList