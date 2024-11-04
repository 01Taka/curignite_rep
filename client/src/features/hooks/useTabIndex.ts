import { useEffect, useState, useCallback } from "react";

interface UseTabIndexReturn {
  tabIndex: number | null;
  changeTab: (index: number | null) => void;
  resetTab: () => void;
}

const useTabIndex = (
  tabNumber: number,
  defaultTab: number | null = 0,
  initialState: number | null = null
): UseTabIndexReturn => {
  const [tabIndex, setTabIndex] = useState<number | null>(null);

  const changeTab = useCallback((index: number | null) => {
    if (typeof index === 'number' && index >= 0 && index < tabNumber) {
      setTabIndex(index);
    } else {
      setTabIndex(defaultTab);
    }
  }, [tabNumber, defaultTab]);

  const resetTab = useCallback(() => {
    setTabIndex(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    changeTab(initialState);
  }, [initialState, changeTab]);

  return { tabIndex, changeTab, resetTab };
};

export default useTabIndex;
