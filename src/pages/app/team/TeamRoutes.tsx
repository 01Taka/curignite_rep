import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateTeam from './create/CreateTeam'
import JoinTeam from './join/JoinTeam'
import { toRelativePaths, teamPaths } from '../../../types/path/appPaths'
import Team from './team/Team'
import { NavigationItems } from '../../navigation/navigationTypes'
import TeamPreprocess from './TeamPreprocess'
import TeamNavigation from './navigation/teamNavigation/TeamNavigation'
import OnMobilePages from '../../util/OnMobilePages'
import TeamBasePage from './TeamBasePage'
import IndexNavigation from './navigation/indexNavigation/IndexNavigation'

const TeamRoutes: FC = () => {
  return (
    <>
      <TeamPreprocess />
      <Routes>
        <Route path='' element={<TeamBasePage />} />
        <Route path={toRelativePaths(teamPaths.index)} element={<Team />}/>
        <Route path={toRelativePaths(teamPaths.create, "/:name")} element={<CreateTeam />} />
        <Route path={toRelativePaths(teamPaths.join)} element={<JoinTeam />} />
      </Routes>
      <OnMobilePages>
        <Route path={toRelativePaths(teamPaths.list)} element={<IndexNavigation />}/>
      </OnMobilePages>
    </>
  )
}

export const teamDesktopNavigation: NavigationItems[] = [
  {
    path: teamPaths.index,
    pathParameters: true,
    contentsTopBar: {
      children: <TeamNavigation />
    },
    sideList: {
      children: <IndexNavigation />,
    },
  }
]

export const teamMobileNavigation: NavigationItems[] = [
  {
    path: teamPaths.index,
    exclusionPaths: [teamPaths.list],
    pathParameters: true,
    contentsTopBar: {
      children: <TeamNavigation />,
    },
  }
]

export default TeamRoutes