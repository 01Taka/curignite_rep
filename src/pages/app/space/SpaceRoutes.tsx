import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import SpaceBasePage from './SpaceBasePage'
import SpaceStart from './start/SpaceStart'
import { spacePaths, toRelativePaths } from '../../../types/path/appPaths'

const SpaceRoutes: FC = () => {
  return (
    <Routes>
        <Route path='' element={<SpaceBasePage />} />
        <Route path={toRelativePaths(spacePaths.start, "/*")} element={<SpaceStart />} />
    </Routes>
  )
}

export default SpaceRoutes