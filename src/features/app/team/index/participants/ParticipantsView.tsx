import React, { FC } from 'react'
import { UserWithTeamRole } from '../../../../../types/firebase/db/teamsTypes'

interface ParticipantsViewProps {
    participants: UserWithTeamRole[];
    myTeam: boolean;
}

const ParticipantsView: FC<ParticipantsViewProps> = ({ participants, myTeam }) => {
  return (
    <div>
        {participants.map((user, index) => (
            <div key={index}>
                {user.userData.username}
                {user.role}
            </div>
        ))}
    </div>
  )
}

export default ParticipantsView