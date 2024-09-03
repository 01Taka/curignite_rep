import React, { FC } from 'react';
import { Avatar } from '@mui/material';
import { TeamMemberData } from '../../../../../types/firebase/db/team/teamStructure';
import { UserData } from '../../../../../types/firebase/db/user/userStructure';

interface TeamMemberContainerProps {
  member: TeamMemberData;
  userData: UserData;
}

const TeamMemberContainer: FC<TeamMemberContainerProps> = ({ member, userData }) => {
  return (
    <div key={member.docId} className="flex items-center mb-4">
      <Avatar alt={`${userData.username}のアイコン`} src={userData.iconUrl} sx={{ width: 48, height: 48 }} />
      <div className="ml-4">
        <div className="font-semibold">{userData.username}</div>
        <div className="text-sm text-gray-500">{member.role}</div>
      </div>
    </div>
  );
};

export default TeamMemberContainer;
