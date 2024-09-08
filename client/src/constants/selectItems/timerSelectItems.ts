import { TimerMode } from "../../types/components/TimerTypes";
import { SelectItem } from "../../types/util/componentsTypes";

export const timerModeSelectItems: SelectItem<TimerMode>[] = [
  { label: "ストップウォッチ", value: "stopwatch" },
  { label: "タイマー", value: "timer" },
  { label: "ポモドーロ", value: "pomodoro" },
];
