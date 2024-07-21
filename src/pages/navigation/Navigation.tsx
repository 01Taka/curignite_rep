import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { FreeContentsNavigation, NavigationItems } from "./navigationTypes";
import { useAppSelector } from "../../redux/hooks";
import TopBar from "./topBar/TopBar";
import ContentsTopBar from "./contentsTopBar/ContentsTopBar";
import ContentsBottomBar from "./contentsBottomBar/ContentsBottomBar";
import SideBar from "./sideBar/SideBar";
import SideList from "./sideList/SideList";
import FloatingActionButton from "./floatingActionButton/FloatingActionButton";
import { onDesktopNavigationItems, onMobileNavigationItems } from "./NavigationRoutes";

interface NavigationProps {
  children: ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  const appSlice = useAppSelector(state => state.appSlice);
  const location = useLocation();
  const mobileMode = appSlice.isMobile;
  const navigationItems = mobileMode ? onMobileNavigationItems : onDesktopNavigationItems;

  const checkPathMatch = (currentPath: string, targetPath: string | string[], pathParameters = false, exclusionPaths: string[] = []): boolean => {
    if (Array.isArray(targetPath)) {
      return targetPath.some(target => (pathParameters ? currentPath.startsWith(target) : currentPath === target) && !exclusionPaths.includes(currentPath));
    } else {
      return (pathParameters ? currentPath.startsWith(targetPath) : currentPath === targetPath) && !exclusionPaths.includes(currentPath);
    }
  };  

  const renderFreeContentsNavigation = (Element: React.FC<FreeContentsNavigation>, props?: FreeContentsNavigation) => {
    return (props && props.children) ? <Element {...props} /> : null;
  };

  const getNavigationItems = (path: string, navigationItems: NavigationItems[]): ReactNode => {
    const matchedItem = navigationItems.find(item => checkPathMatch(path, item.path, item.pathParameters, item.exclusionPaths));
    if (!matchedItem) return children;

    return (
      <>
        {renderFreeContentsNavigation(TopBar, matchedItem.topBar)}
        <div className="flex flex-grow overflow-auto">
          {
            matchedItem.sideBar && matchedItem.sideBar.elements &&
            <SideBar {...matchedItem.sideBar} />
          }
          {renderFreeContentsNavigation(SideList, matchedItem.sideList)}
          <div className="flex flex-col flex-grow">
            {renderFreeContentsNavigation(ContentsTopBar, matchedItem.contentsTopBar)}
            <div className="flex-grow w-full h-screen overflow-auto">
              {children}
              {renderFreeContentsNavigation(ContentsBottomBar, matchedItem.contentsBottomBar)}
            </div>
            {
              matchedItem.fab && matchedItem.fab.icon &&
              <FloatingActionButton {...matchedItem.fab} />
            }
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col w-screen h-screen">
      {getNavigationItems(location.pathname, navigationItems)}
    </div>
  );
};

export default Navigation;
