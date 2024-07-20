import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateTeam from './create/CreateTeam'
import JoinTeam from './join/JoinTeam'
import { toRelativePaths, teamPaths } from '../../../types/appPaths'
import Team from './team/Team'
import { NavigationItems } from '../../navigation/navigationTypes'
import TeamList from './navigation/teamList/TeamList'
import { useAppSelector } from '../../../redux/hooks'

const TeamRoutes: FC = () => {
  const appSlice = useAppSelector(state => state.appSlice);
  const isMobile = appSlice.isMobile;
  return (
    <Routes>
      <Route path={toRelativePaths(teamPaths.index, "/:teamId")} element={<Team />} />
      <Route path={toRelativePaths(teamPaths.create, "/:name")} element={<CreateTeam />} />
      <Route path={toRelativePaths(teamPaths.join)} element={<JoinTeam />} />
    </Routes>
  )
}

export const teamDesktopNavigation: NavigationItems[] = [
  {
    path: teamPaths.index,
    pathParameters: true,
    sideList: {
      children: <TeamList />
    },
  }
]

export const teamMobileNavigation: NavigationItems[] = [
  {
    path: `${teamPaths.index}/unspecified`
    
  }
]

export default TeamRoutes