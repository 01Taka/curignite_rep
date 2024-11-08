import { useState, useMemo, useCallback } from 'react';
import { getRange, isNumberInRange, isSameRange, mergeRanges } from '../../../functions/utils/rangeUtils';
import { ColorSetting, RangeSelectionState } from './rangeHookTypes';
import { Range } from '../../../types/util/componentsTypes';

const defaultColorSetting: ColorSetting = {
  defaultColor: '#f0f0f0', // 薄いグレー (Light gray)
  selectedColor: '#64b5f6', // 薄いブルー (Light Blue)
  startNumberColor: '#ffcc80', // 薄いオレンジ (Light Orange)
  selectableColor: '#a5d6a7', // 薄いグリーン (Light Green)
  editingColor: '#ef9a9a', // 薄いレッド (Light Red)
};

const useRangeSelection = (colorSetting: Partial<ColorSetting> = {}) => {
  const finalColorSetting: ColorSetting = useMemo(() => ({
    ...defaultColorSetting,
    ...colorSetting,
  }), [colorSetting]);

  const [startNumber, setStartNumber] = useState<number | null>(null);
  const [selectedRanges, setSelectedRanges] = useState<Range[]>([]);
  const [operateRange, setOperateRange] = useState<Range | null>(null);

  const getNumberColor = useCallback((num: number): string => {
    if (num === startNumber) {
      return finalColorSetting.startNumberColor;
    }

    if (operateRange) {
      return isNumberInRange(operateRange, num) ? finalColorSetting.editingColor : finalColorSetting.defaultColor;
    }

    if (isNumberInRange(selectedRanges, num)) {
      return finalColorSetting.selectedColor;
    }

    return startNumber === null ? finalColorSetting.defaultColor : finalColorSetting.selectableColor;
  }, [startNumber, operateRange, selectedRanges, finalColorSetting]);

  const onSelectNumber = useCallback((num: number) => {
    if (operateRange) {
      if (startNumber && isNumberInRange(operateRange, num)) {
        setSelectedRanges(prev => [
          ...prev.filter(range => !isNumberInRange(range, num, true)),
          getRange(startNumber, num)
        ]);
      }
      setStartNumber(null);
      setOperateRange(null);
      return;
    }

    if (isNumberInRange(selectedRanges, num)) {
      setStartNumber(num);
      const targetRange = selectedRanges.find(range => isNumberInRange(range, num, true));
      setOperateRange(targetRange ?? null);
      return;
    }

    if (startNumber) {
      const [min, max] = num > startNumber ? [startNumber, num] : [num, startNumber];
      setSelectedRanges(prev => mergeRanges([...prev, { min, max }]));
      setStartNumber(null);
      return;
    }

    setStartNumber(num);
  }, [operateRange, startNumber, selectedRanges]);

  const onDeleteOperatingRange = useCallback(() => {
    if (!operateRange) {
      console.warn('選択中の範囲がありません');
      return;
    }
    setSelectedRanges(prev => prev.filter(range => !isSameRange(range, operateRange)));
    setOperateRange(null);
    setStartNumber(null);
  }, [operateRange]);

  const onCancelSelection = useCallback(() => {
    setOperateRange(null);
    setStartNumber(null);
  }, []);

  const deleteAllSelection = useCallback(() => {
    onCancelSelection();
    setSelectedRanges([]);
  }, [onCancelSelection])

  const setRange = useCallback((start: number, end: number) => {
    setOperateRange(null);
    setStartNumber(null);
    setSelectedRanges([getRange(start, end)]);
  }, []);
  
  const state: RangeSelectionState = useMemo(() => {
    if (operateRange) {
      return 'edit';
    }
    return startNumber ? 'selecting' : 'idle';
  }, [operateRange, startNumber]);

  return {
    state,
    startNumber,
    selectedRanges,
    operateRange,
    getNumberColor,
    onSelectNumber,
    setRange,
    onDeleteOperatingRange,
    onCancelSelection,
    deleteAllSelection
  };
};

export default useRangeSelection;
