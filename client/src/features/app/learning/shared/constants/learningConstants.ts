import { LearningState } from "../../../../../types/firebase/db/learning/learningSupplementTypes";
import { HexColorCode } from "../../../../../types/util/utilTypes";

export const learningStates: ReadonlyArray<LearningState> = ['focus', 'study', 'break', 'away'];

export const learningStateLabels: Record<LearningState, string> = {
  focus: '集中',
  study: '学習',
  break: '休憩',
  away: '離席'
}

export const learningStateColorLabel: Record<LearningState, HexColorCode> = {
  focus: "#ef5a00",
  study: "#00aaff",
  break: "#61c965",
  away: "#999",
};