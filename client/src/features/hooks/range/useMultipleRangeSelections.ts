import { useState, useCallback, useMemo, useEffect } from 'react';
import { ColorSetting } from './rangeHookTypes';
import { RangeSelection } from '../../../functions/class/rangeSelection';
import { Range } from '../../../types/util/componentsTypes';

interface UseMultipleRangeSelectionsOptions {
  colorSetting: Partial<ColorSetting>;
  onChangeRanges?: (id: string, ranges: Range[]) => void;
} 

const useMultipleRangeSelections = (options: Partial<UseMultipleRangeSelectionsOptions> = {}) => {
  const setting = useMemo(() => {
    return {
      colorSetting: {},
      ...options
    }
  }, [options]);

  const [realColorSetting, setRealColorSetting] = useState<Partial<ColorSetting>>({});
  const [rangeSelections, setRangeSelections] = useState<Record<string, RangeSelection>>({});
  const [pairIds, setPairIds] = useState<Record<string, string[]>>({});
  const [idToPairId, setIdToPairId] = useState<Record<string, string>>({});
  const [update, setUpdate] = useState(0);

  // なぜかcolorSettingを直接依存関係に含めると無限ループする
  useEffect(() => {
    if (JSON.stringify(realColorSetting) !== JSON.stringify(setting.colorSetting)) {
      setRealColorSetting(setting.colorSetting);
    }
  }, [setting, realColorSetting])

  const forceUpdate = useCallback(() => setUpdate(prev => prev + 1), []);

  // ペアの追加ロジックを共通関数化
  const mergePairIds = useCallback((pairId: string, ids: string[]) => {
    setPairIds(prev => ({
      ...prev,
      [pairId]: [...new Set([...(prev[pairId] || []), ...ids])]
    }));
  }, []);

  const updateIdToPairId = useCallback((pairId: string, ids: string[]) => {
    setIdToPairId(prev => {
      const newMappings = { ...prev };
      ids.forEach(id => {
        newMappings[id] = pairId;
      });
      return newMappings;
    });
  }, []);

  // ペアの追加（マージ込み）
  const addPair = useCallback((pairId: string, pairingIds: string[]) => {
    mergePairIds(pairId, pairingIds);
    updateIdToPairId(pairId, pairingIds);
  }, [mergePairIds, updateIdToPairId]);

  // RangeSelection の追加
  const addRangeSelection = useCallback((id: string) => {
    setRangeSelections(prev => {
      if (prev[id]) return prev;
      return {
        ...prev,
        [id]: new RangeSelection(realColorSetting, forceUpdate)
      };
    });
  }, [realColorSetting, forceUpdate]);

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
  }, [rangeSelections, update, setUpdate]);

  const callFuncForAll = useCallback((func: (id: string) => void, exceptId?: string) => {
    for (const id of Object.keys(rangeSelections)) {
      if (id !== exceptId) func(id);
    }
  }, [rangeSelections]);

  const getState = useCallback((id: string) => rangeSelections[id]?.getState(), [rangeSelections]);
  const getStartNumber = useCallback((id: string) => rangeSelections[id]?.getStartNumber(), [rangeSelections]);
  const getSelectedRanges = useCallback((id: string) => rangeSelections[id]?.getSelectedRanges(), [rangeSelections]);
  const getOperateRange = useCallback((id: string) => rangeSelections[id]?.getOperateRange(), [rangeSelections]);

  const getNumberColor = useCallback((id: string, num: number) => rangeSelections[id]?.getNumberColor(num), [rangeSelections]);

  // ペア内で一致させる関数
  const setRangesWithPair = useCallback((pairId: string, ranges: Range[]) => {
    const targetIds = pairIds[pairId];
    if (!targetIds) return;
    targetIds.forEach(id => rangeSelections[id]?.setRanges(ranges));
  }, [pairIds, rangeSelections]);

  const matchTheRangesInPair = useCallback((baseId: string, ranges?: Range[]) => {
    const pairId = idToPairId[baseId];
    if (!pairId) return;
    const selectedRanges = ranges ?? getSelectedRanges(baseId);
    setRangesWithPair(pairId, selectedRanges);
  }, [idToPairId, getSelectedRanges, setRangesWithPair]);

  const handleOnChangeRanges = useCallback((id: string) => {
    const selectedRanges = getSelectedRanges(id);
    matchTheRangesInPair(id, selectedRanges);
    setting.onChangeRanges?.(id, selectedRanges);
  }, [setting, matchTheRangesInPair,getSelectedRanges]);

  const setRange = useCallback((id: string, start: number, end: number) => {
    rangeSelections[id]?.setRange(start, end);
    handleOnChangeRanges(id);
  }, [rangeSelections, handleOnChangeRanges]);

  const setRanges = useCallback((id: string, ranges: Range[]) => {
    rangeSelections[id]?.setRanges(ranges);
    handleOnChangeRanges(id);
  }, [rangeSelections, handleOnChangeRanges]);

  const onDeleteOperatingRange = useCallback((id: string) => {
    rangeSelections[id]?.onDeleteOperatingRange();
    handleOnChangeRanges(id);
  }, [rangeSelections, handleOnChangeRanges]);
  const onCancelSelection = useCallback((id: string) => rangeSelections[id]?.onCancelSelection(), [rangeSelections]);

  const onSelectNumber = useCallback((id: string, num: number) => {
    rangeSelections[id]?.onSelectNumber(num, () => handleOnChangeRanges(id));
    callFuncForAll(onCancelSelection, id);
  }, [rangeSelections, callFuncForAll, onCancelSelection, handleOnChangeRanges]);

  const deleteAllSelections = useCallback(() => setRangeSelections({}), []);

  const addRangeSelectionWithPairing = useCallback((pairId: string, id: string) => {
    addRangeSelection(id);
    addPair(pairId, [id]);
  }, [addRangeSelection, addPair]);

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
    addPair,
    addRangeSelectionWithPairing,
    matchTheRangesInPair,
    setRangesWithPair
  };
};

export default useMultipleRangeSelections;
