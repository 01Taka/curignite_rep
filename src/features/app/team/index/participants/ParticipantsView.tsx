import React, { FC } from 'react'
import { MemberData } from '../../../../../types/firebase/db/baseTypes';

interface ParticipantsViewProps {
    members: MemberData[];
    myTeam: boolean;
}

const ParticipantsView: FC<ParticipantsViewProps> = ({ members, myTeam }) => {
  return (
    <div>
        {members && members.map((user, index) => (
            <div key={index}>
                {user.userData.username}
                {user.role}
            </div>
        ))}
    </div>
  )
}

export default ParticipantsView