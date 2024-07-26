import React, { FC } from 'react'
import TeamHomeView from './TeamHomeView'
import { useNavigate } from 'react-router-dom'
import { teamPaths } from '../../../../types/path/appPaths';

const TeamHome: FC = () => {
  const navigate = useNavigate();

  const handleToJoinPage = () => {
    navigate(teamPaths.join);
  }

  return <TeamHomeView 
    toJoinPage={handleToJoinPage}
  />
}

export default TeamHome