import React from 'react';
import Plan from '../../../features/app/plan/Plan';
import { Route, Routes } from 'react-router-dom';
import PlanTarget from '../../../features/app/plan/PlanTarget';

interface PlanRootProps { }

const PlanRoot: React.FC<PlanRootProps> = () => {
  return (
    <Routes>
      <Route path='/*' element={<PlanTarget />} />
    </Routes>
  );
};

export default PlanRoot;