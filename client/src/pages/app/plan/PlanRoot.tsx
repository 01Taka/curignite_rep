import React from 'react';
import Plan from '../../../features/app/plan/Plan';
import { Route, Routes } from 'react-router-dom';

interface PlanRootProps { }

const PlanRoot: React.FC<PlanRootProps> = () => {
  return (
    <Routes>
      <Route path='/*' element={<Plan />} />
    </Routes>
  );
};

export default PlanRoot;