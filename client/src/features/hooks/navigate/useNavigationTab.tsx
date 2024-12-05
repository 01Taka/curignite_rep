import { Tabs, Tab } from "@mui/material";
import { useMemo, useCallback } from "react";
import { NavigateOptions, useLocation, useNavigate } from "react-router-dom";
import { removeParam } from "../../../functions/utils/pathUtils";
import { UseNavigationTabItem, UseNavigationTabReturnType } from "./shared/types/useLocationTabTypes";

const useNavigationTab = (
  items: UseNavigationTabItem[],
  options?: Partial<{
    defaultAbsPath: string;
    navigateOptions: NavigateOptions;
    tabsProps: Omit<React.ComponentProps<typeof Tabs>, "value" | "onChange">;
    tabProps: Omit<React.ComponentProps<typeof Tab>, "label" | "value">;
    onTabChange?: (newValue: string) => void;
  }>
): UseNavigationTabReturnType => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // ルートパスからパラメータを削除した値を一度だけ計算
  const cleanedPathname = removeParam(pathname);
  const removeParamPaths = useMemo(() => {
    return items.map(item => removeParam(item.path._abs));
  }, [items]);

  const selectedItem = useMemo(() => {
    return items.find(item => item.path._abs === pathname);
  }, [items, pathname]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    // onTabChangeの呼び出しを先に行い、navigateを後で呼び出す
    options?.onTabChange?.(newValue); 
    navigate(newValue, options?.navigateOptions ?? {});
  };

  const TabsElement = useMemo(() => {
    if (!removeParamPaths.includes(cleanedPathname)) {
      return <></>;
    }

    return (
      <Tabs
        value={cleanedPathname}
        onChange={handleChange}
        centered
        {...options?.tabsProps}
      >
        {items.map((item, index) => (
          <Tab
            key={index}
            label={item.label}
            value={removeParam(item.path._abs)}
            {...options?.tabProps}
          />
        ))}
      </Tabs>
    );
  }, [items, cleanedPathname, removeParamPaths, options, handleChange]);

  const navigateById = useCallback(
    (id: string, navOptions?: NavigateOptions) => {
      const targetItem = items.find(item => item.id === id);
      if (targetItem) {
        navigate(targetItem.path._abs, navOptions);
        return targetItem;
      }
      return undefined;
    },
    [items, navigate]
  );

  return { TabsElement, selectedItem, navigateById };
};

export default useNavigationTab;
