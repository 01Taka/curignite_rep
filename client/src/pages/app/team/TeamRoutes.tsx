import React, { FC, useEffect } from 'react'
import { Route, Routes, useNavigate, useParams } from 'react-router-dom'
import TeamIndexNavigation from '../../../features/app/team/navigation/TeamIndexNavigation'
import { teamPaths } from '../../../types/path/mainPaths'
import { getLastSegment, replaceParams } from '../../../functions/path/pathUtils'
import TeamHome from './home/TeamHome'
import TeamMenu from '../../../features/app/team/action/menu/TeamMenu'
import CreateTeam from '../../../features/app/team/joinCreate/create/CreateTeam'
import { PathParam } from '../../../types/path/paths'
import { useAppDispatch } from '../../../redux/hooks'
import { setCurrentTeamId } from '../../../redux/slices/team/teamSlice'

const TeamRoutes: FC = () => {
  const prams = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (prams["*"]?.split("/")[0] !== "home") {
      dispatch(setCurrentTeamId(""));
    }
  }, [prams, dispatch])

  return (
    <>
      <Routes>
        <Route path='' element={<TeamIndexNavigation />} />
        <Route path={getLastSegment(teamPaths.home, true)} element={<TeamHome />} />
        <Route path={getLastSegment(teamPaths.menu)} element={<TeamMenu />} />
        <Route
          path={getLastSegment(teamPaths.create)}
          element={<CreateTeam
          onCreatedTeam={(result) => navigate(replaceParams(teamPaths.home, { [PathParam.TeamId]: result.documentRef.id }))}/>}
        />
      </Routes>
    </>
  )
}

export default TeamRoutes
