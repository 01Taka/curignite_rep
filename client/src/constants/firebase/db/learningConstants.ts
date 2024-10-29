import { LearningState } from "../../../types/firebase/db/learning/learningSupplementTypes";

export const learningStates: ReadonlyArray<LearningState> = ['focus', 'study', 'break', 'away'];

export const learningStateLabels: Record<LearningState, string> = {
  focus: '集中',
  study: '学習',
  break: '休憩',
  away: '離席'
}