import { useCallback, useEffect, useState } from 'react';
import serviceFactory from '../../../../firebase/db/factory';
import { CollectionWithTasksData } from '../../../../types/firebase/db/common/task/taskStructure';
import { useAppSelector } from '../../../../redux/hooks';

const useCollectionsWithTasks = () => {
  const uid = useAppSelector(state => state.userSlice.uid);
  const [collectionsWithTasks, setCollectionsWithTasks] = useState<CollectionWithTasksData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCollectionsWithTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (uid) {
        const collectionTaskService = serviceFactory.createUserTaskManagementService();
        const data = await collectionTaskService.getCollectionsWithTasksData(uid);
        setCollectionsWithTasks(data);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    fetchCollectionsWithTasks();
  }, [fetchCollectionsWithTasks]);

  return { collectionsWithTasks, loading, error };
};

export default useCollectionsWithTasks;
