import { createAsyncThunk } from '@reduxjs/toolkit';
import { ChatData } from '../../../types/firebase/db/chat/chatsTypes';
import { FetchChatsParams } from '../../../types/module/redux/reduxChatTypes';

export const fetchChats = createAsyncThunk<
  ChatData[], 
  FetchChatsParams, 
  { rejectValue: string }
>(
  'chatRoom/fetchChats',
  async ({ messageLimit, startAfterMessageId, chatRoomChatsDB }, { rejectWithValue }) => {
    try {
      const messages = await chatRoomChatsDB.getChatsInRoom(messageLimit, startAfterMessageId);
      return messages;
    } catch (error) {
      return rejectWithValue('Failed to fetch chat messages.');
    }
  }
);
