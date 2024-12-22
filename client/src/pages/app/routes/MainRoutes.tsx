import { FC, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomeRoot from '../home/HomeRoot';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import NotFound from '../../error/NotFound';
import { autoUpdateSpaces } from '../../../redux/actions/space/spaceActions';
import { setApprovedTeams } from '../../../redux/actions/team/teamActions';
import { updateCurrentGoal } from '../../../redux/actions/learning/learningGoalActions';
import LearningRoot from '../learning/LearningRoot';
import TaskRoot from '../task/TaskRoot';
import { initializeTasks, setupRealTimeUpdates } from '../../../redux/actions/task/taskActions';
import { appPaths } from '../../../constants/app/path/appPath';
import PlanRoot from '../plan/PlanRoot';
import Profile from '../../../features/app/profile/Profile';

const MainRoutes: FC = () => {
  const dispatch = useAppDispatch();
  const { uid } = useAppSelector(state => state.userSlice);

  useEffect(() => {
    if (uid) {
      setApprovedTeams(dispatch, uid);
      autoUpdateSpaces(dispatch, uid);
      updateCurrentGoal(dispatch, uid);
      initializeTasks(uid, dispatch);
      setupRealTimeUpdates(uid, dispatch);
    }
  }, [dispatch, uid]);

  return (
    <Routes>
        {/* {userFetchState.state !== "success" && <Route path="/*" element={<CircularProgress />} />} */}
        
        <Route path={`/*`} element={<HomeRoot />} />
        <Route path={`${appPaths.task._rel}/*`} element={<TaskRoot />} />
        <Route path={`${appPaths.plan._rel}/*`} element={<PlanRoot />} />
        <Route path={`${appPaths.learning._rel}/*`} element={<LearningRoot />} />
        <Route path='/profile' element={<Profile />} />
        
        {/* <Route path={mainRootPaths.focusLearning} element={<FocusLearning />} />
        <Route path={mainRootPaths.team} element={<TeamRoutes />} />
        <Route path={mainRootPaths.activeMember} element={<ActiveMemberRoutes />} /> */}
        <Route path='*' element={<NotFound />} />
      </Routes>
  );
};

export default MainRoutes;
