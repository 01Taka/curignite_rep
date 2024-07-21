import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateTeam from './create/CreateTeam'
import JoinTeam from './join/JoinTeam'
import { toRelativePaths, teamPaths, paths } from '../../../types/path/appPaths'
import Team from './team/Team'
import { NavigationItems } from '../../navigation/navigationTypes'
import TeamList from './navigation/teamList/TeamList'
import TeamPreprocess from './TeamPreprocess'
import TeamNavigation from './navigation/teamNavigation/TeamNavigation'
import OnMobilePages from '../../util/OnMobilePages'

const TeamRoutes: FC = () => {
  return (
    <>
      <TeamPreprocess />
      <Routes>
        <Route path={toRelativePaths(teamPaths.index)} element={<Team />} />
        <Route path={toRelativePaths(teamPaths.create, "/:name")} element={<CreateTeam />} />
        <Route path={toRelativePaths(teamPaths.join)} element={<JoinTeam />} />
      </Routes>
      <OnMobilePages>
        <Route path={`${toRelativePaths(teamPaths.index)}/list`} element={<TeamList />}/>
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
      children: <TeamList />,
    },
  }
]

export const teamMobileNavigation: NavigationItems[] = [
  {
    path: teamPaths.index,
    exclusionPaths: [`${paths.main.team.index}/list`],
    pathParameters: true,
    contentsTopBar: {
      children: <TeamNavigation />,
    },
  }
]

export default TeamRoutes