import { ReactNode, useMemo, useState, useCallback } from "react";

type SwitchableComponent = {
  id: string;
  Component: ReactNode;
};

const useSwitchComponents = (
  components: SwitchableComponent[],
  defaultComponent: ReactNode | null = null
) => {
  const [displayComponentId, setDisplayComponentId] = useState<string | null>(null);

  // 指定した ID のコンポーネントに切り替える
  const switchComponent = useCallback((id: string) => {
    setDisplayComponentId(id);
  }, []);

  // 現在デフォルトコンポーネントを表示しているかを判定
  const isUsingDefaultComponent = useMemo(() => {
    return !components.some(item => item.id === displayComponentId);
  }, [components, displayComponentId]);

  // デフォルトコンポーネントに切り替える
  const switchToDefault = useCallback(() => {
    setDisplayComponentId(null);
  }, []);

  // 現在表示するコンポーネントを取得
  const Component = useMemo(() => {
    const target = components.find(item => item.id === displayComponentId);
    return target ? target.Component : defaultComponent ?? null;
  }, [components, displayComponentId, defaultComponent]);

  return {
    Component,
    isUsingDefaultComponent,
    switchComponent,
    switchToDefault,
  };
};

export default useSwitchComponents;
