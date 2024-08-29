import React, { FC } from 'react'
import { Member } from '../../../../../types/firebase/db/baseTypes'
import TeamMemberContainer from './TeamMemberContainer';

interface TeamMembersProps {
  members: Member[];
}

const TeamMembers: FC<TeamMembersProps> = ({ members }) => {
  return (
    <div>
      {members && members.map((member) => (
        <TeamMemberContainer member={member}/>
      ))}
    </div>
  )
}

export default TeamMembers