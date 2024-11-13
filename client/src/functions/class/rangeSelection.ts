// RangeSelection.ts
import { ColorSetting } from "../../features/hooks/range/rangeHookTypes";
import { Range } from "../../types/util/componentsTypes";
import { isNumberInRange, getRange, mergeRanges, isSameRange } from "../utils/rangeUtils";

const defaultColorSetting: ColorSetting = {
  defaultColor: '#f0f0f0',
  selectedColor: '#64b5f6',
  startNumberColor: '#ffcc80',
  selectableColor: '#a5d6a7',
  editingColor: '#ef9a9a',
};

export class RangeSelection {
  private colorSetting: ColorSetting;
  private startNumber: number | null = null;
  private selectedRanges: Range[] = [];
  private operateRange: Range | null = null;
  private onChangeCallback: () => void;

  constructor(colorSetting: Partial<ColorSetting> = {}, onChangeCallback: () => void) {
    this.colorSetting = { ...defaultColorSetting, ...colorSetting };
    this.onChangeCallback = onChangeCallback;
  }

  private notifyChange() {
    this.onChangeCallback(); // 状態が変更されるたびに呼び出す
  }

  getStartNumber() {
    return this.startNumber;
  }

  getOperateRange() {
    return this.operateRange;
  }

  getNumberColor(num: number): string {
    if (num === this.startNumber) {
      return this.colorSetting.startNumberColor;
    }
    if (this.operateRange && isNumberInRange(this.operateRange, num)) {
      return this.colorSetting.editingColor;
    }
    if (isNumberInRange(this.selectedRanges, num)) {
      return this.colorSetting.selectedColor;
    }
    return this.startNumber === null ? this.colorSetting.defaultColor : this.colorSetting.selectableColor;
  }

  onSelectNumber(num: number, onConfirmedRange?: (selectedRanges: Range[]) => void) {
    if (this.operateRange) {
      if (this.startNumber && isNumberInRange(this.operateRange, num)) {
        this.selectedRanges = [
          ...this.selectedRanges.filter(range => !isNumberInRange(range, num, true)),
          getRange(this.startNumber, num)
        ];
        onConfirmedRange?.(this.selectedRanges);
      }
      this.startNumber = null;
      this.operateRange = null;
      this.notifyChange();
      return;
    }

    if (isNumberInRange(this.selectedRanges, num)) {
      this.startNumber = num;
      this.operateRange = this.selectedRanges.find(range => isNumberInRange(range, num, true)) ?? null;
      this.notifyChange();
      return;
    }

    if (this.startNumber !== null) {
      const [min, max] = num > this.startNumber ? [this.startNumber, num] : [num, this.startNumber];
      this.selectedRanges = mergeRanges([...this.selectedRanges, { min, max }]);
      this.startNumber = null;
      onConfirmedRange?.(this.selectedRanges);
      this.notifyChange();
      return;
    }

    this.startNumber = num;
    this.notifyChange();
  }

  onDeleteOperatingRange() {
    if (!this.operateRange) {
      console.warn('選択中の範囲がありません');
      return;
    }
    this.selectedRanges = this.selectedRanges.filter(range => !isSameRange(range, this.operateRange!));
    this.operateRange = null;
    this.startNumber = null;
    this.notifyChange();
  }

  onCancelSelection() {
    this.operateRange = null;
    this.startNumber = null;
    this.notifyChange();
  }

  deleteAllSelection() {
    this.onCancelSelection();
    this.selectedRanges = [];
    this.notifyChange();
  }

  setRange(start: number, end: number) {
    this.operateRange = null;
    this.startNumber = null;
    this.selectedRanges = [getRange(start, end)];
    this.notifyChange();
  }

  setRanges(ranges: Range[]) {
    this.selectedRanges = ranges;
    this.notifyChange();
  }

  getState(): 'edit' | 'selecting' | 'idle' {
    if (this.operateRange) {
      return 'edit';
    }
    return this.startNumber ? 'selecting' : 'idle';
  }

  getSelectedRanges(): Range[] {
    return this.selectedRanges;
  }
}
