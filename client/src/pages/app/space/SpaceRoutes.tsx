import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import SpaceBasePage from './SpaceBasePage'
import SpaceStart from './start/SpaceStart'
import SpaceHome from './home/SpaceHome'
import { spacePaths } from '../../../types/path/mainPaths'
import { getLastSegment } from '../../../functions/path/pathUtils'

const SpaceRoutes: FC = () => {
  return (
    <Routes>
        <Route path='' element={<SpaceBasePage />} />
        <Route path={getLastSegment(spacePaths.start, undefined, true)} element={<SpaceStart />} />
        <Route path={getLastSegment(spacePaths.home, undefined, true)} element={<SpaceHome />} />
    </Routes>
  )
}

export default SpaceRoutes