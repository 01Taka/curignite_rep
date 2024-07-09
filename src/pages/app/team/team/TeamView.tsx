import React, { FC } from 'react'
import TeamContainer from './TeamContainer'

export interface TeamInfo {
  teamName: string;
  iconPath: string;
  participantsName: string[];
  myTeam: boolean;
}

interface TeamViewProps {
  teamInfoList: TeamInfo[];
}

const TeamView: FC<TeamViewProps> = ({ teamInfoList }) => {
  return (
    <div>
      {teamInfoList.map((info, index) => (
        <TeamContainer teamName={info.teamName} iconPath={info.iconPath} participantsName={info.participantsName} myTeam={info.myTeam}/>
      ))}
    </div>
  )
}

export default TeamView