import { useState, useCallback } from 'react';
import useRangeSelection from './useRangeSelection'; // 元の useRangeSelection フックをインポート
import { ColorSetting } from './rangeHookTypes';

interface RangeSelectionInstance {
  id: string;
  rangeSelection: ReturnType<typeof useRangeSelection>;
}

const useMultipleRangeSelections = () => {
  const [rangeSelections, setRangeSelections] = useState<RangeSelectionInstance[]>([]);

  // 新しい範囲選択を追加する
  const addRangeSelection = useCallback((id: string, colorSetting?: Partial<ColorSetting>) => {
    setRangeSelections(prev => [
      ...prev,
      { id, rangeSelection: useRangeSelection(colorSetting) }
    ]);
  }, []);

  // 指定した ID の範囲選択を削除する
  const removeRangeSelection = useCallback((id: string) => {
    setRangeSelections(prev => prev.filter(selection => selection.id !== id));
  }, []);

  // 指定した ID の範囲選択インスタンスを取得する
  const getRangeSelectionById = useCallback((id: string) => {
    return rangeSelections.find(selection => selection.id === id)?.rangeSelection;
  }, [rangeSelections]);

  // 全ての範囲選択をクリアする
  const clearAllSelections = useCallback(() => {
    rangeSelections.forEach(({ rangeSelection }) => rangeSelection.deleteAllSelection());
    setRangeSelections([]);
  }, [rangeSelections]);

  return {
    rangeSelections,
    addRangeSelection,
    removeRangeSelection,
    getRangeSelectionById,
    clearAllSelections,
  };
};

export default useMultipleRangeSelections;
