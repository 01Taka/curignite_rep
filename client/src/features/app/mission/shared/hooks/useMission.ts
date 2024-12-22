// import { useCallback, useEffect, useMemo, useState } from "react";
// import { mathClamp } from "../../../../../functions/utils/mathUtils";
// import useTasks from "../../../../hooks/app/useTasks";
// import { findMissingNumbers } from "../../../../../functions/utils/dataStructureUtils/arrayUtils";
// import { rangesToArray } from "../../../../../functions/utils/rangeUtils";
// import { ProblemSetCategoryRead } from "../../../../../types/firebase/db/task/taskStructure";

// const useMission = ({ isIndividual, target }: MissionTarget) => {
//   const { getProblemSetData } = useTasks();

//   // カテゴリーから目標を選択
//   const choseProblem = useCallback(
//     (categories: ProblemSetCategoryRead[], problemNumber: number): {
//       targets: ProblemSetMissionProblemIds[];
//       estimatedDurationMs: number;
//       goalNumber: number;
//     } => {
//       const problems: ProblemSetMissionProblemIds[] = [];
//       let goalNumber = 0;
//       let estimatedDurationMs = 0;

//       for (const category of categories) {
//         if (category.totalProblemCount) {
//           const numbers = findMissingNumbers(
//             rangesToArray(category.completedProblemIdsRange),
//             1,
//             category.totalProblemCount
//           );
//           const ids = numbers.slice(0, problemNumber - problems.length);

//           problems.push({
//             categoryId: category.docId,
//             problemIds: ids,
//             completedIds: [],
//           });

//           goalNumber += ids.length;
//           estimatedDurationMs += ids.length * category.timePerProblem;

//           if (problems.length >= problemNumber) break;
//         }
//       }

//       return { targets: problems, estimatedDurationMs, goalNumber };
//     },
//     []
//   );

//   // 初期ミッションの取得
//   const getInitialMission = useCallback((): Mission[] => {
//     if (isIndividual) {
//       return [
//         {
//           isIndividual: true,
//           mode: "common",
//           goalProgress: 1,
//           completedProgress: target.progress,
//           estimatedDurationMs: (1 - target.progress) * target.estimatedDuration,
//           progress: target.progress,
//         },
//       ];
//     } else {
//       const { categories } = getProblemSetData(target.docId);
//       const { targets, estimatedDurationMs, goalNumber } = choseProblem(categories, 2);

//       return [
//         {
//           isIndividual: false,
//           mode: "common",
//           goalNumber,
//           completedNumber: 0,
//           targets,
//           estimatedDurationMs,
//           progress: 0,
//           maxProblemNumber: 999
//         },
//       ];
//     }
//   }, [isIndividual, target, getProblemSetData, choseProblem]);

//   // 初期ミッション
//   const initialMissions = useMemo(() => getInitialMission(), [getInitialMission]);

//   // ミッション状態
//   const [missions, setMissions] = useState<Mission[]>(initialMissions);

//   // 初期ミッションの変更を監視
//   useEffect(() => {
//     setMissions(initialMissions);
//   }, [initialMissions]);

//   // インデックスが有効かチェック
//   const isValidIndex = useCallback(
//     (index: number) => 0 <= index && index < missions.length,
//     [missions]
//   );

//   // 目標値を増加
//   const onInclementGoal = useCallback(
//     (index: number, amount: number) => {
//       if (isValidIndex(index)) {
//         setMissions((prev) => {
//           const copy = [...prev];
//           const target = copy[index];

//           if (target.isIndividual) {
//             const goalProgress = mathClamp(
//               target.goalProgress + amount / 20,
//               target.completedProgress,
//               1
//             );
//             copy[index] = {
//               ...target,
//               goalProgress: Math.round(goalProgress * 100) / 100,
//               estimatedDurationMs: (goalProgress - target.completedProgress) * target.estimatedDurationMs,
//             };
//           } else {
//             copy[index] = {
//               ...target,
//               goalNumber: mathClamp(target.goalNumber + amount, 1, 99),
//             };
//           }

//           return copy;
//         });
//       }
//     },
//     [isValidIndex]
//   );

//   const onChangeMode = useCallback((index: number) => {
//     if (isValidIndex(index)) {
//       // 実装内容が未定のため空
//     }
//   }, [isValidIndex]);

//   const onChangeTargets = useCallback((index: number) => {
//     if (isValidIndex(index)) {
//       // 実装内容が未定のため空
//     }
//   }, [isValidIndex]);

//   return { missions, onInclementGoal, onChangeMode, onChangeTargets };
// };

// export default useMission;


export {}