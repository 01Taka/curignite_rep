import React, { useEffect, useState } from 'react';
import Plan from '../../plan/Plan';
import { useAppSelector } from '../../../../../redux/hooks';
import { TaskData } from '../../../../../types/firebase/db/task/taskExpansionTypes';
import { TaskManagementService } from '../../../../../firebase/db/util/taskManagementService';
import serviceFactory from '../../../../../firebase/db/factory';

interface ProblemSetStepProps {}

const ProblemSetStep: React.FC<ProblemSetStepProps> = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [tasksData, setTasksData] = useState<TaskData[]>([]);

  useEffect(() => {
    const updateTasks = async () => {
      if (uid) {
        try {
          const data = await TaskManagementService.fetchAllData(serviceFactory, uid);
          console.log(data);
          
          setTasksData(data.tasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      }
    };
    
    updateTasks(); // uidが変更されたときにupdateTasksを呼び出す
  }, [uid]);

  return <Plan tasks={tasksData} />;
};

export default ProblemSetStep;
