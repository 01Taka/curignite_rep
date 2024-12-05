import { useCallback, useMemo } from "react";
import { UseMultipleNavigationTabReturnType, UseNavigationTabReturnType } from "./shared/types/useLocationTabTypes";
import { objectArrayToDict } from "../../../functions/utils/objectUtils";
import { NavigateOptions } from "react-router-dom";

const useMultipleLocationTab = (
  args: { id: string, useLocationTabs: UseNavigationTabReturnType, navOptions?: NavigateOptions }[]
): UseMultipleNavigationTabReturnType => {
  const argsMap = useMemo(() => {
    return objectArrayToDict(args, "id");
  }, [args]);

  const getTabsElement = useCallback((id: string) => {
    const target = argsMap[id];
    if (target) {
      return target.useLocationTabs.TabsElement;
    };
    return undefined;
  }, [argsMap]);

  const navigateById = useCallback((elementId: string) => {
    for (const id in argsMap) {
      const element = argsMap[id].useLocationTabs.navigateById(elementId, argsMap[id].navOptions);
      if (element) return element;
    }
    return undefined;
  }, [argsMap]);  

  const selectedElement = useMemo(() => {
    const item = args.find(target => !!target.useLocationTabs.selectedItem);
    return item && item.useLocationTabs.selectedItem ? { groupId: item.id, item: item.useLocationTabs.selectedItem } : undefined;
  }, [args]);

  return { getTabsElement, navigateById, selectedElement };
}

export default useMultipleLocationTab