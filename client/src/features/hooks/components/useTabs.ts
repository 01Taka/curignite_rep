import { useState, useCallback } from "react";

type HandleTabChange = (event: React.SyntheticEvent, newTabIndex: number) => void;

interface UseTabsReturn {
  tabIndex: number;
  handleChangeTab: HandleTabChange;
  a11yProps: (index: number) => { id: string; "aria-controls": string };
}

const useTabs = (
  onChangedTab: HandleTabChange = () => {},
  initialTabIndex: number = 0
): UseTabsReturn => {
  const [tabIndex, setTabIndex] = useState<number>(initialTabIndex);

  const handleChangeTab: HandleTabChange = useCallback((event, newTabIndex) => {
    onChangedTab(event, newTabIndex);
    setTabIndex(newTabIndex);
  }, [onChangedTab]);

  const a11yProps = (index: number) => {
    return {
      id: `tab-${index}`,
      "aria-controls": `tabpanel-${index}`,
    };
  };

  return { tabIndex, handleChangeTab, a11yProps };
};

export default useTabs;
