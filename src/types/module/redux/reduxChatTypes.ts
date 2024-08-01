import ChatRoomChatsDB from "../../../firebase/db/app/chat/subCollection/chatRoomChats";
import { ChatIdMap } from "../../firebase/db/chat/chatsTypes";

export interface FetchChatsParams {
    messageLimit: number;
    startAfterMessageId?: string;
    chatRoomChatsDB: ChatRoomChatsDB;
}

export interface ChatRoomSliceState {
    currentRoomId: string | null;
    startAfterMessageId: string | null;
    messages: ChatIdMap;
    messageStatus: 'idle' | 'loading' | 'failed';
}