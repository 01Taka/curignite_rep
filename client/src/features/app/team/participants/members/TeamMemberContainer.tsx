import React, { FC } from 'react';
import { Member } from '../../../../../types/firebase/db/baseTypes';
import { Avatar } from '@mui/material';

interface TeamMemberContainerProps {
  member: Member;
}

const TeamMemberContainer: FC<TeamMemberContainerProps> = ({ member }) => {
  return (
    <div key={member.userId} className="flex items-center mb-4">
      <Avatar alt={`${member.username}のアイコン`} src={member.iconUrl} sx={{ width: 48, height: 48 }} />
      <div className="ml-4">
        <div className="font-semibold">{member.username}</div>
        <div className="text-sm text-gray-500">{member.role}</div>
      </div>
    </div>
  );
};

export default TeamMemberContainer;
