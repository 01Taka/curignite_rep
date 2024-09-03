import { ChatData } from "../../../firebase/db/chat/chatRoomStructure";
import { TimestampConvertedDocumentMap } from "../../../firebase/db/formatTypes";
import { AsyncThunkState } from "../asyncThunkTypes";

export interface FetchChatsParams {
    roomId: string;
    messageLimit: number;
    startAfterMessageId?: string;
}

export interface ChatRoomSliceState {
    currentRoomId: string | null;
    startAfterMessageId: string | null;
    messages: TimestampConvertedDocumentMap<ChatData>;
    messageFetchStatus: AsyncThunkState<TimestampConvertedDocumentMap<ChatData>>;
}
