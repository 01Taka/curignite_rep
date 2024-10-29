import serviceFactory from "../../../../firebase/db/factory";
import { TaskManagementService } from "../../../../firebase/db/util/taskManagementService";
import { FullProblemSetData } from "../../../../types/firebase/db/task/taskExpansionTypes";
import { useAppSelector } from "../../../../redux/hooks";
import { useEffect, useState } from "react";

interface UseProblemSetReturns {
  problemSetData: FullProblemSetData[]
}

const useProblemSet = (): UseProblemSetReturns => {
  const { uid } = useAppSelector(state => state.userSlice);
  const [problemSetData, setProblemSetData] = useState<FullProblemSetData[]>([]);

  useEffect(() => {
    const getProblemSetData = async () => {
      if (uid) {
        const data = await TaskManagementService.fetchAllData(serviceFactory, uid);
        console.log(data);
        
        setProblemSetData(data.problemSetData);
      }
    }
    getProblemSetData();
  }, [uid])
  
  return { problemSetData };
}

export default useProblemSet;