import React, { FC, useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { getLastSegment } from '../../../functions/path/pathUtils'
import { activeMemberPaths } from '../../../types/path/mainPaths'
import ActiveMemberHome from './ActiveMemberHome'

const ActiveMemberRoutes: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === activeMemberPaths.base) {
      console.log("######");
      
      navigate(activeMemberPaths.home, { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path={getLastSegment(activeMemberPaths.home)} element={<ActiveMemberHome />} />
    </Routes>
  )
}

export default ActiveMemberRoutes