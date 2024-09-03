import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateTeam from './actions/CreateTeam'
import TeamIndexNavigation from '../../../features/app/team/navigation/TeamIndexNavigation'
import { teamPaths } from '../../../types/path/mainPaths'
import { getLastSegment } from '../../../functions/path/pathUtils'
import TeamHome from './home/TeamHome'
import TeamMenu from '../../../features/app/team/action/menu/TeamMenu'

const TeamRoutes: FC = () => {
  return (
    <>
      <Routes>
        <Route path='' element={<TeamIndexNavigation />} />
        <Route path={getLastSegment(teamPaths.home, true)} element={<TeamHome />} />
        <Route path={getLastSegment(teamPaths.menu)} element={<TeamMenu />} />
        <Route path={getLastSegment(teamPaths.create)} element={<CreateTeam />} />
      </Routes>
    </>
  )
}

export default TeamRoutes
