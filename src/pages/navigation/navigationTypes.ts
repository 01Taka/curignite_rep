import { ReactNode } from "react";
import { HeightValueClasses, WidthValueClasses } from "../../types/app/appTypes";

export interface NavigationItems {
    path: string;
    pathParameters?: boolean;
    topBar?: TopBarProps;
    sideList?: SideListProps;
    bottomBar?: BottomBarProps;
    sideBar?: SideBarProps;
    fab?: FloatingActionButtonProps;
}
  

export interface TopBarProps {
    children: ReactNode;
    height?: HeightValueClasses;
}
  
export interface SideListProps {
    children: ReactNode;
    width?: WidthValueClasses;
}

export interface BottomBarProps {
    children: ReactNode;
    height?: HeightValueClasses;
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
  