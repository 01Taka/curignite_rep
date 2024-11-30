import { ReactNode } from "react";
import { NavigateOptions } from "react-router-dom";
import { PathStructure } from "../../../../../types/app/pathTypes";

export type UseLocationTabItem = {
  id?: string;
  path: PathStructure;
  label: string;
  element: ReactNode;
};

export type UseLocationTabReturnType = {
  RouteElement: JSX.Element; // ルート要素
  TabsElement: JSX.Element;  // タブ要素
  selectedItem: UseLocationTabItem | undefined;
  navigateById: (id: string, navOptions?: NavigateOptions) => UseLocationTabItem | undefined;
};

export type UseMultipleLocationTabReturnType = {
  getRouteElement: (id: string) => JSX.Element | undefined;
  getTabsElement: (id: string) => JSX.Element | undefined;
  navigateById: (elementId: string) => UseLocationTabItem | undefined;
  selectedElement: {
    groupId: string;
    item: UseLocationTabItem;
  } | undefined;
};
