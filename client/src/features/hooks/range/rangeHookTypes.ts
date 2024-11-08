export type RangeSelectionState = 'idle' | 'selecting' | 'edit';

export interface ColorSetting {
  defaultColor: string;
  selectedColor: string;
  startNumberColor: string;
  selectableColor: string;
  editingColor: string;
}