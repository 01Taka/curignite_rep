import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatData } from '../../../types/firebase/db/chat/chatsTypes';
import { fetchChats } from '../../actions/chat/chatRoomActions';
import { ChatRoomSliceState } from '../../../types/module/redux/reduxChatTypes';
import { ConvertTimestampToNumber } from '../../../functions/db/dbUtils';

const initialState: ChatRoomSliceState = {
  currentRoomId: null,
  startAfterMessageId: null,
  messages: {},
  messageStatus: 'idle',
};

const chatRoomSlice = createSlice({
  name: 'chatRoom',
  initialState,
  reducers: {
    setCurrentRoomId(state, action: PayloadAction<string | null>) {
      state.currentRoomId = action.payload;
    },
    setStartAfterMessageId(state, action: PayloadAction<string | null>) {
      state.startAfterMessageId = action.payload;
    },
    clearChatRoom(state) {
      state.currentRoomId = null;
      state.startAfterMessageId = null;
      state.messages = {};
      state.messageStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.messageStatus = 'loading';
      })
      .addCase(fetchChats.fulfilled, (state, action: PayloadAction<ConvertTimestampToNumber<ChatData[]>>) => {
        action.payload.forEach(message => {
          state.messages[message.docId] = message;
        });
        state.messageStatus = 'idle';
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.messageStatus = 'failed';
        console.error(action.payload);
      });
  },
});

export const { setCurrentRoomId, setStartAfterMessageId, clearChatRoom } = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
