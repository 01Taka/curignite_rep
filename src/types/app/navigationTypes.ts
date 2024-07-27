import { ReactNode } from "react";
import { HeightValueClasses, WidthValueClasses } from "../module/tailwindTypes";

export interface NavigationItems {
    path: string | string[];
    exclusionPaths?: string[];
    pathParameters?: boolean;
    topBar?: TopBarProps;
    contentsTopBar?: ContentsTopBarProps;
    contentsBottomBar?: ContentsBottomBarProps;
    sideList?: SideListProps;
    sideBar?: SideBarProps;
    fab?: FloatingActionButtonProps;
}

export interface FreeContentsNavigation {
    children: ReactNode | null;
}

export interface TopBarProps extends FreeContentsNavigation {
    height?: HeightValueClasses;
}

export interface ContentsTopBarProps extends FreeContentsNavigation {
    height?: HeightValueClasses;
    bgTransparent?: boolean;
}

export interface ContentsBottomBarProps extends FreeContentsNavigation {
    height?: HeightValueClasses;
}

export interface SideListProps extends FreeContentsNavigation {
    width?: WidthValueClasses;
}
  
export interface SideBarItem {
    icon: ReactNode;
    text: string;
    action: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
export interface SideBarProps {
    elements: SideBarItem[];
    width?: WidthValueClasses;
}
  
export interface FabItem {
    icon: ReactNode;
    action: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
export interface FloatingActionButtonProps {
    icon: ReactNode;
    elements?: FabItem[];
    action?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
  