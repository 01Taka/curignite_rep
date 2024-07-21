import React, { FC, useEffect } from 'react'
import TeamNavigationView from './TeamNavigationView'
import { useNavigate } from 'react-router-dom'
import { NavigationItem } from '../../../../../types/path/path'
import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import { useAppSelector } from '../../../../../redux/hooks';

const navigationItems: NavigationItem[] = [
	{
		path: "users",
		icon: <GroupsIcon />,
	},
	{
		path: "chat",
		icon: <ChatIcon />,
	},
	{
		path: "whiteboard",
		icon: <PictureInPictureIcon />,
	}
]

const TeamNavigation: FC = () => {
	const navigate = useNavigate();
	const teamSlice = useAppSelector(state => state.teamSlice);
	
	const handleNavigation = (path: string) => {
			navigate(path);
	}

  return <TeamNavigationView
    navigationItems={navigationItems}
    onClickNavigation={handleNavigation}
  />
}

export default TeamNavigation