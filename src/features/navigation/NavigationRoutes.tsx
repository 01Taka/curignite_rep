import { NavigationItems } from '../../types/app/navigationTypes';
import { teamDesktopNavigation, teamMobileNavigation } from '../../features/app/team/navigation/teamNavigationConfig';

export const onDesktopNavigationItems: NavigationItems[] = [
  ...teamDesktopNavigation,
];

export const onMobileNavigationItems: NavigationItems[] = [
  ...teamMobileNavigation,
];
