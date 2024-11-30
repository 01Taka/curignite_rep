import { ReactNode } from "react";
import { NavigateOptions } from "react-router-dom";
import { PathStructure } from "../../../../../types/app/pathTypes";

export interface UseLocationTabChildren {
  path: PathStructure;
  element: ReactNode;
} 

export interface UseLocationTabItem {
  id?: string;
  path: PathStructure;
  label: string;
  element: ReactNode;
  children?: UseLocationTabChildren | UseLocationTabChildren[];
};

export interface UseLocationTabReturnType {
  RouteElement: JSX.Element; // ルート要素
  TabsElement: JSX.Element;  // タブ要素
  selectedItem: UseLocationTabItem | undefined;
  navigateById: (id: string, navOptions?: NavigateOptions) => UseLocationTabItem | undefined;
};

export interface UseMultipleLocationTabReturnType {
  getRouteElement: (id: string) => JSX.Element | undefined;
  getTabsElement: (id: string) => JSX.Element | undefined;
  navigateById: (elementId: string) => UseLocationTabItem | undefined;
  selectedElement: {
    groupId: string;
    item: UseLocationTabItem;
  } | undefined;
};
