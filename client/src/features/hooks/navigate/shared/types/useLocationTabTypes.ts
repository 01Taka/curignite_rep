import { NavigateOptions } from "react-router-dom";
import { PathStructure } from "../../../../../types/app/pathTypes";

export interface UseNavigationTabItem {
  id?: string;
  path: PathStructure;
  label: string;
};

export interface UseNavigationTabReturnType {
  TabsElement: JSX.Element;  // タブ要素
  selectedItem: UseNavigationTabItem | undefined;
  navigateById: (id: string, navOptions?: NavigateOptions) => UseNavigationTabItem | undefined;
};

export interface UseMultipleNavigationTabReturnType {
  getTabsElement: (id: string) => JSX.Element | undefined;
  navigateById: (elementId: string) => UseNavigationTabItem | undefined;
  selectedElement: {
    groupId: string;
    item: UseNavigationTabItem;
  } | undefined;
};
