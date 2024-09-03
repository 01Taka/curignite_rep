import { SpaceData } from "../../firebase/db/space/spaceStructure";
import { FormStateChangeFunc, SelectItem } from "../../util/componentsTypes";

export interface SpaceStartFormState {
  spaceName: string;
  description: string;
  requiresApproval: boolean;
}

export interface SpacesProps {
  spaces: SpaceData[];
  onSpaceClick: (spaceId: string) => void;
}

export interface SpaceStartActionsViewProps {
  isStarting: boolean;
  toSetting: () => void;
  onStart: () => void;
}

export interface SpaceSettingViewProps {
  formState: SpaceStartFormState;
  isStarting: boolean;
  onChangeFormState: FormStateChangeFunc;
  onCompletion: () => void;
  onUpdateDefaultSetting: () => void;
}

export type SpaceTimerMode = "timer" | "stopwatch" | "pomodoro";

export const spaceTimerModes: SelectItem<SpaceTimerMode>[] = [
  { label: "ストップウォッチ", value: "stopwatch" },
  { label: "タイマー", value: "timer" },
  { label: "ポモドーロ", value: "pomodoro" },
];
