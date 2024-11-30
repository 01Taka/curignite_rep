import { useCallback, useMemo } from "react";
import { UseLocationTabReturnType, UseMultipleLocationTabReturnType } from "./shared/types/useLocationTabTypes";
import { objectArrayToDict } from "../../../functions/utils/objectUtils";
import { NavigateOptions } from "react-router-dom";

const useMultipleLocationTab = (
  args: { id: string, useLocationTabs: UseLocationTabReturnType, navOptions?: NavigateOptions }[]
): UseMultipleLocationTabReturnType => {
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

  const getRouteElement = useCallback((id: string) => {
    const target = argsMap[id];
    if (target) {
      return target.useLocationTabs.RouteElement;
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

  return { getRouteElement, getTabsElement, navigateById, selectedElement };
}

export default useMultipleLocationTab