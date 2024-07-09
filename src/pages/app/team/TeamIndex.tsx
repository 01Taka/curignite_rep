import React, { FC } from 'react'
import { Route, Routes } from 'react-router-dom'
import CreateTeam from './create/CreateTeam'
import JoinTeam from './join/JoinTeam'
import Team from './team/Team'

const TeamIndex: FC = () => {
  return (
    <Routes>
        <Route path='*' element={<Team />} />
        <Route path='create/:name' element={<CreateTeam />} />
        <Route path='join' element={<JoinTeam />} />
    </Routes>
  )
}

export default TeamIndex