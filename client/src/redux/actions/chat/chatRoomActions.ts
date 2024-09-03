import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchChatsParams } from '../../../types/module/redux/chat/reduxChatTypes';
import { AsyncThunkState } from '../../../types/module/redux/asyncThunkTypes';
import { fulfillWithState } from '../../../functions/redux/reduxUtils';
import serviceFactory from '../../../firebase/db/factory';
import { RootState } from '../../../types/module/redux/reduxTypes';
import { TimestampConvertedDocumentMap } from '../../../types/firebase/db/formatTypes';
import { convertTimestampsToNumbers } from '../../../functions/db/dataFormatUtils';
import { ChatData } from '../../../types/firebase/db/chat/chatRoomStructure';

export const fetchChats = createAsyncThunk<
  AsyncThunkState<TimestampConvertedDocumentMap<ChatData>>, 
  FetchChatsParams,
  { rejectValue: string }
>(
  'chatRoom/fetchChats',
  async ({ roomId, messageLimit, startAfterMessageId }, { getState, rejectWithValue }) => {
    try {
      const chatService = serviceFactory.createChatRoomChatService();
      const messages = await  chatService.getChatsInRoom(roomId, messageLimit, startAfterMessageId);

      const prevChats: TimestampConvertedDocumentMap<ChatData> = (getState() as RootState).chatRoomSlice.messages;
      const messageIdMap: TimestampConvertedDocumentMap<ChatData> = {
        ...prevChats,
      }
      messages.forEach(message => {
          messageIdMap[message.docId] = convertTimestampsToNumbers(message);
      });
      
      return fulfillWithState(convertTimestampsToNumbers(messageIdMap));
    } catch (error) {
      return rejectWithValue('Failed to fetch chat messages.');
    }
  }
);
