import { Tabs, Tab } from "@mui/material";
import { useMemo, useCallback } from "react";
import { NavigateOptions, useLocation, useNavigate, Routes, Route } from "react-router-dom";
import { UseLocationTabItem, UseLocationTabReturnType } from "./shared/types/useLocationTabTypes";

const useLocationTab = (
  items: UseLocationTabItem[],
  options?: Partial<{
    defaultAbsPath: string;
    navigateOptions: NavigateOptions;
    tabsProps: Omit<React.ComponentProps<typeof Tabs>, "value" | "onChange">;
    tabProps: Omit<React.ComponentProps<typeof Tab>, "label" | "value">;
    onTabChange?: (newValue: string) => void;
  }>
): UseLocationTabReturnType => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const selectedItem = useMemo(() => {
    return items.find(item => item.path._abs === pathname);
  }, [items, pathname]);

  const handleChange = useCallback(
    (_: React.SyntheticEvent, newValue: string) => {
      options?.onTabChange?.(newValue); // 外部イベントハンドラーを呼び出す
      navigate(newValue, options?.navigateOptions ?? {});
    },
    [navigate, options]
  );

  const TabsElement = useMemo(() => (
    <Tabs
      value={pathname}
      onChange={handleChange}
      centered
      {...options?.tabsProps} // 外部から渡されたTabsのプロップスを適用
    >
      {items.map((item, index) => (
        <Tab
          key={index}
          label={item.label}
          value={item.path._abs}
          {...options?.tabProps} // 外部から渡されたTabのプロップスを適用
        />
      ))}
    </Tabs>
  ), [items, pathname, options, handleChange]);

  const RouteElement = useMemo(() => (
    <Routes>
      {items.map((item, index) => (
        <Route key={index} path={item.path._rel} element={item.element} />
      ))}
    </Routes>
  ), [items]);

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

  return { RouteElement, TabsElement, selectedItem, navigateById };
};

export default useLocationTab;
