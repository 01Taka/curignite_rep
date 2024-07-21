import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/styles.css';
import './styles/tailwind.css';
import { rootPaths } from './types/path/appPaths';
import TopPage from './pages/top/TopPage';
import NotFound from './pages/error/NotFound';
import AuthRoutes from './pages/auth/AuthRoutes';
import MainRoutes from './pages/app/routes/MainRoutes';
import Navigation from './pages/navigation/Navigation';
import appPreprocessing from './appPreprocessing';
import { useAppDispatch } from './redux/hooks';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    appPreprocessing(dispatch);
  }, [dispatch])

  return (
    <Navigation>
      <Routes>
        <Route path={rootPaths.top} element={<TopPage />} />
        <Route path={`${rootPaths.auth}/*`} element={<AuthRoutes />} />
        <Route path={`${rootPaths.main}/*`} element={<MainRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Navigation>
  );
};

export default App;
