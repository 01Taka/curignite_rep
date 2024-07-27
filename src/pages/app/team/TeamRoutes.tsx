import React, { FC, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { updateTeamData } from '../../../redux/actions/team/updateTeamData'
import { toRelativePaths, teamPaths } from '../../../types/path/appPaths'
import JoinCreateTeam from './actions/JoinCreateTeam'
import TeamIndex from './index/TeamIndex'
import OnMobilePages from '../../util/OnMobilePages'
import TeamBasePage from './TeamBasePage'
import CreateTeam from './actions/CreateTeam'
import TeamIndexNavigation from '../../../features/app/team/navigation/indexNavigation/TeamIndexNavigation'

const TeamRoutes: FC = () => {
  const { uid } = useAppSelector(state => state.userDataSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (uid) {
      dispatch(updateTeamData(uid));
    }
  }, [dispatch, uid]);

  return (
    <>
      <Routes>
        <Route path='' element={<TeamBasePage />} />
        <Route path={toRelativePaths(teamPaths.index)} element={<TeamIndex />}/>
        <Route path={toRelativePaths(teamPaths.create, "/:name")} element={<CreateTeam />} />
        <Route path={toRelativePaths(teamPaths.joinCreate)} element={<JoinCreateTeam />} />
      </Routes>
      <OnMobilePages>
        <Route path={toRelativePaths(teamPaths.list)} element={<TeamIndexNavigation />}/>
      </OnMobilePages>
    </>
  )
}

export default TeamRoutes
