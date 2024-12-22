// import { useCallback, useState } from "react";
// import { TaskData } from "../../../../../../types/firebase/db/task/taskExpansionTypes";
// import { ProblemSetRead } from "../../../../../../types/firebase/db/task/taskStructure";
// import useTasks from "../../../../../hooks/app/useTasks";

// interface IndividualTarget {
//   target: TaskData;
//   goalProgress: number;
// }

// interface ProblemSetTask {
//   id: string;
//   categoryId: string;
//   problemIds: number;
// }

// interface ProblemSetTarget {
//   target: ProblemSetRead;
// }

// interface ProblemSetTargetTask {
//   taskNumber: number;
//   tasks: {
//     categoryId: string;
//     problemId: number;
//   }[];
// }

// const usePlanTarget = () => {
//   const { categoryMap } = useTasks();

//   const [individualTargetMap, setIndividualTargetMap] = useState<Record<string, IndividualTarget>>({});
//   const [problemSetTargetMap, setProblemSetTargetMap] = useState<Record<string, ProblemSetTarget>>({});
//   const [selectedProblemSetTaskIdMap, setSelectedProblemSetTaskIdMap] = useState<Record<string, Set<string>>>({});
//   const [usedNumbersMap, setUsedNumbersMap] = useState<Record<string, number[]>>({});
//   const [problemMapByProblemSetId, setProblemMapByProblemSetId] = useState<Record<string, { id: string, number: number }[]>>({});

//   const addIndividualTarget = useCallback((planTarget: TaskData) => {
//     setIndividualTargetMap(prev => ({
//       ...prev,
//       [planTarget.taskId]: {
//         target: planTarget,
//         goalProgress: 1
//       }
//     }))
//   }, []);

//   const addProblemSetTarget = useCallback((planTarget: ProblemSetRead, task: TaskData) => {
//     setProblemSetTargetMap(prev => ({
//       ...prev,
//       [planTarget.docId]: {
//         target: planTarget,
//         selectedProblems: []
//       }
//     }))
//   }, []);


//   const addProblemSetTargetTask = useCallback((
//     planTarget: ProblemSetRead,
//     task: TaskData,
//     taskNumber: number,
//   ) => {
//     if (!task.isIndividual) {
//       let problems: {
//         id: string;
//         number: number;
//       }[] = [];

//       setProblemMapByProblemSetId(prev => {
//         const activityStatus = task.problemSetActivityField.activityStatus;
//         const newProblemMap = {...prev};

//         for(let status of activityStatus) {
//           const otherProblems = (prev[status.categoryId] ?? [])
//           .map(data => data.id === task.taskId ? null : data)
//           .filter(number => number !== null) as {
//             id: string;
//             number: number;
//           }[];

//           const usedNumbers = new Set(otherProblems.map(problem => problem.number));
//           const useableNumbers = status.remainingProblemIds.filter(number => !usedNumbers.has(number));

//           const numbers = useableNumbers.slice(0, taskNumber - problems.length);
//           const newProblems = numbers.map(number => ({ id: task.taskId, number }));
//           problems.push(...newProblems);
//           newProblemMap[status.categoryId] = [...otherProblems, ...newProblems]
//           if (problems.length >= taskNumber) break;
//         }

//         console.log(newProblemMap);
        
//         return newProblemMap
//       });
//     }

//   }, [problemMapByProblemSetId, setUsedNumbersMap])

//   return { addProblemSetTargetTask }
// }

// export default usePlanTarget;

export {}