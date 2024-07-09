import React, { FC, useEffect, useState } from 'react'
import TeamView, { TeamInfo } from './TeamView'
import TeamsDB from '../../../../firebase/db/app/team/teams';
import { useAppSelector } from '../../../../redux/hooks';

const Team: FC = () => {
  const userData  = useAppSelector(state => state.userDataSlice);
  const initialState: TeamInfo[] = [{teamName: "", iconPath: "", participantsName: [], myTeam: false}]
  const [teamInfoList, setTeamInfoList] = useState<TeamInfo[]>(initialState);

  useEffect(() => {
    const getTeamInfo = async() => {
      const user = userData.userData;
      const teams = new TeamsDB();
      teams.getAll();
    };
  }, [])
  return <TeamView 
    teamInfoList={teamInfoList}
  />
}

export default Team