import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Learning from '../../../features/app/learning/Learning';

interface LearningRootProps { }

const LearningRoot: React.FC<LearningRootProps> = () => {
  return (
    <Routes>
      <Route path={`/*`} element={<Learning />} />
    </Routes>
  );
};

export default LearningRoot;