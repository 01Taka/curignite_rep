import { useState, useCallback, useMemo } from 'react';
import { ColorSetting } from './rangeHookTypes';
import { RangeSelection } from '../../../functions/class/rangeSelection';
import { Range } from '../../../types/util/componentsTypes';

const useMultipleRangeSelections = (colorSetting: Partial<ColorSetting> = {}) => {
  const [rangeSelections, setRangeSelections] = useState<Record<string, RangeSelection>>({});
  const [update, setUpdate] = useState(0); // 更新用の状態

  const forceUpdate = () => setUpdate(prev => prev + 1); // 再レンダリングをトリガーするための関数

  const addRangeSelection = useCallback((id: string) => {
    setRangeSelections(prev => {
      if (prev[id]) return prev;
      return {
        ...prev,
        [id]: new RangeSelection(colorSetting, forceUpdate), // forceUpdateを渡す
      };
    });
  }, [colorSetting]);

  const addRangeSelections = useCallback((ids: string[]) => {
    ids.forEach(id => addRangeSelection(id));
  }, [addRangeSelection]);

  const removeRangeSelection = useCallback((id: string) => {
    setRangeSelections(prev => {
      const newSelections = { ...prev };
      delete newSelections[id];
      return newSelections;
    });
  }, []);
  
  const totalState = useMemo(() => {
    setUpdate(update);

    return Object.keys(rangeSelections).map(key => {
      const instance = rangeSelections[key];
      return {
        id: key,
        state: instance.getState(),
        startNumber: instance.getStartNumber(),
        selectedRanges: instance.getSelectedRanges(),
        operateRange: instance.getOperateRange()
      };
    });
  }, [rangeSelections, update]);  

  const callFuncForAll = useCallback((func: (id: string) => void, exceptId?: string) => {
    for (const id of Object.keys(rangeSelections)) {
      if (id !== exceptId) func(id);
    }
  }, [rangeSelections]);

  const getState = useCallback((id: string) => rangeSelections[id]?.getState(), [rangeSelections]);
  const getStartNumber = useCallback((id: string) => rangeSelections[id]?.getStartNumber(), [rangeSelections]);
  const getSelectedRanges = useCallback((id: string) => rangeSelections[id]?.getSelectedRanges(), [rangeSelections]);
  const getOperateRange = useCallback((id: string) => rangeSelections[id]?.getOperateRange(), [rangeSelections]);

  const getNumberColor = useCallback(
    (id: string, num: number) => rangeSelections[id]?.getNumberColor(num),
    [rangeSelections]
  );

  const setRange = useCallback(
    (id: string, start: number, end: number) => rangeSelections[id]?.setRange(start, end),
    [rangeSelections]
  );

  const setRanges = useCallback(
    (id: string, ranges: Range[]) => rangeSelections[id]?.setRanges(ranges),
    [rangeSelections]
  );

  const onDeleteOperatingRange = useCallback(
    (id: string) => rangeSelections[id]?.onDeleteOperatingRange(),
    [rangeSelections]
  );

  const onCancelSelection = useCallback(
    (id: string) => rangeSelections[id]?.onCancelSelection(),
    [rangeSelections]
  );

  const onSelectNumber = useCallback((id: string, num: number) => {
    rangeSelections[id]?.onSelectNumber(num);
    callFuncForAll(onCancelSelection, id);
  }, [rangeSelections, callFuncForAll, onCancelSelection]);

  const deleteAllSelections = useCallback(() => {
    setRangeSelections({});
  }, []);

  return {
    totalState,
    addRangeSelection,
    addRangeSelections,
    removeRangeSelection,
    getState,
    getStartNumber,
    getSelectedRanges,
    getOperateRange,
    getNumberColor,
    onSelectNumber,
    setRange,
    setRanges,
    onDeleteOperatingRange,
    onCancelSelection,
    deleteAllSelections,
  };
};

export default useMultipleRangeSelections;
