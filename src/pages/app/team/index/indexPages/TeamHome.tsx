import React, { FC } from 'react'
import { useNavigate } from 'react-router-dom';
import { teamPaths } from '../../../../../types/path/appPaths';
import TeamHomeView from '../../../../../features/app/team/index/home/TeamHomeView';

const TeamHome: FC = () => {
  const navigate = useNavigate();

  const handleToJoinCreatePage = () => {
    navigate(teamPaths.joinCreate);
  }

  return <TeamHomeView
    toJoinCreatePage={handleToJoinCreatePage}
  />
}

export default TeamHome