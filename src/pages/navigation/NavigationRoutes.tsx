import { teamDesktopNavigation, teamMobileNavigation } from '../app/team/TeamRoutes';
import { NavigationItems } from './navigationTypes';

export const onDesktopNavigationItems: NavigationItems[] = [
  ...teamDesktopNavigation,
];

export const onMobileNavigationItems: NavigationItems[] = [
  ...teamMobileNavigation,
];
