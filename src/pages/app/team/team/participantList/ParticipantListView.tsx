import React, { FC } from 'react'
import { UserWithTeamRole } from '../../../../../types/firebase/db/teamsTypes'

interface ParticipantListViewProps {
    participants: UserWithTeamRole[];
    myTeam: boolean;
}

const ParticipantListView: FC<ParticipantListViewProps> = ({ participants, myTeam }) => {
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

export default ParticipantListView