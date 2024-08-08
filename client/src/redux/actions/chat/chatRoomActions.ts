import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchChatsParams } from '../../../types/module/redux/chat/reduxChatTypes';
import { convertTimestampsToNumbers, ConvertTimestampToNumber } from '../../../functions/db/dbUtils';
import { AsyncThunkState } from '../../../types/module/redux/asyncThunkTypes';
import { fulfillWithState } from '../../../functions/redux/reduxUtils';
import { ChatIdMap } from '../../../types/firebase/db/chat/chatsTypes';
import serviceFactory from '../../../firebase/db/factory';
import { RootState } from '../../../types/module/redux/reduxTypes';

export const fetchChats = createAsyncThunk<
  AsyncThunkState<ConvertTimestampToNumber<ChatIdMap>>, 
  FetchChatsParams,
  { rejectValue: string }
>(
  'chatRoom/fetchChats',
  async ({ roomId, messageLimit, startAfterMessageId }, { getState, rejectWithValue }) => {
    try {
      const chatsDB = serviceFactory.createChatRoomsChatsDB(roomId);
      const messages = await  chatsDB.getChatsInRoom(messageLimit, startAfterMessageId);

      const prevChats: ConvertTimestampToNumber<ChatIdMap> = (getState() as RootState).chatRoomSlice.messages;
      const messageIdMap: ConvertTimestampToNumber<ChatIdMap> = {
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
