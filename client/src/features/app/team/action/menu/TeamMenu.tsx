import React, { FC } from 'react'
import JoinCreateTeam from '../../joinCreate/JoinCreateTeam'
import JoinRequestsForUser from '../../joinCreate/joinRequest/JoinRequestsForUser'

const TeamMenu: FC = () => {
  return (
    <div className='mt-20'>
      <JoinCreateTeam />
      <JoinRequestsForUser />
    </div>
  )
}

export default TeamMenu