import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchChats } from '../../actions/chat/chatRoomActions';
import { ChatRoomSliceState } from '../../../types/module/redux/chat/reduxChatTypes';
import { addAsyncCases, isSuccessfulPayload } from '../../../functions/redux/reduxUtils';
import { AsyncThunkStatus } from '../../../types/module/redux/asyncThunkTypes';

const initialState: ChatRoomSliceState = {
  currentRoomId: null,
  startAfterMessageId: null,
  messages: {},
  messageFetchStatus: { state: AsyncThunkStatus.IDLE },
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
    },
  },
  extraReducers: (builder) => {
    addAsyncCases(builder, fetchChats, (state, payload) => {
      state.messageFetchStatus = payload;
      if (isSuccessfulPayload(payload)) {
        state.messages = payload.value;
      }
    })
  },
});

export const { setCurrentRoomId, setStartAfterMessageId, clearChatRoom } = chatRoomSlice.actions;
export default chatRoomSlice.reducer;
