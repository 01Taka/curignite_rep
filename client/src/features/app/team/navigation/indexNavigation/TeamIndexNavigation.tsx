import React, { FC } from 'react'
import { useAppDispatch } from '../../../../../redux/hooks';
import { setDisplayTeamPage } from '../../../../../redux/slices/teamSlice';
import TeamIndexNavigationView from './TeamIndexNavigationView';

const TeamIndexNavigation: FC = () => {
  const dispatch = useAppDispatch();

  const handleToHome = () => {
    dispatch(setDisplayTeamPage("home"));
  }

  return <TeamIndexNavigationView
    toHome={handleToHome}
  />
}

export default TeamIndexNavigation