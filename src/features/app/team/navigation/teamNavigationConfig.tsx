import { teamPaths } from "../../../../types/path/appPaths";
import { NavigationItems } from "../../../../types/app/navigationTypes";
import TeamIndexNavigation from "./indexNavigation/TeamIndexNavigation";
import TeamNavigation from "./pageNavigation/TeamPageNavigation";

export const teamDesktopNavigation: NavigationItems[] = [
  {
    path: teamPaths.index,
    pathParameters: true,
    contentsTopBar: {
      children: <TeamNavigation />
    },
    sideList: {
      children: <TeamIndexNavigation />,
    },
  }
];

export const teamMobileNavigation: NavigationItems[] = [
  {
    path: teamPaths.index,
    exclusionPaths: [teamPaths.list],
    pathParameters: true,
    contentsTopBar: {
      children: <TeamNavigation />,
    },
  }
];
