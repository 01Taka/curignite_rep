import React, { FC } from 'react'
import TeamNavigationView from './TeamNavigationView'
import { NavigationItem } from '../../../../../types/path/path'
import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import { TeamPages } from '../../team/Team';
import { useAppDispatch } from '../../../../../redux/hooks';
import { setDisplayTeamPage } from '../../../../../redux/slices/teamSlice';

const navigationItems: NavigationItem<TeamPages>[] = [
	{
		path: "participants",
		icon: <GroupsIcon />,
	},
	{
		path: "chat",
		icon: <ChatIcon />,
	},
	{
		path: "whiteboard",
		icon: <PictureInPictureIcon />,
	},
]

const TeamNavigation: FC = () => {
	const dispatch = useAppDispatch();

	const handleNavigation = (path: TeamPages) => {
		dispatch(setDisplayTeamPage(path));
	}

  return <TeamNavigationView
    navigationItems={navigationItems}
    onClickNavigation={handleNavigation}
  />
}

export default TeamNavigation