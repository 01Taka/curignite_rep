// useRangeSelection.ts
import { useMemo, useState } from 'react';
import { ColorSetting } from './rangeHookTypes';
import { RangeSelection } from '../../../functions/class/rangeSelection';

const useRangeSelection = (colorSetting: Partial<ColorSetting> = {}) => {
  const [_, setUpdate] = useState(0); // 更新用の状態

  const forceUpdate = () => setUpdate(prev => prev + 1); // 再レンダリングをトリガーするための関数

  const rangeSelection = useMemo(() => new RangeSelection(colorSetting, forceUpdate), [colorSetting]);

  return {
    state: rangeSelection.getState(),
    startNumber: rangeSelection.getStartNumber(),
    selectedRanges: rangeSelection.getSelectedRanges(),
    operateRange: rangeSelection.getOperateRange(),
    getNumberColor: (num: number) => rangeSelection.getNumberColor(num),
    onSelectNumber: (num: number) => rangeSelection.onSelectNumber(num),
    setRange: (start: number, end: number) => rangeSelection.setRange(start, end),
    onDeleteOperatingRange: () => rangeSelection.onDeleteOperatingRange(),
    onCancelSelection: () => rangeSelection.onCancelSelection(),
    deleteAllSelection: () => rangeSelection.deleteAllSelection()
  };
};

export default useRangeSelection;
