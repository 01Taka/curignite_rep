import React, { FC, useEffect, useState, useCallback } from 'react';
import ChatRoom from '../../../../../components/app/chat/ChatRoom';
import { useAppSelector } from '../../../../../redux/hooks';
import serviceFactory from '../../../../../firebase/db/factory';

const TeamChat: FC = () => {
  console.log("SUC");
  
  const { teams, currentTeamId } = useAppSelector(state => state.teamSlice);
  const currentTeam = teams[currentTeamId];
  const [chatRoomId, setChatRoomId] = useState("");

  const updateChatRoomId = useCallback(async () => {
    try {
      const teamGroupsDB = serviceFactory.createTeamGroupsDB(currentTeam.docId);
      const group = await teamGroupsDB.getTeamGroup(currentTeam.wholeGroupId);
      if (group) {
        console.log(group.chatroomId);
        
        setChatRoomId(group.chatroomId);
      }
    } catch (error) {
      console.error('Failed to update chat room ID:', error);
    }
  }, [currentTeam]);

  useEffect(() => {
    if (currentTeam) {
      updateChatRoomId();
    }
  }, [currentTeam, updateChatRoomId]);

  return <ChatRoom chatRoomId={chatRoomId} />;
};

export default TeamChat;
