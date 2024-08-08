import { NavigationItem } from "../../../../../types/path/paths";
import GroupsIcon from '@mui/icons-material/Groups';
import ChatIcon from '@mui/icons-material/Chat';
import PictureInPictureIcon from '@mui/icons-material/PictureInPicture';
import { TeamHomePages } from "../../../../../types/app/team/teamTypes";

export const navigationItems: NavigationItem<TeamHomePages>[] = [
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