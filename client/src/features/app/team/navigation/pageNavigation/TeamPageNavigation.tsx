import React, { FC } from 'react'
import TeamPageNavigationView from './TeamPageNavigationView'
import { TeamPages } from '../../../../../pages/app/team/index/TeamIndex';
import { useAppDispatch } from '../../../../../redux/hooks';
import { setDisplayTeamPage } from '../../../../../redux/slices/team/teamSlice';
import { navigationItems } from './navigationItems';

const TeamPageNavigation: FC = () => {
	const dispatch = useAppDispatch();

	const handleNavigation = (path: TeamPages) => {
		dispatch(setDisplayTeamPage(path));
	}

  return <TeamPageNavigationView
    navigationItems={navigationItems}
    onClickNavigation={handleNavigation}
  />
}

export default TeamPageNavigation