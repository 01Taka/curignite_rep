import React, { FC } from 'react';
import ChatRoom from '../../../../../components/app/chat/ChatRoom';
import { useAppSelector } from '../../../../../redux/hooks';

const TeamChat: FC = () => {
  const { teams, currentTeamId } = useAppSelector(state => state.teamSlice);
  const currentTeam = teams[currentTeamId];

  return <ChatRoom chatRoomId={currentTeam.chatRoomId} />;
};

export default TeamChat;
