import { Tab, Tabs } from "@mui/material";
import { ReactNode, useMemo, useState, useEffect } from "react";
import { NavigateOptions, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { PathStructure } from "../../../../types/path/pathTypes";

const useLocationTab = (
  items: { path: PathStructure; label: string; element: ReactNode; }[],
  options?: Partial<{
    defaultAbsPath: string;
    navigateOptions: NavigateOptions;
  }>
) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>(location.pathname);

  useEffect(() => {
    if (options?.defaultAbsPath && !items.some(item => item.path._abs === location.pathname)) {
      navigate(options.defaultAbsPath, options.navigateOptions);
    }
  }, [location.pathname, items, options, navigate]);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
    navigate(newValue, options?.navigateOptions); // 新しいパスに遷移
  };

  const TabsElement = useMemo(() => (
    <Tabs value={selectedTab} onChange={handleChange} centered>
      {items.map((item, index) => (
        <Tab key={index} label={item.label} value={item.path._abs} />
      ))}
    </Tabs>
  ), [items, selectedTab]);

  const RouteElement = useMemo(() => (
    <Routes>
      {items.map((item, index) => (
        <Route key={index} path={item.path._rel} element={item.element} />
      ))}
    </Routes>
  ), [items]);

  return { TabsElement, RouteElement };
};

export default useLocationTab;
