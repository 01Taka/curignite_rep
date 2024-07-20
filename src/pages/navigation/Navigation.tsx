import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import TopBar from "./topBar/TopBar";
import SideList from "./sideList/SideList";
import BottomBar from "./bottomBar/BottomBar";
import { onDesktopNavigationItems, onMobileNavigationItems } from "./NavigationRoutes";
import { NavigationItems } from "./navigationTypes";
import SideBar from "./sideBar/SideBar";
import FloatingActionButton from "./floatingActionButton/FloatingActionButton";
import { useAppSelector } from "../../redux/hooks";

interface NavigationProps {
  children: ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const appSlice = useAppSelector(state => state.appSlice);
  const location = useLocation();
  const mobileMode = appSlice.isMobile;
  const navigationItems = mobileMode ? onMobileNavigationItems : onDesktopNavigationItems;

  const checkPathMatch = (currentPath: string, targetPath: string, pathParameters?: boolean): boolean => {
    return pathParameters ? currentPath.startsWith(targetPath) : currentPath === targetPath;
  };

  const getNavigationItems = (path: string, navigationItems: NavigationItems[]): ReactNode => {
    const matchedItem = navigationItems.find(item => checkPathMatch(path, item.path, item.pathParameters));
    if (!matchedItem) return children;

    return (
      <>
        {matchedItem.topBar && <TopBar {...matchedItem.topBar}/>}
        <div className="flex flex-grow">
          {matchedItem.sideBar && <SideBar {...matchedItem.sideBar} />}
          {matchedItem.sideList && <SideList {...matchedItem.sideList}/>}
          {matchedItem.fab && <FloatingActionButton {...matchedItem.fab} />}
          <div className="flex flex-col flex-grow">
            <div className="flex-grow">{children}</div>
            {matchedItem.bottomBar && <BottomBar {...matchedItem.bottomBar}/>}
          </div>
        </div>
      </>
    );
  };

  return <div className="flex flex-col w-screen h-screen">{getNavigationItems(location.pathname, navigationItems)}</div>;
};

export default Navigation;
