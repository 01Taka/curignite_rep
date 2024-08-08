import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import JoinCreateTeam from './actions/JoinCreateTeam'
import TeamIndex from './index/TeamIndex'
import OnMobilePages from '../../util/OnMobilePages'
import TeamBasePage from './TeamBasePage'
import CreateTeam from './actions/CreateTeam'
import TeamIndexNavigation from '../../../features/app/team/navigation/indexNavigation/TeamIndexNavigation'
import { teamPaths } from '../../../types/path/mainPaths'
import { getLastSegment } from '../../../functions/path/pathUtils'

const TeamRoutes: FC = () => {
  return (
    <>
      <Routes>
        <Route path='' element={<TeamBasePage />} />
        <Route path={getLastSegment(teamPaths.base)} element={<TeamIndex />}/>
        <Route path={getLastSegment(teamPaths.create)} element={<CreateTeam />} />
        <Route path={getLastSegment(teamPaths.menu)} element={<JoinCreateTeam />} />
      </Routes>
      <OnMobilePages>
        <Route path={getLastSegment(teamPaths.list)} element={<TeamIndexNavigation />}/>
      </OnMobilePages>
    </>
  )
}

export default TeamRoutes
