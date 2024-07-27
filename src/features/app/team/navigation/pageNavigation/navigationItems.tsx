import { TeamPages } from "../../../../../pages/app/team/index/TeamIndex";
import { NavigationItem } from "../../../../../types/path/path";
import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';

export const navigationItems: NavigationItem<TeamPages>[] = [
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