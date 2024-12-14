import { useState, useCallback, useMemo } from "react";

interface UseToggleOption {
  initialState: boolean;
  initialOpenIds: string[];
  openOnlyOne: boolean;
  onChange?: (open: boolean, id?: string) => void;
}

const useToggle = (option: Partial<UseToggleOption> = {}) => {
  const setting = useMemo(() => {
    return {
      initialState: false,
      openOnlyOne: true,
      initialOpenIds: [],
      ...option
    } as UseToggleOption
  }, [option]);

  const [toggleMap, setToggleMap] = useState<Record<string, boolean>>(() => {
    if (!option.initialOpenIds) return { default: setting.initialState };
    const map: Record<string, boolean> = {};
    setting.initialOpenIds.forEach(id => {
      map[id] = true;
    });
    return map;
  });

  const normalizeId = (id: any) => (typeof id === 'string' ? id : 'default');

  const toggleOtherThan = useCallback((id: string, state: boolean) => {
    setToggleMap(prev => {
      const newMap = {} as Record<string, boolean>;
      Object.keys(prev).forEach(key => newMap[key] = !state);
      newMap[id] = state;
      setting.onChange?.(state, id);
      return newMap;
    });
  }, [setting]);

  const setAll = useCallback((state: boolean) => {
    setToggleMap(prev => {
      const newMap = Object.keys(prev).reduce((acc, key) => {
        acc[key] = state;
        return acc;
      }, {} as Record<string, boolean>);
      setting.onChange?.(state);
      return newMap;
    });
  }, [setting]);

  const openAll = useCallback(() => setAll(true), [setAll]);

  const closeAll = useCallback(() => setAll(false), [setAll]);

  const setState = useCallback((id: string, state: boolean) => {
    if (setting.openOnlyOne) {
      state ? toggleOtherThan(id, true) : closeAll();
    } else {
      setToggleMap(prev => ({ ...prev, [id]: state }));
    }
    setting.onChange?.(state, id === 'default' ? undefined : id);
  }, [setting, toggleOtherThan, closeAll]);

  const isOpen = useCallback((id: any = 'default') => toggleMap[normalizeId(id)] ?? setting.initialState, [setting, toggleMap]);

  const toOpen = useCallback((id: any = 'default') => setState(normalizeId(id), true), [setState]);

  const toClose = useCallback((id: any = 'default') => setState(normalizeId(id), false), [setState]);

  const toggle = useCallback((id: any = 'default') => {
    const normalizedId = normalizeId(id);
    const currentState = toggleMap[normalizedId] ?? setting.initialState;
    setState(normalizedId, !currentState);
  }, [setting, toggleMap, setState]);

  const openAlone = useCallback((id: string) => toggleOtherThan(id, true), [toggleOtherThan]);

  const closeAlone = useCallback((id: string) => toggleOtherThan(id, false), [toggleOtherThan]);

  const open = useMemo(() => toggleMap['default'] ?? setting.initialState, [setting, toggleMap]);

  return { open, isOpen, toOpen, toClose, toggle, openAll, closeAll, openAlone, closeAlone };
};

export default useToggle;
