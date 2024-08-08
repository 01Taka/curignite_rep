import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';
import TeamHomeView from '../../../../../features/app/team/index/home/TeamHomeView';
import { teamPaths } from '../../../../../types/path/mainPaths';

const TeamHome: FC = () => {
  const navigate = useNavigate();

  const handleToJoinCreatePage = () => {
    navigate(teamPaths.menu);
  }

  return <TeamHomeView
    toJoinCreatePage={handleToJoinCreatePage}
  />
}

export default TeamHome