import { ReactNode, useMemo, useState, useCallback } from "react";

type SwitchableComponent = {
  id: string;
  Component: ReactNode;
};

type UseSwitchComponentsProps = {
  components: SwitchableComponent[];
  defaultComponent?: ReactNode | null;
  externalState?: {
    displayComponentId: string | null;
    setDisplayComponentId: React.Dispatch<React.SetStateAction<string | null>>;
  };
};

const useSwitchComponents = ({
  components,
  defaultComponent = null,
  externalState,
}: UseSwitchComponentsProps) => {
  // 外部または内部で `displayComponentId` を管理
  const [internalDisplayComponentId, internalSetDisplayComponentId] = useState<string | null>(null);
  const displayComponentId = externalState?.displayComponentId ?? internalDisplayComponentId;
  const setDisplayComponentId = externalState?.setDisplayComponentId ?? internalSetDisplayComponentId;

  // 指定した ID のコンポーネントに切り替える
  const switchComponent = useCallback((id: string) => {
    setDisplayComponentId(id);
  }, [setDisplayComponentId]);

  // 現在デフォルトコンポーネントを表示しているかを判定
  const isUsingDefaultComponent = useMemo(() => {
    return !components.some(item => item.id === displayComponentId);
  }, [components, displayComponentId]);

  // デフォルトコンポーネントに切り替える
  const switchToDefault = useCallback(() => {
    setDisplayComponentId(null);
  }, [setDisplayComponentId]);

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
