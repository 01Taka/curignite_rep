import { ReactNode, useState, useEffect, useCallback, useMemo } from "react";
import { objectArrayToDict } from "../../../functions/utils/objectUtils";

interface UseSortableListArgs<T extends { id: string }> {
  items: T[];
  renderItem: (item: T) => ReactNode;
}

const useSortableList = <T extends { id: string }>({
  items,
  renderItem,
}: UseSortableListArgs<T>) => {
  const [staticIds, setStaticIds] = useState<string[]>(items.map(item => item.id));
  const [ids, setIdsState] = useState<string[]>(items.map(item => item.id));

  // 重複や状態変化を管理するsetIds
  const setIds = useCallback((newIds: string[]) => {
    const uniqueIds = Array.from(new Set(newIds));
    setIdsState((prevIds) =>
      JSON.stringify(prevIds) === JSON.stringify(uniqueIds) ? prevIds : uniqueIds
    );
  }, []);

  // itemsの変化に基づいて初期化
  useEffect(() => {
    const newIds = items.map(item => item.id);
    if (JSON.stringify(staticIds) !== JSON.stringify(newIds)) {
      setStaticIds(newIds);
      setIdsState(newIds);
    }
  }, [items, staticIds]);

  // IDに基づいてアイテムを描画
  const getRenderedItem = useCallback(
    (id: string): ReactNode => {
      const item = items.find((item) => item.id === id);
      return item ? renderItem(item) : null;
    },
    [items, renderItem]
  );

  const itemMap = useMemo(() => objectArrayToDict(items, 'id'), [items]);

  const sortedItems = useMemo(() => {
    return ids.map(id => itemMap[id]).filter(Boolean) as T[];
  }, [ids, itemMap]);

  return {
    ids, // ソート順を表すIDの配列
    sortedItems,
    setIds, // 重複排除と状態変化を考慮したsetIds関数
    renderItem: getRenderedItem, // 指定されたIDに基づいて描画を行う関数
  };
};

export default useSortableList;
