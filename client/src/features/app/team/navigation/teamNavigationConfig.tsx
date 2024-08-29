import { NavigationItems } from "../../../../types/app/navigationTypes";
import { teamPaths } from "../../../../types/path/mainPaths";
import TeamIndexNavigation from "./TeamIndexNavigation";
import TeamNavigation from "./pageNavigation/TeamPageNavigation";

export const teamDesktopNavigation: NavigationItems[] = [
  {
    path: [`${teamPaths.base}/home`],
    pathParameters: true,
    contentsTopBar: {
      children: <TeamNavigation />
    },
    sideList: {
      children: <TeamIndexNavigation />,
    },
  },
  {
    path: [`${teamPaths.base}/home`, teamPaths.menu],
    pathParameters: true,
    sideList: {
      children: <TeamIndexNavigation />,
    },
  },

];

export const teamMobileNavigation: NavigationItems[] = [
  {
    path: teamPaths.base,
    exclusionPaths: [teamPaths.list],
    pathParameters: true,
    contentsTopBar: {
      children: <TeamNavigation />,
    },
  }
];
